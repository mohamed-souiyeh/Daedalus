export var pageIndexs;
(function (pageIndexs) {
    pageIndexs[pageIndexs["summary"] = 0] = "summary";
    pageIndexs[pageIndexs["SW_corner"] = 1] = "SW_corner";
    pageIndexs[pageIndexs["S_wall"] = 2] = "S_wall";
    pageIndexs[pageIndexs["SE_corner"] = 3] = "SE_corner";
    pageIndexs[pageIndexs["W_wall"] = 4] = "W_wall";
    pageIndexs[pageIndexs["cell"] = 5] = "cell";
    pageIndexs[pageIndexs["E_wall"] = 6] = "E_wall";
    pageIndexs[pageIndexs["NW_corner"] = 7] = "NW_corner";
    pageIndexs[pageIndexs["N_wall"] = 8] = "N_wall";
    pageIndexs[pageIndexs["NE_corner"] = 9] = "NE_corner";
})(pageIndexs || (pageIndexs = {}));
export var inputDefaults;
(function (inputDefaults) {
    inputDefaults[inputDefaults["DELAY"] = 20] = "DELAY";
    inputDefaults[inputDefaults["MINDELAY"] = 16] = "MINDELAY";
    inputDefaults[inputDefaults["MAXDELAY"] = 10000] = "MAXDELAY";
    inputDefaults[inputDefaults["ISPAUSED"] = true] = "ISPAUSED";
    inputDefaults[inputDefaults["DEBUGMODEON"] = true] = "DEBUGMODEON";
    inputDefaults[inputDefaults["DEBUGBOOKLETISON"] = true] = "DEBUGBOOKLETISON";
    inputDefaults[inputDefaults["MOUSECELLPOSISLOCKED"] = false] = "MOUSECELLPOSISLOCKED";
    inputDefaults[inputDefaults["DEFAULTDEBUGPAGEINDEX"] = 5] = "DEFAULTDEBUGPAGEINDEX";
    //NOTE - debug booklet pages sizes
    inputDefaults[inputDefaults["CELLDEBUGPAGELENGTH"] = 290] = "CELLDEBUGPAGELENGTH";
    inputDefaults[inputDefaults["CELLDEBUGPAGEWIDTH"] = 420] = "CELLDEBUGPAGEWIDTH";
    inputDefaults[inputDefaults["CORNERDEBUGPAGELENGTH"] = 250] = "CORNERDEBUGPAGELENGTH";
    inputDefaults[inputDefaults["CORNERDEBUGPAGEWIDTH"] = 150] = "CORNERDEBUGPAGEWIDTH";
    inputDefaults[inputDefaults["WALLDEBUGPAGELENGTH"] = 250] = "WALLDEBUGPAGELENGTH";
    inputDefaults[inputDefaults["WALLDEBUGPAGEWIDTH"] = 150] = "WALLDEBUGPAGEWIDTH";
    inputDefaults[inputDefaults["SUMMARYDEBUGPAGELENGTH"] = 250] = "SUMMARYDEBUGPAGELENGTH";
    inputDefaults[inputDefaults["SUMMARYDEBUGPAGEWIDTH"] = 250] = "SUMMARYDEBUGPAGEWIDTH";
})(inputDefaults || (inputDefaults = {}));
