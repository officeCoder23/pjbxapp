Certainly! Here's the updated version of the README file using "PJBX" instead of "nkp":

# Welcome to BlaqPageX!

****Disclaimer**: BlaqPageX and all its projects were created for research purposes only. By using BlaqPageX, you agree to take full responsibility for any use cases. The developer(s) of @blaqpagex have ZERO responsibility for any actions or results from using BlaqPageX.**

## This is a developer guide on extending **BlaqPageX**.

Throughout this documentation, **BlaqPageX** will be referred to as **PJBX** (which is the binary the projects run on).

# Extending PJBX

**PJBX** binary is a phishing app that does both reverse proxy and PHP rendering at the same time. On its own, it can do no such work; it requires configuration files called projects to perform well.

For developers familiar with Evilginx2/Modlishka, migrating to PJBX will be fairly easy. The key difference is that PJBX configurations are in JSON and can be further extended with JavaScript.

## Features of PJBX

1. Support Reverse Proxy
2. Support PHP Rendering
3. Project files are in JSON
4. Project files can also be extended with JavaScript for wider application
5. Support importing other projects' code
6. Support switching projects at runtime and switching back based on URL patterns
7. Capture inputs based on domains and PHP files
8. Capture cookies automatically
9. Support EXIT Triggers

All features can be easily accessed with the JSON configuration schema.

## JSON Config Schema

> NOTE: Each KEY will be fully explained in the next section. The table consists of the Name/Description.

| KEY | BRIEF DESCRIPTION OF KEY |
|--|--|
| SCHEME | **{REQUIRED}** Name of the project (should be the directory name also) |
| CURRENT_DOMAIN | **{REQUIRED}** Domain name that the project executes on |
| START_PATH | **{REQUIRED}** First path the user is redirected to until entering the link |
| PATTERNS | **{DEFAULT: []}** List of patterns to be used to replace in the given HTML |
| FORCE_PROXY | **{DEFAULT: []}** URL paths to force proxy on and not PHP |
| PHP_PROCESSOR | **{DEFAULT: {}}** Dictionary of paths and objects to control PHP flow |
| COOKIE_PATH | **{DEFAULT: []}** Paths that trigger sending cookies |
| EXIT_TRIGGER_PATH | **{DEFAULT: {}}** Paths that trigger redirection to exit links |
| EXIT_URL | **{DEFAULT: ""}** Link to redirect to an exit link |
| EXTRA_COMMANDS | **{DEFAULT: []}** List of commands to execute |
| CAPTURES | **{DEFAULT: {}}** Dictionary of objects to capture from form inputs |
| IMPORTED_MODULES | **{DEFAULT: {}}** Imported modules would be loaded here |
| PRE_HANDLERS | **{DEFAULT: {}}** Extra classes to load based on the trigger path |
| EXTERNAL_FILTERS | **{DEFAULT: {}}** Extra domains to filter not related to the main domain |
| PROXY_REQUEST | **{DEFAULT: "DEFAULT"}** **IGNORE SEE BELOW** |
| PROXY_RESPONSE | **{DEFAULT: "DEFAULT"}** **IGNORE SEE BELOW** |
| DEFAULT_PRE_HANDLER | **{DEFAULT: "DEFAULT"}** **IGNORE SEE BELOW** |

> Unless you plan to write JS code to intercept requests, responses, or handler classes, the commands are not necessary:
PROXY_REQUEST: request
PROXY_RESPONSE: response
DEFAULT_PRE_HANDLER: handler

All projects should be named main.js under PJBX/projects/SCHEME/main.js, where SCHEME is the project scheme mentioned in the main.js config file.jn