---
title: Hijack DLLs through proxying
description: Creating an ASI loader for GTA San Andreas
date: 2024-05-01
tags: ["windows", "systems"]
---

Hijacking the execution flow of a binary by reexporting methods of a DLL it loads on it's startup procedure.

# Contents

# Introduction

I delved into this topic because I wanted to create an [ASI Loader](<https://gtamods.com/wiki/ASI_Loader_(SA)>) for Grand Theft Auto: San Andreas. An ASI Loader, broadly speaking, enables the loading of custom libraries with the `.asi` extension into the game process. During game startup, the loader scans the game's root folder and loads all the files with the corresponding extensions, typically standard dynamic libraries (`.dll`) with renamed extensions. Injecting DLLs into a process is a fairly easy process if you use an injector (i.e. [Extreme Injector](https://www.unknowncheats.me/forum/general-programming-and-reversing/213038-extreme-injector-v3-7-a.html)), but that quickly becomes unpractical if you want to load multiple DLLs into a process, as you'd have to load them, by hand (automatically impossible through this route), on every start up.

# DLL hijacking in a nutshell

A [DLL](https://learn.microsoft.com/en-us/troubleshoot/windows-client/setup-upgrade-and-drivers/dynamic-link-library) is a library housing both code and data, accessible by multiple programs concurrently. Leveraging a DLL allows for the modularization of a program into distinct components, thereby enhancing its load time due to the separate module loading.

When a binary executes on a Windows system, it may actively load functions and data from various DLLs during it's lifetime. DLL hijacking involves replacing a legitimate DLL with a another one, thereby intercepting the binary's execution flow. DLL proxying constitutes a form of DLL hijacking, wherein a genuine DLL, such as `bar.dll`, is renamed to `bar1.dll`. Subsequently, a DLL is introduced in place of `bar.dll`, bearing identical exported functions as `bar1.dll`. After the DLL is hijacked, the sequence of events when a program `foo.exe` invokes an exported function (such as `ExportedFunction`) from `bar.dll` unfolds as follows:

1. `bar.dll` gets loaded into the calling process and it's code is executed;
2. `bar.dll` forwards the call to `ExportedFunction` to `bar1.dll`;
3. `bar1.dll` executes `ExportedFunction`.

Broadly speaking, the following diagram illustrates the execution flow of a program before and after the DLL is hijacked:

![Before hijacking](https://kroki.io/mermaid/svg/eNpLy8kvT85ILCpR8AniUgACx-i0_Hy91IrUWAVdXZ_8xBSfzKSixKJKXV07BafopMQivZScnFiwUiegCteKgvyikmKQrHO0A4SXmuJWmpdckpmfB1HnCFTnnloSUJSf7JiSUpRaDFLuzAWWcwEaWQU2UgFkhisWMwA3kDMW)

![After hijacking](https://kroki.io/mermaid/svg/eNpLy8kvT85ILCpR8AniUgACx-i0_Hy91IrUWDDXKTopschQLyUnB8J3jnZwrSjILypJTXErzUsuyczPg0i4gBQi1LliUwexQEFX1yc_McUnM6kosahSV9fOBWIAUByipRgo5gyxHUXMFa7fOTEnB6xKAeIoBV09t_yi8sSilGI9oDoAOoY8NA==)

## Finding which DLLs the game loads

The first part of this process is finding a DLL to hijack. You could do guess work or use a debugger to view what DLLs are loaded, but I've opted for [Sysinternals Procmon](https://learn.microsoft.com/en-us/sysinternals/downloads/procmon), "an advanced monitoring tool for Windows that shows real-time file system, registry and process/thread activity".

Procmon accepts a list of display filters which allows you to filter the noise of the output. For this particular case, I want to include the following filters:

- `PROCCESS NAME    IS  gta_sa.exe  INCLUDE` (only output logs for the `gta_sa.exe` process)
- `PATH ENDS WITH   .dll    INCLUDE` (only output logs where the path of the object subject to an operation ends in `.dll`)
- `PATH EXCLUDES    <gta_sa.exe location>   EXCLUDE` (only output logs where the path for the DLL is in the same folder as `gta_sa.exe`)

Given these filters and upon launching `gta_sa.exe`, you will see this output in Procmon ([enlarged](https://i.imgur.com/lHnZeyJ.png)):

![Procmon output](https://i.imgur.com/lHnZeyJ.png)

We see that `eax.dll` and `vorbis.dll` are successfully loaded from the game's folder. One of these may very well be our target: **we'll go for `vorbisFile.dll`.**

# Crafting a DLL

The Visual Studio IDE has a template for creating DLLs. If you start a new project with said template, the generator will create a `dllmain.cpp` file in the root directory.

We won't do much with it for now, but it's a good start.

## Retrieving exported functions

There are countless programs which will take a look at a DLL and tell you which functions it exports (to put it briefly, these programs parse the EAT, the Export Address Table, of a DLL file which follows the [PE Format](https://learn.microsoft.com/en-us/windows/win32/debug/pe-format)).

I used [DLL Export Viewer](https://www.nirsoft.net/utils/dll_export_viewer.html) from Nirsoft. The executable allows one to export into an HTML file the exported functions from a DLL. Loading `vorbisFile.dll` into the program yields the following output:

![](https://i.imgur.com/p8uYZ4d.png)

If you go into `View -> HTML Report - All Functions`, you will be presented with an HTML file which lists all the exported functions in tabular form:

![](https://i.imgur.com/6DjETyf.png)

## Creating pragmas

We'll need to export each of these functions in our very own DLL. **Otherwise, when the binary (i.e. `gta_sa.exe`) tries to call a function from `vorbisFile.dll`, that function won't be found in our DLL, resulting in the binary crashing.** To achieve that, we'll use [`comment pragma`](https://learn.microsoft.com/en-us/cpp/preprocessor/comment-c-cpp?view=msvc-170). We're interested in the [`linker`](https://learn.microsoft.com/en-us/cpp/preprocessor/comment-c-cpp?view=msvc-170#linker) + [`exclude`](https://learn.microsoft.com/en-us/cpp/build/reference/export-exports-a-function?view=msvc-170) combo. To put it briefly, for every exported function, we'll need to add this line in our DLL template:

```cpp
#pragma comment(linker,"/export:<function_name>=<filename>.<function_name>,@<ordinal>")
```

Because this is a tedious process, I created a Python script which operates on the file above (**which you must save to your machine**). It requires Beautiful Soup and Python 3.x. I'm going to rename `vorbisFile` to `vorbisFileHooked`:

```py
from bs4 import BeautifulSoup
import os

def main():
    page = open('./vf.html') # replace this with the file name
    soup = BeautifulSoup(page.read(), 'html.parser')

    # Find all the rows in the table
    rows = soup.find_all('tr')
    for row in rows:
    # Extract the function name, dll_orig, and ordinal
        data = row.find_all('td')
        if len(data) == 0:
            print("len 0")
            continue
        data = [t.getText().replace('<td bgcolor="#FFFFFF" nowrap="">', '').replace('</td>', '') for t in data]

        function_name = data[0]
        ordinal = data[3].split(" ")[0]
        full_path = data[5]
        filename_with_ext = os.path.basename(full_path)
        filename_without_ext = os.path.splitext(filename_with_ext)[0]
        dll_orig = "%sHooked" % filename_without_ext # vorbisFile --> vorbisFileHooked

        # Format the extracted data into the desired output format
        output = "#pragma comment(linker,\"/export:%s=%s.%s,@%s\")" % (function_name, dll_orig, function_name, ordinal)
        print(output)

if __name__ == '__main__':
    main()
```

Quickly after, the output is spit:

```cpp
#pragma comment(linker,"/export:ov_bitrate=vorbisFileHooked.ov_bitrate,@1")
#pragma comment(linker,"/export:ov_bitrate_instant=vorbisFileHooked.ov_bitrate_instant,@2")
#pragma comment(linker,"/export:ov_clear=vorbisFileHooked.ov_clear,@3")
...
#pragma comment(linker,"/export:ov_time_total=vorbisFileHooked.ov_time_total,@34")
```

## Putting it all together

To prove that the DLL hijacking worked, we'll show a message box with the text "Hello from the not-so-original vorbisFile.dll" when it is injected into `gta_sa.exe` and then resume the normal, expected execution flow.

If we paste the output generated from the step above into `dllmain.cpp` (after every include) and make the change to display the message box, this is how the source should look:

```cpp
#include <windows.h>

#pragma comment(linker,"/export:ov_bitrate=vorbisFileHooked.ov_bitrate,@1")
#pragma comment(linker,"/export:ov_bitrate_instant=vorbisFileHooked.ov_bitrate_instant,@2")
#pragma comment(linker,"/export:ov_clear=vorbisFileHooked.ov_clear,@3")
// All the other pragmas
#pragma comment(linker,"/export:ov_time_total=vorbisFileHooked.ov_time_total,@34")

BOOL APIENTRY DllMain (
    HMODULE hModule,
    DWORD   ul_reason_for_call,
    LPVOID  lpReserved)
{
    if (ul_reason_for_call == DLL_PROCESS_ATTACH) {
        MessageBoxW(NULL, L"Hello from the not-so-original vorbisFile.dll", L"carlos-menezes.com", 0);
    }
    return TRUE;
}
```

Compile for the 32-bit architecture and rename the build artifact to `vorbisFile.dll` `(a)`. In the root folder, rename the original `vorbisFile.dll` to `vorbisFileHooked.dll`. Copy `(a)` into the root folder. Now, when we run `gta_sa.exe`:

<div style="width: 100%; height: 0px; position: relative; padding-bottom: 41.875%;"><video controls width="100%">
<source src="https://i.imgur.com/h8dIV7N.mp4" type="video/mp4"></video></div>

I went on and implemented [sa-asi-loader](https://github.com/carlos-menezes/sa-asi-loader) using this very same technique and it works flawlessly, loading mods like the [Windowed Mode](https://github.com/ThirteenAG/III.VC.SA.WindowedMode) mod with no issues.
