(() => {
    "use strict";
    const modules_flsModules = {};
    function isWebp() {
        function testWebP(callback) {
            let webP = new Image;
            webP.onload = webP.onerror = function() {
                callback(2 == webP.height);
            };
            webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
        }
        testWebP((function(support) {
            let className = true === support ? "webp" : "no-webp";
            document.documentElement.classList.add(className);
        }));
    }
    let isMobile = {
        Android: function() {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function() {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function() {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function() {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function() {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function() {
            return isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows();
        }
    };
    function getHash() {
        if (location.hash) return location.hash.replace("#", "");
    }
    function setHash(hash) {
        hash = hash ? `#${hash}` : window.location.href.split("#")[0];
        history.pushState("", "", hash);
    }
    let _slideUp = (target, duration = 500, showmore = 0) => {
        if (!target.classList.contains("_slide")) {
            target.classList.add("_slide");
            target.style.transitionProperty = "height, margin, padding";
            target.style.transitionDuration = duration + "ms";
            target.style.height = `${target.offsetHeight}px`;
            target.offsetHeight;
            target.style.overflow = "hidden";
            target.style.height = showmore ? `${showmore}px` : `0px`;
            target.style.paddingTop = 0;
            target.style.paddingBottom = 0;
            target.style.marginTop = 0;
            target.style.marginBottom = 0;
            window.setTimeout((() => {
                target.hidden = !showmore ? true : false;
                !showmore ? target.style.removeProperty("height") : null;
                target.style.removeProperty("padding-top");
                target.style.removeProperty("padding-bottom");
                target.style.removeProperty("margin-top");
                target.style.removeProperty("margin-bottom");
                !showmore ? target.style.removeProperty("overflow") : null;
                target.style.removeProperty("transition-duration");
                target.style.removeProperty("transition-property");
                target.classList.remove("_slide");
                document.dispatchEvent(new CustomEvent("slideUpDone", {
                    detail: {
                        target
                    }
                }));
            }), duration);
        }
    };
    let _slideDown = (target, duration = 500, showmore = 0) => {
        if (!target.classList.contains("_slide")) {
            target.classList.add("_slide");
            target.hidden = target.hidden ? false : null;
            showmore ? target.style.removeProperty("height") : null;
            let height = target.offsetHeight;
            target.style.overflow = "hidden";
            target.style.height = showmore ? `${showmore}px` : `0px`;
            target.style.paddingTop = 0;
            target.style.paddingBottom = 0;
            target.style.marginTop = 0;
            target.style.marginBottom = 0;
            target.offsetHeight;
            target.style.transitionProperty = "height, margin, padding";
            target.style.transitionDuration = duration + "ms";
            target.style.height = height + "px";
            target.style.removeProperty("padding-top");
            target.style.removeProperty("padding-bottom");
            target.style.removeProperty("margin-top");
            target.style.removeProperty("margin-bottom");
            window.setTimeout((() => {
                target.style.removeProperty("height");
                target.style.removeProperty("overflow");
                target.style.removeProperty("transition-duration");
                target.style.removeProperty("transition-property");
                target.classList.remove("_slide");
                document.dispatchEvent(new CustomEvent("slideDownDone", {
                    detail: {
                        target
                    }
                }));
            }), duration);
        }
    };
    let _slideToggle = (target, duration = 500) => {
        if (target.hidden) return _slideDown(target, duration); else return _slideUp(target, duration);
    };
    let bodyLockStatus = true;
    let bodyLockToggle = (delay = 500) => {
        if (document.documentElement.classList.contains("lock")) bodyUnlock(delay); else bodyLock(delay);
    };
    let bodyUnlock = (delay = 500) => {
        let body = document.querySelector("body");
        if (bodyLockStatus) {
            let lock_padding = document.querySelectorAll("[data-lp]");
            setTimeout((() => {
                for (let index = 0; index < lock_padding.length; index++) {
                    const el = lock_padding[index];
                    el.style.paddingRight = "0px";
                }
                body.style.paddingRight = "0px";
                document.documentElement.classList.remove("lock");
            }), delay);
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    let bodyLock = (delay = 500) => {
        let body = document.querySelector("body");
        if (bodyLockStatus) {
            let lock_padding = document.querySelectorAll("[data-lp]");
            for (let index = 0; index < lock_padding.length; index++) {
                const el = lock_padding[index];
                el.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
            }
            body.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
            document.documentElement.classList.add("lock");
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    function spollers() {
        const spollersArray = document.querySelectorAll("[data-spollers]");
        if (spollersArray.length > 0) {
            const spollersRegular = Array.from(spollersArray).filter((function(item, index, self) {
                return !item.dataset.spollers.split(",")[0];
            }));
            if (spollersRegular.length) initSpollers(spollersRegular);
            let mdQueriesArray = dataMediaQueries(spollersArray, "spollers");
            if (mdQueriesArray && mdQueriesArray.length) mdQueriesArray.forEach((mdQueriesItem => {
                mdQueriesItem.matchMedia.addEventListener("change", (function() {
                    initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
                }));
                initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
            }));
            function initSpollers(spollersArray, matchMedia = false) {
                spollersArray.forEach((spollersBlock => {
                    spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
                    if (matchMedia.matches || !matchMedia) {
                        spollersBlock.classList.add("_spoller-init");
                        initSpollerBody(spollersBlock);
                        spollersBlock.addEventListener("click", setSpollerAction);
                    } else {
                        spollersBlock.classList.remove("_spoller-init");
                        initSpollerBody(spollersBlock, false);
                        spollersBlock.removeEventListener("click", setSpollerAction);
                    }
                }));
            }
            function initSpollerBody(spollersBlock, hideSpollerBody = true) {
                let spollerTitles = spollersBlock.querySelectorAll("[data-spoller]");
                if (spollerTitles.length) {
                    spollerTitles = Array.from(spollerTitles).filter((item => item.closest("[data-spollers]") === spollersBlock));
                    spollerTitles.forEach((spollerTitle => {
                        if (hideSpollerBody) {
                            spollerTitle.removeAttribute("tabindex");
                            if (!spollerTitle.classList.contains("_spoller-active")) spollerTitle.nextElementSibling.hidden = true;
                        } else {
                            spollerTitle.setAttribute("tabindex", "-1");
                            spollerTitle.nextElementSibling.hidden = false;
                        }
                    }));
                }
            }
            function setSpollerAction(e) {
                const el = e.target;
                if (el.closest("[data-spoller]")) {
                    const spollerTitle = el.closest("[data-spoller]");
                    const spollersBlock = spollerTitle.closest("[data-spollers]");
                    const oneSpoller = spollersBlock.hasAttribute("data-one-spoller");
                    const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
                    if (!spollersBlock.querySelectorAll("._slide").length) {
                        if (oneSpoller && !spollerTitle.classList.contains("_spoller-active")) hideSpollersBody(spollersBlock);
                        spollerTitle.classList.toggle("_spoller-active");
                        _slideToggle(spollerTitle.nextElementSibling, spollerSpeed);
                    }
                    e.preventDefault();
                }
            }
            function hideSpollersBody(spollersBlock) {
                const spollerActiveTitle = spollersBlock.querySelector("[data-spoller]._spoller-active");
                const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
                if (spollerActiveTitle && !spollersBlock.querySelectorAll("._slide").length) {
                    spollerActiveTitle.classList.remove("_spoller-active");
                    _slideUp(spollerActiveTitle.nextElementSibling, spollerSpeed);
                }
            }
            const spollersClose = document.querySelectorAll("[data-spoller-close]");
            if (spollersClose.length) document.addEventListener("click", (function(e) {
                const el = e.target;
                if (!el.closest("[data-spollers]")) spollersClose.forEach((spollerClose => {
                    const spollersBlock = spollerClose.closest("[data-spollers]");
                    if (spollersBlock.classList.contains("_spoller-init")) {
                        const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
                        spollerClose.classList.remove("_spoller-active");
                        _slideUp(spollerClose.nextElementSibling, spollerSpeed);
                    }
                }));
            }));
        }
    }
    function tabs() {
        const tabs = document.querySelectorAll("[data-tabs]");
        let tabsActiveHash = [];
        if (tabs.length > 0) {
            const hash = getHash();
            if (hash && hash.startsWith("tab-")) tabsActiveHash = hash.replace("tab-", "").split("-");
            tabs.forEach(((tabsBlock, index) => {
                tabsBlock.classList.add("_tab-init");
                tabsBlock.setAttribute("data-tabs-index", index);
                tabsBlock.addEventListener("click", setTabsAction);
                initTabs(tabsBlock);
            }));
            let mdQueriesArray = dataMediaQueries(tabs, "tabs");
            if (mdQueriesArray && mdQueriesArray.length) mdQueriesArray.forEach((mdQueriesItem => {
                mdQueriesItem.matchMedia.addEventListener("change", (function() {
                    setTitlePosition(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
                }));
                setTitlePosition(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
            }));
        }
        function setTitlePosition(tabsMediaArray, matchMedia) {
            tabsMediaArray.forEach((tabsMediaItem => {
                tabsMediaItem = tabsMediaItem.item;
                let tabsTitles = tabsMediaItem.querySelector("[data-tabs-titles]");
                let tabsTitleItems = tabsMediaItem.querySelectorAll("[data-tabs-title]");
                let tabsContent = tabsMediaItem.querySelector("[data-tabs-body]");
                let tabsContentItems = tabsMediaItem.querySelectorAll("[data-tabs-item]");
                tabsTitleItems = Array.from(tabsTitleItems).filter((item => item.closest("[data-tabs]") === tabsMediaItem));
                tabsContentItems = Array.from(tabsContentItems).filter((item => item.closest("[data-tabs]") === tabsMediaItem));
                tabsContentItems.forEach(((tabsContentItem, index) => {
                    if (matchMedia.matches) {
                        tabsContent.append(tabsTitleItems[index]);
                        tabsContent.append(tabsContentItem);
                        tabsMediaItem.classList.add("_tab-spoller");
                    } else {
                        tabsTitles.append(tabsTitleItems[index]);
                        tabsMediaItem.classList.remove("_tab-spoller");
                    }
                }));
            }));
        }
        function initTabs(tabsBlock) {
            let tabsTitles = tabsBlock.querySelectorAll("[data-tabs-titles]>*");
            let tabsContent = tabsBlock.querySelectorAll("[data-tabs-body]>*");
            const tabsBlockIndex = tabsBlock.dataset.tabsIndex;
            const tabsActiveHashBlock = tabsActiveHash[0] == tabsBlockIndex;
            if (tabsActiveHashBlock) {
                const tabsActiveTitle = tabsBlock.querySelector("[data-tabs-titles]>._tab-active");
                tabsActiveTitle ? tabsActiveTitle.classList.remove("_tab-active") : null;
            }
            if (tabsContent.length) {
                tabsContent = Array.from(tabsContent).filter((item => item.closest("[data-tabs]") === tabsBlock));
                tabsTitles = Array.from(tabsTitles).filter((item => item.closest("[data-tabs]") === tabsBlock));
                tabsContent.forEach(((tabsContentItem, index) => {
                    tabsTitles[index].setAttribute("data-tabs-title", "");
                    tabsContentItem.setAttribute("data-tabs-item", "");
                    if (tabsActiveHashBlock && index == tabsActiveHash[1]) tabsTitles[index].classList.add("_tab-active");
                    tabsContentItem.hidden = !tabsTitles[index].classList.contains("_tab-active");
                }));
            }
        }
        function setTabsStatus(tabsBlock) {
            let tabsTitles = tabsBlock.querySelectorAll("[data-tabs-title]");
            let tabsContent = tabsBlock.querySelectorAll("[data-tabs-item]");
            const tabsBlockIndex = tabsBlock.dataset.tabsIndex;
            function isTabsAnamate(tabsBlock) {
                if (tabsBlock.hasAttribute("data-tabs-animate")) return tabsBlock.dataset.tabsAnimate > 0 ? Number(tabsBlock.dataset.tabsAnimate) : 500;
            }
            const tabsBlockAnimate = isTabsAnamate(tabsBlock);
            if (tabsContent.length > 0) {
                const isHash = tabsBlock.hasAttribute("data-tabs-hash");
                tabsContent = Array.from(tabsContent).filter((item => item.closest("[data-tabs]") === tabsBlock));
                tabsTitles = Array.from(tabsTitles).filter((item => item.closest("[data-tabs]") === tabsBlock));
                tabsContent.forEach(((tabsContentItem, index) => {
                    if (tabsTitles[index].classList.contains("_tab-active")) {
                        if (tabsBlockAnimate) _slideDown(tabsContentItem, tabsBlockAnimate); else tabsContentItem.hidden = false;
                        if (isHash && !tabsContentItem.closest(".popup")) setHash(`tab-${tabsBlockIndex}-${index}`);
                    } else if (tabsBlockAnimate) _slideUp(tabsContentItem, tabsBlockAnimate); else tabsContentItem.hidden = true;
                }));
            }
        }
        function setTabsAction(e) {
            const el = e.target;
            if (el.closest("[data-tabs-title]")) {
                const tabTitle = el.closest("[data-tabs-title]");
                const tabsBlock = tabTitle.closest("[data-tabs]");
                if (!tabTitle.classList.contains("_tab-active") && !tabsBlock.querySelector("._slide")) {
                    let tabActiveTitle = tabsBlock.querySelectorAll("[data-tabs-title]._tab-active");
                    tabActiveTitle.length ? tabActiveTitle = Array.from(tabActiveTitle).filter((item => item.closest("[data-tabs]") === tabsBlock)) : null;
                    tabActiveTitle.length ? tabActiveTitle[0].classList.remove("_tab-active") : null;
                    tabTitle.classList.add("_tab-active");
                    setTabsStatus(tabsBlock);
                }
                e.preventDefault();
            }
        }
    }
    function menuInit() {
        if (document.querySelector(".icon-menu")) document.addEventListener("click", (function(e) {
            if (bodyLockStatus && e.target.closest(".icon-menu")) {
                if (document.documentElement.classList.contains("lock") && document.documentElement.classList.contains("catalog-open")) {
                    document.documentElement.classList.remove("catalog-open");
                    document.documentElement.classList.remove("lock");
                }
                bodyLockToggle();
                document.documentElement.classList.toggle("menu-open");
            }
        }));
    }
    function menuClose() {
        bodyUnlock();
        document.documentElement.classList.remove("menu-open");
    }
    function catalogInit() {
        if (document.querySelector(".ctg-btn-js")) document.addEventListener("click", (function(e) {
            if (bodyLockStatus && e.target.closest(".ctg-btn-js")) {
                if (document.documentElement.classList.contains("lock") && document.documentElement.classList.contains("menu-open")) {
                    document.documentElement.classList.remove("menu-open");
                    document.documentElement.classList.remove("lock");
                }
                bodyLockToggle();
                document.documentElement.classList.toggle("catalog-open");
            }
        }));
    }
    function functions_FLS(message) {
        setTimeout((() => {
            if (window.FLS) console.log(message);
        }), 0);
    }
    function uniqArray(array) {
        return array.filter((function(item, index, self) {
            return self.indexOf(item) === index;
        }));
    }
    function dataMediaQueries(array, dataSetValue) {
        const media = Array.from(array).filter((function(item, index, self) {
            if (item.dataset[dataSetValue]) return item.dataset[dataSetValue].split(",")[0];
        }));
        if (media.length) {
            const breakpointsArray = [];
            media.forEach((item => {
                const params = item.dataset[dataSetValue];
                const breakpoint = {};
                const paramsArray = params.split(",");
                breakpoint.value = paramsArray[0];
                breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
                breakpoint.item = item;
                breakpointsArray.push(breakpoint);
            }));
            let mdQueries = breakpointsArray.map((function(item) {
                return "(" + item.type + "-width: " + item.value + "px)," + item.value + "," + item.type;
            }));
            mdQueries = uniqArray(mdQueries);
            const mdQueriesArray = [];
            if (mdQueries.length) {
                mdQueries.forEach((breakpoint => {
                    const paramsArray = breakpoint.split(",");
                    const mediaBreakpoint = paramsArray[1];
                    const mediaType = paramsArray[2];
                    const matchMedia = window.matchMedia(paramsArray[0]);
                    const itemsArray = breakpointsArray.filter((function(item) {
                        if (item.value === mediaBreakpoint && item.type === mediaType) return true;
                    }));
                    mdQueriesArray.push({
                        itemsArray,
                        matchMedia
                    });
                }));
                return mdQueriesArray;
            }
        }
    }
    class Popup {
        constructor(options) {
            let config = {
                logging: true,
                init: true,
                attributeOpenButton: "data-popup",
                attributeCloseButton: "data-close",
                fixElementSelector: "[data-lp]",
                youtubeAttribute: "data-popup-youtube",
                youtubePlaceAttribute: "data-popup-youtube-place",
                setAutoplayYoutube: true,
                classes: {
                    popup: "popup",
                    popupContent: "popup__content",
                    popupActive: "popup_show",
                    bodyActive: "popup-show"
                },
                focusCatch: true,
                closeEsc: true,
                bodyLock: true,
                hashSettings: {
                    location: true,
                    goHash: true
                },
                on: {
                    beforeOpen: function() {},
                    afterOpen: function() {},
                    beforeClose: function() {},
                    afterClose: function() {}
                }
            };
            this.youTubeCode;
            this.isOpen = false;
            this.targetOpen = {
                selector: false,
                element: false
            };
            this.previousOpen = {
                selector: false,
                element: false
            };
            this.lastClosed = {
                selector: false,
                element: false
            };
            this._dataValue = false;
            this.hash = false;
            this._reopen = false;
            this._selectorOpen = false;
            this.lastFocusEl = false;
            this._focusEl = [ "a[href]", 'input:not([disabled]):not([type="hidden"]):not([aria-hidden])', "button:not([disabled]):not([aria-hidden])", "select:not([disabled]):not([aria-hidden])", "textarea:not([disabled]):not([aria-hidden])", "area[href]", "iframe", "object", "embed", "[contenteditable]", '[tabindex]:not([tabindex^="-"])' ];
            this.options = {
                ...config,
                ...options,
                classes: {
                    ...config.classes,
                    ...options?.classes
                },
                hashSettings: {
                    ...config.hashSettings,
                    ...options?.hashSettings
                },
                on: {
                    ...config.on,
                    ...options?.on
                }
            };
            this.bodyLock = false;
            this.options.init ? this.initPopups() : null;
        }
        initPopups() {
            this.popupLogging(`Проснулся`);
            this.eventsPopup();
        }
        eventsPopup() {
            document.addEventListener("click", function(e) {
                const buttonOpen = e.target.closest(`[${this.options.attributeOpenButton}]`);
                if (buttonOpen) {
                    e.preventDefault();
                    this._dataValue = buttonOpen.getAttribute(this.options.attributeOpenButton) ? buttonOpen.getAttribute(this.options.attributeOpenButton) : "error";
                    this.youTubeCode = buttonOpen.getAttribute(this.options.youtubeAttribute) ? buttonOpen.getAttribute(this.options.youtubeAttribute) : null;
                    if ("error" !== this._dataValue) {
                        if (!this.isOpen) this.lastFocusEl = buttonOpen;
                        this.targetOpen.selector = `${this._dataValue}`;
                        this._selectorOpen = true;
                        this.open();
                        return;
                    } else this.popupLogging(`Ой ой, не заполнен атрибут у ${buttonOpen.classList}`);
                    return;
                }
                const buttonClose = e.target.closest(`[${this.options.attributeCloseButton}]`);
                if (buttonClose || !e.target.closest(`.${this.options.classes.popupContent}`) && this.isOpen) {
                    e.preventDefault();
                    this.close();
                    return;
                }
            }.bind(this));
            document.addEventListener("keydown", function(e) {
                if (this.options.closeEsc && 27 == e.which && "Escape" === e.code && this.isOpen) {
                    e.preventDefault();
                    this.close();
                    return;
                }
                if (this.options.focusCatch && 9 == e.which && this.isOpen) {
                    this._focusCatch(e);
                    return;
                }
            }.bind(this));
            if (this.options.hashSettings.goHash) {
                window.addEventListener("hashchange", function() {
                    if (window.location.hash) this._openToHash(); else this.close(this.targetOpen.selector);
                }.bind(this));
                window.addEventListener("load", function() {
                    if (window.location.hash) this._openToHash();
                }.bind(this));
            }
        }
        open(selectorValue) {
            if (bodyLockStatus) {
                this.bodyLock = document.documentElement.classList.contains("lock") && !this.isOpen ? true : false;
                if (selectorValue && "string" === typeof selectorValue && "" !== selectorValue.trim()) {
                    this.targetOpen.selector = selectorValue;
                    this._selectorOpen = true;
                }
                if (this.isOpen) {
                    this._reopen = true;
                    this.close();
                }
                if (!this._selectorOpen) this.targetOpen.selector = this.lastClosed.selector;
                if (!this._reopen) this.previousActiveElement = document.activeElement;
                this.targetOpen.element = document.querySelector(this.targetOpen.selector);
                if (this.targetOpen.element) {
                    if (this.youTubeCode) {
                        const codeVideo = this.youTubeCode;
                        const urlVideo = `https://www.youtube.com/embed/${codeVideo}?rel=0&showinfo=0&autoplay=1`;
                        const iframe = document.createElement("iframe");
                        iframe.setAttribute("allowfullscreen", "");
                        const autoplay = this.options.setAutoplayYoutube ? "autoplay;" : "";
                        iframe.setAttribute("allow", `${autoplay}; encrypted-media`);
                        iframe.setAttribute("src", urlVideo);
                        if (!this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`)) {
                            this.targetOpen.element.querySelector(".popup__text").setAttribute(`${this.options.youtubePlaceAttribute}`, "");
                        }
                        this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`).appendChild(iframe);
                    }
                    if (this.options.hashSettings.location) {
                        this._getHash();
                        this._setHash();
                    }
                    this.options.on.beforeOpen(this);
                    document.dispatchEvent(new CustomEvent("beforePopupOpen", {
                        detail: {
                            popup: this
                        }
                    }));
                    this.targetOpen.element.classList.add(this.options.classes.popupActive);
                    document.documentElement.classList.add(this.options.classes.bodyActive);
                    if (!this._reopen) !this.bodyLock ? bodyLock() : null; else this._reopen = false;
                    this.targetOpen.element.setAttribute("aria-hidden", "false");
                    this.previousOpen.selector = this.targetOpen.selector;
                    this.previousOpen.element = this.targetOpen.element;
                    this._selectorOpen = false;
                    this.isOpen = true;
                    setTimeout((() => {
                        this._focusTrap();
                    }), 50);
                    this.options.on.afterOpen(this);
                    document.dispatchEvent(new CustomEvent("afterPopupOpen", {
                        detail: {
                            popup: this
                        }
                    }));
                    this.popupLogging(`Открыл попап`);
                } else this.popupLogging(`Ой ой, такого попапа нет.Проверьте корректность ввода. `);
            }
        }
        close(selectorValue) {
            if (selectorValue && "string" === typeof selectorValue && "" !== selectorValue.trim()) this.previousOpen.selector = selectorValue;
            if (!this.isOpen || !bodyLockStatus) return;
            this.options.on.beforeClose(this);
            document.dispatchEvent(new CustomEvent("beforePopupClose", {
                detail: {
                    popup: this
                }
            }));
            if (this.youTubeCode) if (this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`)) this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`).innerHTML = "";
            this.previousOpen.element.classList.remove(this.options.classes.popupActive);
            this.previousOpen.element.setAttribute("aria-hidden", "true");
            if (!this._reopen) {
                document.documentElement.classList.remove(this.options.classes.bodyActive);
                !this.bodyLock ? bodyUnlock() : null;
                this.isOpen = false;
            }
            this._removeHash();
            if (this._selectorOpen) {
                this.lastClosed.selector = this.previousOpen.selector;
                this.lastClosed.element = this.previousOpen.element;
            }
            this.options.on.afterClose(this);
            document.dispatchEvent(new CustomEvent("afterPopupClose", {
                detail: {
                    popup: this
                }
            }));
            setTimeout((() => {
                this._focusTrap();
            }), 50);
            this.popupLogging(`Закрыл попап`);
        }
        _getHash() {
            if (this.options.hashSettings.location) this.hash = this.targetOpen.selector.includes("#") ? this.targetOpen.selector : this.targetOpen.selector.replace(".", "#");
        }
        _openToHash() {
            let classInHash = document.querySelector(`.${window.location.hash.replace("#", "")}`) ? `.${window.location.hash.replace("#", "")}` : document.querySelector(`${window.location.hash}`) ? `${window.location.hash}` : null;
            const buttons = document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash}"]`) ? document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash}"]`) : document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash.replace(".", "#")}"]`);
            if (buttons && classInHash) this.open(classInHash);
        }
        _setHash() {
            history.pushState("", "", this.hash);
        }
        _removeHash() {
            history.pushState("", "", window.location.href.split("#")[0]);
        }
        _focusCatch(e) {
            const focusable = this.targetOpen.element.querySelectorAll(this._focusEl);
            const focusArray = Array.prototype.slice.call(focusable);
            const focusedIndex = focusArray.indexOf(document.activeElement);
            if (e.shiftKey && 0 === focusedIndex) {
                focusArray[focusArray.length - 1].focus();
                e.preventDefault();
            }
            if (!e.shiftKey && focusedIndex === focusArray.length - 1) {
                focusArray[0].focus();
                e.preventDefault();
            }
        }
        _focusTrap() {
            const focusable = this.previousOpen.element.querySelectorAll(this._focusEl);
            if (!this.isOpen && this.lastFocusEl) this.lastFocusEl.focus(); else focusable[0].focus();
        }
        popupLogging(message) {
            this.options.logging ? functions_FLS(`[Попапос]: ${message}`) : null;
        }
    }
    modules_flsModules.popup = new Popup({});
    let gotoblock_gotoBlock = (targetBlock, noHeader = false, speed = 500, offsetTop = 0) => {
        const targetBlockElement = document.querySelector(targetBlock);
        if (targetBlockElement) {
            let headerItem = "";
            let headerItemHeight = 0;
            if (noHeader) {
                headerItem = "header.header";
                const headerElement = document.querySelector(headerItem);
                if (!headerElement.classList.contains("_header-scroll")) {
                    headerElement.style.cssText = `transition-duration: 0s;`;
                    headerElement.classList.add("_header-scroll");
                    headerItemHeight = headerElement.offsetHeight;
                    headerElement.classList.remove("_header-scroll");
                    setTimeout((() => {
                        headerElement.style.cssText = ``;
                    }), 0);
                } else headerItemHeight = headerElement.offsetHeight;
            }
            let options = {
                speedAsDuration: true,
                speed,
                header: headerItem,
                offset: offsetTop,
                easing: "easeOutQuad"
            };
            document.documentElement.classList.contains("menu-open") ? menuClose() : null;
            if ("undefined" !== typeof SmoothScroll) (new SmoothScroll).animateScroll(targetBlockElement, "", options); else {
                let targetBlockElementPosition = targetBlockElement.getBoundingClientRect().top + scrollY;
                targetBlockElementPosition = headerItemHeight ? targetBlockElementPosition - headerItemHeight : targetBlockElementPosition;
                targetBlockElementPosition = offsetTop ? targetBlockElementPosition - offsetTop : targetBlockElementPosition;
                window.scrollTo({
                    top: targetBlockElementPosition,
                    behavior: "smooth"
                });
            }
            functions_FLS(`[gotoBlock]: Юхуу...едем к ${targetBlock}`);
        } else functions_FLS(`[gotoBlock]: Ой ой..Такого блока нет на странице: ${targetBlock}`);
    };
    function formFieldsInit(options = {
        viewPass: false,
        autoHeight: false
    }) {
        const formFields = document.querySelectorAll("input[placeholder],textarea[placeholder]");
        if (formFields.length) formFields.forEach((formField => {
            if (!formField.hasAttribute("data-placeholder-nohide")) formField.dataset.placeholder = formField.placeholder;
        }));
        document.body.addEventListener("focusin", (function(e) {
            const targetElement = e.target;
            if ("INPUT" === targetElement.tagName || "TEXTAREA" === targetElement.tagName) {
                if (targetElement.dataset.placeholder) targetElement.placeholder = "";
                if (!targetElement.hasAttribute("data-no-focus-classes")) {
                    targetElement.classList.add("_form-focus");
                    targetElement.parentElement.classList.add("_form-focus");
                }
                formValidate.removeError(targetElement);
            }
        }));
        document.body.addEventListener("focusout", (function(e) {
            const targetElement = e.target;
            if ("INPUT" === targetElement.tagName || "TEXTAREA" === targetElement.tagName) {
                if (targetElement.dataset.placeholder) targetElement.placeholder = targetElement.dataset.placeholder;
                if (!targetElement.hasAttribute("data-no-focus-classes")) {
                    targetElement.classList.remove("_form-focus");
                    targetElement.parentElement.classList.remove("_form-focus");
                }
                if (targetElement.hasAttribute("data-validate")) formValidate.validateInput(targetElement);
            }
        }));
        if (options.viewPass) document.addEventListener("click", (function(e) {
            let targetElement = e.target;
            if (targetElement.closest('[class*="__viewpass"]')) {
                let inputType = targetElement.classList.contains("_viewpass-active") ? "password" : "text";
                targetElement.parentElement.querySelector("input").setAttribute("type", inputType);
                targetElement.classList.toggle("_viewpass-active");
            }
        }));
        if (options.autoHeight) {
            const textareas = document.querySelectorAll("textarea[data-autoheight]");
            if (textareas.length) {
                textareas.forEach((textarea => {
                    const startHeight = textarea.hasAttribute("data-autoheight-min") ? Number(textarea.dataset.autoheightMin) : Number(textarea.offsetHeight);
                    const maxHeight = textarea.hasAttribute("data-autoheight-max") ? Number(textarea.dataset.autoheightMax) : 1 / 0;
                    setHeight(textarea, Math.min(startHeight, maxHeight));
                    textarea.addEventListener("input", (() => {
                        if (textarea.scrollHeight > startHeight) {
                            textarea.style.height = `auto`;
                            setHeight(textarea, Math.min(Math.max(textarea.scrollHeight, startHeight), maxHeight));
                        }
                    }));
                }));
                function setHeight(textarea, height) {
                    textarea.style.height = `${height}px`;
                }
            }
        }
    }
    let formValidate = {
        getErrors(form) {
            let error = 0;
            let formRequiredItems = form.querySelectorAll("*[data-required]");
            if (formRequiredItems.length) formRequiredItems.forEach((formRequiredItem => {
                if ((null !== formRequiredItem.offsetParent || "SELECT" === formRequiredItem.tagName) && !formRequiredItem.disabled) error += this.validateInput(formRequiredItem);
            }));
            return error;
        },
        validateInput(formRequiredItem) {
            let error = 0;
            if ("email" === formRequiredItem.dataset.required) {
                formRequiredItem.value = formRequiredItem.value.replace(" ", "");
                if (this.emailTest(formRequiredItem)) {
                    this.addError(formRequiredItem);
                    error++;
                } else this.removeError(formRequiredItem);
            } else if ("checkbox" === formRequiredItem.type && !formRequiredItem.checked) {
                this.addError(formRequiredItem);
                error++;
            } else if (!formRequiredItem.value.trim()) {
                this.addError(formRequiredItem);
                error++;
            } else this.removeError(formRequiredItem);
            return error;
        },
        addError(formRequiredItem) {
            formRequiredItem.classList.add("_form-error");
            formRequiredItem.parentElement.classList.add("_form-error");
            let inputError = formRequiredItem.parentElement.querySelector(".form__error");
            if (inputError) formRequiredItem.parentElement.removeChild(inputError);
            if (formRequiredItem.dataset.error) formRequiredItem.parentElement.insertAdjacentHTML("beforeend", `<div class="form__error">${formRequiredItem.dataset.error}</div>`);
        },
        removeError(formRequiredItem) {
            formRequiredItem.classList.remove("_form-error");
            formRequiredItem.parentElement.classList.remove("_form-error");
            if (formRequiredItem.parentElement.querySelector(".form__error")) formRequiredItem.parentElement.removeChild(formRequiredItem.parentElement.querySelector(".form__error"));
        },
        formClean(form) {
            form.reset();
            setTimeout((() => {
                let inputs = form.querySelectorAll("input,textarea");
                for (let index = 0; index < inputs.length; index++) {
                    const el = inputs[index];
                    el.parentElement.classList.remove("_form-focus");
                    el.classList.remove("_form-focus");
                    formValidate.removeError(el);
                }
                let checkboxes = form.querySelectorAll(".checkbox__input");
                if (checkboxes.length > 0) for (let index = 0; index < checkboxes.length; index++) {
                    const checkbox = checkboxes[index];
                    checkbox.checked = false;
                }
                if (modules_flsModules.select) {
                    let selects = form.querySelectorAll(".select");
                    if (selects.length) for (let index = 0; index < selects.length; index++) {
                        const select = selects[index].querySelector("select");
                        modules_flsModules.select.selectBuild(select);
                    }
                }
            }), 0);
        },
        emailTest(formRequiredItem) {
            return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(formRequiredItem.value);
        }
    };
    function getWindow_getWindow(node) {
        if (null == node) return window;
        if ("[object Window]" !== node.toString()) {
            var ownerDocument = node.ownerDocument;
            return ownerDocument ? ownerDocument.defaultView || window : window;
        }
        return node;
    }
    function isElement(node) {
        var OwnElement = getWindow_getWindow(node).Element;
        return node instanceof OwnElement || node instanceof Element;
    }
    function isHTMLElement(node) {
        var OwnElement = getWindow_getWindow(node).HTMLElement;
        return node instanceof OwnElement || node instanceof HTMLElement;
    }
    function isShadowRoot(node) {
        if ("undefined" === typeof ShadowRoot) return false;
        var OwnElement = getWindow_getWindow(node).ShadowRoot;
        return node instanceof OwnElement || node instanceof ShadowRoot;
    }
    var math_max = Math.max;
    var math_min = Math.min;
    var round = Math.round;
    function getBoundingClientRect(element, includeScale) {
        if (void 0 === includeScale) includeScale = false;
        var rect = element.getBoundingClientRect();
        var scaleX = 1;
        var scaleY = 1;
        if (isHTMLElement(element) && includeScale) {
            var offsetHeight = element.offsetHeight;
            var offsetWidth = element.offsetWidth;
            if (offsetWidth > 0) scaleX = round(rect.width) / offsetWidth || 1;
            if (offsetHeight > 0) scaleY = round(rect.height) / offsetHeight || 1;
        }
        return {
            width: rect.width / scaleX,
            height: rect.height / scaleY,
            top: rect.top / scaleY,
            right: rect.right / scaleX,
            bottom: rect.bottom / scaleY,
            left: rect.left / scaleX,
            x: rect.left / scaleX,
            y: rect.top / scaleY
        };
    }
    function getWindowScroll(node) {
        var win = getWindow_getWindow(node);
        var scrollLeft = win.pageXOffset;
        var scrollTop = win.pageYOffset;
        return {
            scrollLeft,
            scrollTop
        };
    }
    function getHTMLElementScroll(element) {
        return {
            scrollLeft: element.scrollLeft,
            scrollTop: element.scrollTop
        };
    }
    function getNodeScroll(node) {
        if (node === getWindow_getWindow(node) || !isHTMLElement(node)) return getWindowScroll(node); else return getHTMLElementScroll(node);
    }
    function getNodeName(element) {
        return element ? (element.nodeName || "").toLowerCase() : null;
    }
    function getDocumentElement(element) {
        return ((isElement(element) ? element.ownerDocument : element.document) || window.document).documentElement;
    }
    function getWindowScrollBarX(element) {
        return getBoundingClientRect(getDocumentElement(element)).left + getWindowScroll(element).scrollLeft;
    }
    function getComputedStyle_getComputedStyle(element) {
        return getWindow_getWindow(element).getComputedStyle(element);
    }
    function isScrollParent(element) {
        var _getComputedStyle = getComputedStyle_getComputedStyle(element), overflow = _getComputedStyle.overflow, overflowX = _getComputedStyle.overflowX, overflowY = _getComputedStyle.overflowY;
        return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX);
    }
    function isElementScaled(element) {
        var rect = element.getBoundingClientRect();
        var scaleX = round(rect.width) / element.offsetWidth || 1;
        var scaleY = round(rect.height) / element.offsetHeight || 1;
        return 1 !== scaleX || 1 !== scaleY;
    }
    function getCompositeRect(elementOrVirtualElement, offsetParent, isFixed) {
        if (void 0 === isFixed) isFixed = false;
        var isOffsetParentAnElement = isHTMLElement(offsetParent);
        var offsetParentIsScaled = isHTMLElement(offsetParent) && isElementScaled(offsetParent);
        var documentElement = getDocumentElement(offsetParent);
        var rect = getBoundingClientRect(elementOrVirtualElement, offsetParentIsScaled);
        var scroll = {
            scrollLeft: 0,
            scrollTop: 0
        };
        var offsets = {
            x: 0,
            y: 0
        };
        if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
            if ("body" !== getNodeName(offsetParent) || isScrollParent(documentElement)) scroll = getNodeScroll(offsetParent);
            if (isHTMLElement(offsetParent)) {
                offsets = getBoundingClientRect(offsetParent, true);
                offsets.x += offsetParent.clientLeft;
                offsets.y += offsetParent.clientTop;
            } else if (documentElement) offsets.x = getWindowScrollBarX(documentElement);
        }
        return {
            x: rect.left + scroll.scrollLeft - offsets.x,
            y: rect.top + scroll.scrollTop - offsets.y,
            width: rect.width,
            height: rect.height
        };
    }
    function getLayoutRect(element) {
        var clientRect = getBoundingClientRect(element);
        var width = element.offsetWidth;
        var height = element.offsetHeight;
        if (Math.abs(clientRect.width - width) <= 1) width = clientRect.width;
        if (Math.abs(clientRect.height - height) <= 1) height = clientRect.height;
        return {
            x: element.offsetLeft,
            y: element.offsetTop,
            width,
            height
        };
    }
    function getParentNode(element) {
        if ("html" === getNodeName(element)) return element;
        return element.assignedSlot || element.parentNode || (isShadowRoot(element) ? element.host : null) || getDocumentElement(element);
    }
    function getScrollParent(node) {
        if ([ "html", "body", "#document" ].indexOf(getNodeName(node)) >= 0) return node.ownerDocument.body;
        if (isHTMLElement(node) && isScrollParent(node)) return node;
        return getScrollParent(getParentNode(node));
    }
    function listScrollParents(element, list) {
        var _element$ownerDocumen;
        if (void 0 === list) list = [];
        var scrollParent = getScrollParent(element);
        var isBody = scrollParent === (null == (_element$ownerDocumen = element.ownerDocument) ? void 0 : _element$ownerDocumen.body);
        var win = getWindow_getWindow(scrollParent);
        var target = isBody ? [ win ].concat(win.visualViewport || [], isScrollParent(scrollParent) ? scrollParent : []) : scrollParent;
        var updatedList = list.concat(target);
        return isBody ? updatedList : updatedList.concat(listScrollParents(getParentNode(target)));
    }
    function isTableElement(element) {
        return [ "table", "td", "th" ].indexOf(getNodeName(element)) >= 0;
    }
    function getTrueOffsetParent(element) {
        if (!isHTMLElement(element) || "fixed" === getComputedStyle_getComputedStyle(element).position) return null;
        return element.offsetParent;
    }
    function getContainingBlock(element) {
        var isFirefox = -1 !== navigator.userAgent.toLowerCase().indexOf("firefox");
        var isIE = -1 !== navigator.userAgent.indexOf("Trident");
        if (isIE && isHTMLElement(element)) {
            var elementCss = getComputedStyle_getComputedStyle(element);
            if ("fixed" === elementCss.position) return null;
        }
        var currentNode = getParentNode(element);
        if (isShadowRoot(currentNode)) currentNode = currentNode.host;
        while (isHTMLElement(currentNode) && [ "html", "body" ].indexOf(getNodeName(currentNode)) < 0) {
            var css = getComputedStyle_getComputedStyle(currentNode);
            if ("none" !== css.transform || "none" !== css.perspective || "paint" === css.contain || -1 !== [ "transform", "perspective" ].indexOf(css.willChange) || isFirefox && "filter" === css.willChange || isFirefox && css.filter && "none" !== css.filter) return currentNode; else currentNode = currentNode.parentNode;
        }
        return null;
    }
    function getOffsetParent(element) {
        var window = getWindow_getWindow(element);
        var offsetParent = getTrueOffsetParent(element);
        while (offsetParent && isTableElement(offsetParent) && "static" === getComputedStyle_getComputedStyle(offsetParent).position) offsetParent = getTrueOffsetParent(offsetParent);
        if (offsetParent && ("html" === getNodeName(offsetParent) || "body" === getNodeName(offsetParent) && "static" === getComputedStyle_getComputedStyle(offsetParent).position)) return window;
        return offsetParent || getContainingBlock(element) || window;
    }
    var enums_top = "top";
    var bottom = "bottom";
    var right = "right";
    var left = "left";
    var auto = "auto";
    var basePlacements = [ enums_top, bottom, right, left ];
    var start = "start";
    var end = "end";
    var clippingParents = "clippingParents";
    var viewport = "viewport";
    var popper = "popper";
    var reference = "reference";
    var variationPlacements = basePlacements.reduce((function(acc, placement) {
        return acc.concat([ placement + "-" + start, placement + "-" + end ]);
    }), []);
    var enums_placements = [].concat(basePlacements, [ auto ]).reduce((function(acc, placement) {
        return acc.concat([ placement, placement + "-" + start, placement + "-" + end ]);
    }), []);
    var beforeRead = "beforeRead";
    var read = "read";
    var afterRead = "afterRead";
    var beforeMain = "beforeMain";
    var main = "main";
    var afterMain = "afterMain";
    var beforeWrite = "beforeWrite";
    var write = "write";
    var afterWrite = "afterWrite";
    var modifierPhases = [ beforeRead, read, afterRead, beforeMain, main, afterMain, beforeWrite, write, afterWrite ];
    function order(modifiers) {
        var map = new Map;
        var visited = new Set;
        var result = [];
        modifiers.forEach((function(modifier) {
            map.set(modifier.name, modifier);
        }));
        function sort(modifier) {
            visited.add(modifier.name);
            var requires = [].concat(modifier.requires || [], modifier.requiresIfExists || []);
            requires.forEach((function(dep) {
                if (!visited.has(dep)) {
                    var depModifier = map.get(dep);
                    if (depModifier) sort(depModifier);
                }
            }));
            result.push(modifier);
        }
        modifiers.forEach((function(modifier) {
            if (!visited.has(modifier.name)) sort(modifier);
        }));
        return result;
    }
    function orderModifiers(modifiers) {
        var orderedModifiers = order(modifiers);
        return modifierPhases.reduce((function(acc, phase) {
            return acc.concat(orderedModifiers.filter((function(modifier) {
                return modifier.phase === phase;
            })));
        }), []);
    }
    function debounce(fn) {
        var pending;
        return function() {
            if (!pending) pending = new Promise((function(resolve) {
                Promise.resolve().then((function() {
                    pending = void 0;
                    resolve(fn());
                }));
            }));
            return pending;
        };
    }
    function mergeByName(modifiers) {
        var merged = modifiers.reduce((function(merged, current) {
            var existing = merged[current.name];
            merged[current.name] = existing ? Object.assign({}, existing, current, {
                options: Object.assign({}, existing.options, current.options),
                data: Object.assign({}, existing.data, current.data)
            }) : current;
            return merged;
        }), {});
        return Object.keys(merged).map((function(key) {
            return merged[key];
        }));
    }
    var DEFAULT_OPTIONS = {
        placement: "bottom",
        modifiers: [],
        strategy: "absolute"
    };
    function areValidElements() {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
        return !args.some((function(element) {
            return !(element && "function" === typeof element.getBoundingClientRect);
        }));
    }
    function popperGenerator(generatorOptions) {
        if (void 0 === generatorOptions) generatorOptions = {};
        var _generatorOptions = generatorOptions, _generatorOptions$def = _generatorOptions.defaultModifiers, defaultModifiers = void 0 === _generatorOptions$def ? [] : _generatorOptions$def, _generatorOptions$def2 = _generatorOptions.defaultOptions, defaultOptions = void 0 === _generatorOptions$def2 ? DEFAULT_OPTIONS : _generatorOptions$def2;
        return function createPopper(reference, popper, options) {
            if (void 0 === options) options = defaultOptions;
            var state = {
                placement: "bottom",
                orderedModifiers: [],
                options: Object.assign({}, DEFAULT_OPTIONS, defaultOptions),
                modifiersData: {},
                elements: {
                    reference,
                    popper
                },
                attributes: {},
                styles: {}
            };
            var effectCleanupFns = [];
            var isDestroyed = false;
            var instance = {
                state,
                setOptions: function setOptions(setOptionsAction) {
                    var options = "function" === typeof setOptionsAction ? setOptionsAction(state.options) : setOptionsAction;
                    cleanupModifierEffects();
                    state.options = Object.assign({}, defaultOptions, state.options, options);
                    state.scrollParents = {
                        reference: isElement(reference) ? listScrollParents(reference) : reference.contextElement ? listScrollParents(reference.contextElement) : [],
                        popper: listScrollParents(popper)
                    };
                    var orderedModifiers = orderModifiers(mergeByName([].concat(defaultModifiers, state.options.modifiers)));
                    state.orderedModifiers = orderedModifiers.filter((function(m) {
                        return m.enabled;
                    }));
                    if (false) ;
                    runModifierEffects();
                    return instance.update();
                },
                forceUpdate: function forceUpdate() {
                    if (isDestroyed) return;
                    var _state$elements = state.elements, reference = _state$elements.reference, popper = _state$elements.popper;
                    if (!areValidElements(reference, popper)) {
                        if (false) ;
                        return;
                    }
                    state.rects = {
                        reference: getCompositeRect(reference, getOffsetParent(popper), "fixed" === state.options.strategy),
                        popper: getLayoutRect(popper)
                    };
                    state.reset = false;
                    state.placement = state.options.placement;
                    state.orderedModifiers.forEach((function(modifier) {
                        return state.modifiersData[modifier.name] = Object.assign({}, modifier.data);
                    }));
                    for (var index = 0; index < state.orderedModifiers.length; index++) {
                        if (false) ;
                        if (true === state.reset) {
                            state.reset = false;
                            index = -1;
                            continue;
                        }
                        var _state$orderedModifie = state.orderedModifiers[index], fn = _state$orderedModifie.fn, _state$orderedModifie2 = _state$orderedModifie.options, _options = void 0 === _state$orderedModifie2 ? {} : _state$orderedModifie2, name = _state$orderedModifie.name;
                        if ("function" === typeof fn) state = fn({
                            state,
                            options: _options,
                            name,
                            instance
                        }) || state;
                    }
                },
                update: debounce((function() {
                    return new Promise((function(resolve) {
                        instance.forceUpdate();
                        resolve(state);
                    }));
                })),
                destroy: function destroy() {
                    cleanupModifierEffects();
                    isDestroyed = true;
                }
            };
            if (!areValidElements(reference, popper)) {
                if (false) ;
                return instance;
            }
            instance.setOptions(options).then((function(state) {
                if (!isDestroyed && options.onFirstUpdate) options.onFirstUpdate(state);
            }));
            function runModifierEffects() {
                state.orderedModifiers.forEach((function(_ref3) {
                    var name = _ref3.name, _ref3$options = _ref3.options, options = void 0 === _ref3$options ? {} : _ref3$options, effect = _ref3.effect;
                    if ("function" === typeof effect) {
                        var cleanupFn = effect({
                            state,
                            name,
                            instance,
                            options
                        });
                        var noopFn = function noopFn() {};
                        effectCleanupFns.push(cleanupFn || noopFn);
                    }
                }));
            }
            function cleanupModifierEffects() {
                effectCleanupFns.forEach((function(fn) {
                    return fn();
                }));
                effectCleanupFns = [];
            }
            return instance;
        };
    }
    null && popperGenerator();
    var passive = {
        passive: true
    };
    function effect(_ref) {
        var state = _ref.state, instance = _ref.instance, options = _ref.options;
        var _options$scroll = options.scroll, scroll = void 0 === _options$scroll ? true : _options$scroll, _options$resize = options.resize, resize = void 0 === _options$resize ? true : _options$resize;
        var window = getWindow_getWindow(state.elements.popper);
        var scrollParents = [].concat(state.scrollParents.reference, state.scrollParents.popper);
        if (scroll) scrollParents.forEach((function(scrollParent) {
            scrollParent.addEventListener("scroll", instance.update, passive);
        }));
        if (resize) window.addEventListener("resize", instance.update, passive);
        return function() {
            if (scroll) scrollParents.forEach((function(scrollParent) {
                scrollParent.removeEventListener("scroll", instance.update, passive);
            }));
            if (resize) window.removeEventListener("resize", instance.update, passive);
        };
    }
    const eventListeners = {
        name: "eventListeners",
        enabled: true,
        phase: "write",
        fn: function fn() {},
        effect,
        data: {}
    };
    function getBasePlacement(placement) {
        return placement.split("-")[0];
    }
    function getVariation(placement) {
        return placement.split("-")[1];
    }
    function getMainAxisFromPlacement(placement) {
        return [ "top", "bottom" ].indexOf(placement) >= 0 ? "x" : "y";
    }
    function computeOffsets(_ref) {
        var reference = _ref.reference, element = _ref.element, placement = _ref.placement;
        var basePlacement = placement ? getBasePlacement(placement) : null;
        var variation = placement ? getVariation(placement) : null;
        var commonX = reference.x + reference.width / 2 - element.width / 2;
        var commonY = reference.y + reference.height / 2 - element.height / 2;
        var offsets;
        switch (basePlacement) {
          case enums_top:
            offsets = {
                x: commonX,
                y: reference.y - element.height
            };
            break;

          case bottom:
            offsets = {
                x: commonX,
                y: reference.y + reference.height
            };
            break;

          case right:
            offsets = {
                x: reference.x + reference.width,
                y: commonY
            };
            break;

          case left:
            offsets = {
                x: reference.x - element.width,
                y: commonY
            };
            break;

          default:
            offsets = {
                x: reference.x,
                y: reference.y
            };
        }
        var mainAxis = basePlacement ? getMainAxisFromPlacement(basePlacement) : null;
        if (null != mainAxis) {
            var len = "y" === mainAxis ? "height" : "width";
            switch (variation) {
              case start:
                offsets[mainAxis] = offsets[mainAxis] - (reference[len] / 2 - element[len] / 2);
                break;

              case end:
                offsets[mainAxis] = offsets[mainAxis] + (reference[len] / 2 - element[len] / 2);
                break;

              default:
            }
        }
        return offsets;
    }
    function popperOffsets(_ref) {
        var state = _ref.state, name = _ref.name;
        state.modifiersData[name] = computeOffsets({
            reference: state.rects.reference,
            element: state.rects.popper,
            strategy: "absolute",
            placement: state.placement
        });
    }
    const modifiers_popperOffsets = {
        name: "popperOffsets",
        enabled: true,
        phase: "read",
        fn: popperOffsets,
        data: {}
    };
    var unsetSides = {
        top: "auto",
        right: "auto",
        bottom: "auto",
        left: "auto"
    };
    function roundOffsetsByDPR(_ref) {
        var x = _ref.x, y = _ref.y;
        var win = window;
        var dpr = win.devicePixelRatio || 1;
        return {
            x: round(x * dpr) / dpr || 0,
            y: round(y * dpr) / dpr || 0
        };
    }
    function mapToStyles(_ref2) {
        var _Object$assign2;
        var popper = _ref2.popper, popperRect = _ref2.popperRect, placement = _ref2.placement, variation = _ref2.variation, offsets = _ref2.offsets, position = _ref2.position, gpuAcceleration = _ref2.gpuAcceleration, adaptive = _ref2.adaptive, roundOffsets = _ref2.roundOffsets, isFixed = _ref2.isFixed;
        var _offsets$x = offsets.x, x = void 0 === _offsets$x ? 0 : _offsets$x, _offsets$y = offsets.y, y = void 0 === _offsets$y ? 0 : _offsets$y;
        var _ref3 = "function" === typeof roundOffsets ? roundOffsets({
            x,
            y
        }) : {
            x,
            y
        };
        x = _ref3.x;
        y = _ref3.y;
        var hasX = offsets.hasOwnProperty("x");
        var hasY = offsets.hasOwnProperty("y");
        var sideX = left;
        var sideY = enums_top;
        var win = window;
        if (adaptive) {
            var offsetParent = getOffsetParent(popper);
            var heightProp = "clientHeight";
            var widthProp = "clientWidth";
            if (offsetParent === getWindow_getWindow(popper)) {
                offsetParent = getDocumentElement(popper);
                if ("static" !== getComputedStyle_getComputedStyle(offsetParent).position && "absolute" === position) {
                    heightProp = "scrollHeight";
                    widthProp = "scrollWidth";
                }
            }
            offsetParent;
            if (placement === enums_top || (placement === left || placement === right) && variation === end) {
                sideY = bottom;
                var offsetY = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.height : offsetParent[heightProp];
                y -= offsetY - popperRect.height;
                y *= gpuAcceleration ? 1 : -1;
            }
            if (placement === left || (placement === enums_top || placement === bottom) && variation === end) {
                sideX = right;
                var offsetX = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.width : offsetParent[widthProp];
                x -= offsetX - popperRect.width;
                x *= gpuAcceleration ? 1 : -1;
            }
        }
        var commonStyles = Object.assign({
            position
        }, adaptive && unsetSides);
        var _ref4 = true === roundOffsets ? roundOffsetsByDPR({
            x,
            y
        }) : {
            x,
            y
        };
        x = _ref4.x;
        y = _ref4.y;
        if (gpuAcceleration) {
            var _Object$assign;
            return Object.assign({}, commonStyles, (_Object$assign = {}, _Object$assign[sideY] = hasY ? "0" : "", 
            _Object$assign[sideX] = hasX ? "0" : "", _Object$assign.transform = (win.devicePixelRatio || 1) <= 1 ? "translate(" + x + "px, " + y + "px)" : "translate3d(" + x + "px, " + y + "px, 0)", 
            _Object$assign));
        }
        return Object.assign({}, commonStyles, (_Object$assign2 = {}, _Object$assign2[sideY] = hasY ? y + "px" : "", 
        _Object$assign2[sideX] = hasX ? x + "px" : "", _Object$assign2.transform = "", _Object$assign2));
    }
    function computeStyles(_ref5) {
        var state = _ref5.state, options = _ref5.options;
        var _options$gpuAccelerat = options.gpuAcceleration, gpuAcceleration = void 0 === _options$gpuAccelerat ? true : _options$gpuAccelerat, _options$adaptive = options.adaptive, adaptive = void 0 === _options$adaptive ? true : _options$adaptive, _options$roundOffsets = options.roundOffsets, roundOffsets = void 0 === _options$roundOffsets ? true : _options$roundOffsets;
        if (false) ;
        var commonStyles = {
            placement: getBasePlacement(state.placement),
            variation: getVariation(state.placement),
            popper: state.elements.popper,
            popperRect: state.rects.popper,
            gpuAcceleration,
            isFixed: "fixed" === state.options.strategy
        };
        if (null != state.modifiersData.popperOffsets) state.styles.popper = Object.assign({}, state.styles.popper, mapToStyles(Object.assign({}, commonStyles, {
            offsets: state.modifiersData.popperOffsets,
            position: state.options.strategy,
            adaptive,
            roundOffsets
        })));
        if (null != state.modifiersData.arrow) state.styles.arrow = Object.assign({}, state.styles.arrow, mapToStyles(Object.assign({}, commonStyles, {
            offsets: state.modifiersData.arrow,
            position: "absolute",
            adaptive: false,
            roundOffsets
        })));
        state.attributes.popper = Object.assign({}, state.attributes.popper, {
            "data-popper-placement": state.placement
        });
    }
    const modifiers_computeStyles = {
        name: "computeStyles",
        enabled: true,
        phase: "beforeWrite",
        fn: computeStyles,
        data: {}
    };
    function applyStyles(_ref) {
        var state = _ref.state;
        Object.keys(state.elements).forEach((function(name) {
            var style = state.styles[name] || {};
            var attributes = state.attributes[name] || {};
            var element = state.elements[name];
            if (!isHTMLElement(element) || !getNodeName(element)) return;
            Object.assign(element.style, style);
            Object.keys(attributes).forEach((function(name) {
                var value = attributes[name];
                if (false === value) element.removeAttribute(name); else element.setAttribute(name, true === value ? "" : value);
            }));
        }));
    }
    function applyStyles_effect(_ref2) {
        var state = _ref2.state;
        var initialStyles = {
            popper: {
                position: state.options.strategy,
                left: "0",
                top: "0",
                margin: "0"
            },
            arrow: {
                position: "absolute"
            },
            reference: {}
        };
        Object.assign(state.elements.popper.style, initialStyles.popper);
        state.styles = initialStyles;
        if (state.elements.arrow) Object.assign(state.elements.arrow.style, initialStyles.arrow);
        return function() {
            Object.keys(state.elements).forEach((function(name) {
                var element = state.elements[name];
                var attributes = state.attributes[name] || {};
                var styleProperties = Object.keys(state.styles.hasOwnProperty(name) ? state.styles[name] : initialStyles[name]);
                var style = styleProperties.reduce((function(style, property) {
                    style[property] = "";
                    return style;
                }), {});
                if (!isHTMLElement(element) || !getNodeName(element)) return;
                Object.assign(element.style, style);
                Object.keys(attributes).forEach((function(attribute) {
                    element.removeAttribute(attribute);
                }));
            }));
        };
    }
    const modifiers_applyStyles = {
        name: "applyStyles",
        enabled: true,
        phase: "write",
        fn: applyStyles,
        effect: applyStyles_effect,
        requires: [ "computeStyles" ]
    };
    function distanceAndSkiddingToXY(placement, rects, offset) {
        var basePlacement = getBasePlacement(placement);
        var invertDistance = [ left, enums_top ].indexOf(basePlacement) >= 0 ? -1 : 1;
        var _ref = "function" === typeof offset ? offset(Object.assign({}, rects, {
            placement
        })) : offset, skidding = _ref[0], distance = _ref[1];
        skidding = skidding || 0;
        distance = (distance || 0) * invertDistance;
        return [ left, right ].indexOf(basePlacement) >= 0 ? {
            x: distance,
            y: skidding
        } : {
            x: skidding,
            y: distance
        };
    }
    function offset(_ref2) {
        var state = _ref2.state, options = _ref2.options, name = _ref2.name;
        var _options$offset = options.offset, offset = void 0 === _options$offset ? [ 0, 0 ] : _options$offset;
        var data = enums_placements.reduce((function(acc, placement) {
            acc[placement] = distanceAndSkiddingToXY(placement, state.rects, offset);
            return acc;
        }), {});
        var _data$state$placement = data[state.placement], x = _data$state$placement.x, y = _data$state$placement.y;
        if (null != state.modifiersData.popperOffsets) {
            state.modifiersData.popperOffsets.x += x;
            state.modifiersData.popperOffsets.y += y;
        }
        state.modifiersData[name] = data;
    }
    const modifiers_offset = {
        name: "offset",
        enabled: true,
        phase: "main",
        requires: [ "popperOffsets" ],
        fn: offset
    };
    var hash = {
        left: "right",
        right: "left",
        bottom: "top",
        top: "bottom"
    };
    function getOppositePlacement(placement) {
        return placement.replace(/left|right|bottom|top/g, (function(matched) {
            return hash[matched];
        }));
    }
    var getOppositeVariationPlacement_hash = {
        start: "end",
        end: "start"
    };
    function getOppositeVariationPlacement(placement) {
        return placement.replace(/start|end/g, (function(matched) {
            return getOppositeVariationPlacement_hash[matched];
        }));
    }
    function getViewportRect(element) {
        var win = getWindow_getWindow(element);
        var html = getDocumentElement(element);
        var visualViewport = win.visualViewport;
        var width = html.clientWidth;
        var height = html.clientHeight;
        var x = 0;
        var y = 0;
        if (visualViewport) {
            width = visualViewport.width;
            height = visualViewport.height;
            if (!/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
                x = visualViewport.offsetLeft;
                y = visualViewport.offsetTop;
            }
        }
        return {
            width,
            height,
            x: x + getWindowScrollBarX(element),
            y
        };
    }
    function getDocumentRect(element) {
        var _element$ownerDocumen;
        var html = getDocumentElement(element);
        var winScroll = getWindowScroll(element);
        var body = null == (_element$ownerDocumen = element.ownerDocument) ? void 0 : _element$ownerDocumen.body;
        var width = math_max(html.scrollWidth, html.clientWidth, body ? body.scrollWidth : 0, body ? body.clientWidth : 0);
        var height = math_max(html.scrollHeight, html.clientHeight, body ? body.scrollHeight : 0, body ? body.clientHeight : 0);
        var x = -winScroll.scrollLeft + getWindowScrollBarX(element);
        var y = -winScroll.scrollTop;
        if ("rtl" === getComputedStyle_getComputedStyle(body || html).direction) x += math_max(html.clientWidth, body ? body.clientWidth : 0) - width;
        return {
            width,
            height,
            x,
            y
        };
    }
    function contains(parent, child) {
        var rootNode = child.getRootNode && child.getRootNode();
        if (parent.contains(child)) return true; else if (rootNode && isShadowRoot(rootNode)) {
            var next = child;
            do {
                if (next && parent.isSameNode(next)) return true;
                next = next.parentNode || next.host;
            } while (next);
        }
        return false;
    }
    function rectToClientRect(rect) {
        return Object.assign({}, rect, {
            left: rect.x,
            top: rect.y,
            right: rect.x + rect.width,
            bottom: rect.y + rect.height
        });
    }
    function getInnerBoundingClientRect(element) {
        var rect = getBoundingClientRect(element);
        rect.top = rect.top + element.clientTop;
        rect.left = rect.left + element.clientLeft;
        rect.bottom = rect.top + element.clientHeight;
        rect.right = rect.left + element.clientWidth;
        rect.width = element.clientWidth;
        rect.height = element.clientHeight;
        rect.x = rect.left;
        rect.y = rect.top;
        return rect;
    }
    function getClientRectFromMixedType(element, clippingParent) {
        return clippingParent === viewport ? rectToClientRect(getViewportRect(element)) : isElement(clippingParent) ? getInnerBoundingClientRect(clippingParent) : rectToClientRect(getDocumentRect(getDocumentElement(element)));
    }
    function getClippingParents(element) {
        var clippingParents = listScrollParents(getParentNode(element));
        var canEscapeClipping = [ "absolute", "fixed" ].indexOf(getComputedStyle_getComputedStyle(element).position) >= 0;
        var clipperElement = canEscapeClipping && isHTMLElement(element) ? getOffsetParent(element) : element;
        if (!isElement(clipperElement)) return [];
        return clippingParents.filter((function(clippingParent) {
            return isElement(clippingParent) && contains(clippingParent, clipperElement) && "body" !== getNodeName(clippingParent);
        }));
    }
    function getClippingRect(element, boundary, rootBoundary) {
        var mainClippingParents = "clippingParents" === boundary ? getClippingParents(element) : [].concat(boundary);
        var clippingParents = [].concat(mainClippingParents, [ rootBoundary ]);
        var firstClippingParent = clippingParents[0];
        var clippingRect = clippingParents.reduce((function(accRect, clippingParent) {
            var rect = getClientRectFromMixedType(element, clippingParent);
            accRect.top = math_max(rect.top, accRect.top);
            accRect.right = math_min(rect.right, accRect.right);
            accRect.bottom = math_min(rect.bottom, accRect.bottom);
            accRect.left = math_max(rect.left, accRect.left);
            return accRect;
        }), getClientRectFromMixedType(element, firstClippingParent));
        clippingRect.width = clippingRect.right - clippingRect.left;
        clippingRect.height = clippingRect.bottom - clippingRect.top;
        clippingRect.x = clippingRect.left;
        clippingRect.y = clippingRect.top;
        return clippingRect;
    }
    function getFreshSideObject() {
        return {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
        };
    }
    function mergePaddingObject(paddingObject) {
        return Object.assign({}, getFreshSideObject(), paddingObject);
    }
    function expandToHashMap(value, keys) {
        return keys.reduce((function(hashMap, key) {
            hashMap[key] = value;
            return hashMap;
        }), {});
    }
    function detectOverflow(state, options) {
        if (void 0 === options) options = {};
        var _options = options, _options$placement = _options.placement, placement = void 0 === _options$placement ? state.placement : _options$placement, _options$boundary = _options.boundary, boundary = void 0 === _options$boundary ? clippingParents : _options$boundary, _options$rootBoundary = _options.rootBoundary, rootBoundary = void 0 === _options$rootBoundary ? viewport : _options$rootBoundary, _options$elementConte = _options.elementContext, elementContext = void 0 === _options$elementConte ? popper : _options$elementConte, _options$altBoundary = _options.altBoundary, altBoundary = void 0 === _options$altBoundary ? false : _options$altBoundary, _options$padding = _options.padding, padding = void 0 === _options$padding ? 0 : _options$padding;
        var paddingObject = mergePaddingObject("number" !== typeof padding ? padding : expandToHashMap(padding, basePlacements));
        var altContext = elementContext === popper ? reference : popper;
        var popperRect = state.rects.popper;
        var element = state.elements[altBoundary ? altContext : elementContext];
        var clippingClientRect = getClippingRect(isElement(element) ? element : element.contextElement || getDocumentElement(state.elements.popper), boundary, rootBoundary);
        var referenceClientRect = getBoundingClientRect(state.elements.reference);
        var popperOffsets = computeOffsets({
            reference: referenceClientRect,
            element: popperRect,
            strategy: "absolute",
            placement
        });
        var popperClientRect = rectToClientRect(Object.assign({}, popperRect, popperOffsets));
        var elementClientRect = elementContext === popper ? popperClientRect : referenceClientRect;
        var overflowOffsets = {
            top: clippingClientRect.top - elementClientRect.top + paddingObject.top,
            bottom: elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom,
            left: clippingClientRect.left - elementClientRect.left + paddingObject.left,
            right: elementClientRect.right - clippingClientRect.right + paddingObject.right
        };
        var offsetData = state.modifiersData.offset;
        if (elementContext === popper && offsetData) {
            var offset = offsetData[placement];
            Object.keys(overflowOffsets).forEach((function(key) {
                var multiply = [ right, bottom ].indexOf(key) >= 0 ? 1 : -1;
                var axis = [ enums_top, bottom ].indexOf(key) >= 0 ? "y" : "x";
                overflowOffsets[key] += offset[axis] * multiply;
            }));
        }
        return overflowOffsets;
    }
    function computeAutoPlacement(state, options) {
        if (void 0 === options) options = {};
        var _options = options, placement = _options.placement, boundary = _options.boundary, rootBoundary = _options.rootBoundary, padding = _options.padding, flipVariations = _options.flipVariations, _options$allowedAutoP = _options.allowedAutoPlacements, allowedAutoPlacements = void 0 === _options$allowedAutoP ? enums_placements : _options$allowedAutoP;
        var variation = getVariation(placement);
        var placements = variation ? flipVariations ? variationPlacements : variationPlacements.filter((function(placement) {
            return getVariation(placement) === variation;
        })) : basePlacements;
        var allowedPlacements = placements.filter((function(placement) {
            return allowedAutoPlacements.indexOf(placement) >= 0;
        }));
        if (0 === allowedPlacements.length) {
            allowedPlacements = placements;
            if (false) ;
        }
        var overflows = allowedPlacements.reduce((function(acc, placement) {
            acc[placement] = detectOverflow(state, {
                placement,
                boundary,
                rootBoundary,
                padding
            })[getBasePlacement(placement)];
            return acc;
        }), {});
        return Object.keys(overflows).sort((function(a, b) {
            return overflows[a] - overflows[b];
        }));
    }
    function getExpandedFallbackPlacements(placement) {
        if (getBasePlacement(placement) === auto) return [];
        var oppositePlacement = getOppositePlacement(placement);
        return [ getOppositeVariationPlacement(placement), oppositePlacement, getOppositeVariationPlacement(oppositePlacement) ];
    }
    function flip(_ref) {
        var state = _ref.state, options = _ref.options, name = _ref.name;
        if (state.modifiersData[name]._skip) return;
        var _options$mainAxis = options.mainAxis, checkMainAxis = void 0 === _options$mainAxis ? true : _options$mainAxis, _options$altAxis = options.altAxis, checkAltAxis = void 0 === _options$altAxis ? true : _options$altAxis, specifiedFallbackPlacements = options.fallbackPlacements, padding = options.padding, boundary = options.boundary, rootBoundary = options.rootBoundary, altBoundary = options.altBoundary, _options$flipVariatio = options.flipVariations, flipVariations = void 0 === _options$flipVariatio ? true : _options$flipVariatio, allowedAutoPlacements = options.allowedAutoPlacements;
        var preferredPlacement = state.options.placement;
        var basePlacement = getBasePlacement(preferredPlacement);
        var isBasePlacement = basePlacement === preferredPlacement;
        var fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipVariations ? [ getOppositePlacement(preferredPlacement) ] : getExpandedFallbackPlacements(preferredPlacement));
        var placements = [ preferredPlacement ].concat(fallbackPlacements).reduce((function(acc, placement) {
            return acc.concat(getBasePlacement(placement) === auto ? computeAutoPlacement(state, {
                placement,
                boundary,
                rootBoundary,
                padding,
                flipVariations,
                allowedAutoPlacements
            }) : placement);
        }), []);
        var referenceRect = state.rects.reference;
        var popperRect = state.rects.popper;
        var checksMap = new Map;
        var makeFallbackChecks = true;
        var firstFittingPlacement = placements[0];
        for (var i = 0; i < placements.length; i++) {
            var placement = placements[i];
            var _basePlacement = getBasePlacement(placement);
            var isStartVariation = getVariation(placement) === start;
            var isVertical = [ enums_top, bottom ].indexOf(_basePlacement) >= 0;
            var len = isVertical ? "width" : "height";
            var overflow = detectOverflow(state, {
                placement,
                boundary,
                rootBoundary,
                altBoundary,
                padding
            });
            var mainVariationSide = isVertical ? isStartVariation ? right : left : isStartVariation ? bottom : enums_top;
            if (referenceRect[len] > popperRect[len]) mainVariationSide = getOppositePlacement(mainVariationSide);
            var altVariationSide = getOppositePlacement(mainVariationSide);
            var checks = [];
            if (checkMainAxis) checks.push(overflow[_basePlacement] <= 0);
            if (checkAltAxis) checks.push(overflow[mainVariationSide] <= 0, overflow[altVariationSide] <= 0);
            if (checks.every((function(check) {
                return check;
            }))) {
                firstFittingPlacement = placement;
                makeFallbackChecks = false;
                break;
            }
            checksMap.set(placement, checks);
        }
        if (makeFallbackChecks) {
            var numberOfChecks = flipVariations ? 3 : 1;
            var _loop = function _loop(_i) {
                var fittingPlacement = placements.find((function(placement) {
                    var checks = checksMap.get(placement);
                    if (checks) return checks.slice(0, _i).every((function(check) {
                        return check;
                    }));
                }));
                if (fittingPlacement) {
                    firstFittingPlacement = fittingPlacement;
                    return "break";
                }
            };
            for (var _i = numberOfChecks; _i > 0; _i--) {
                var _ret = _loop(_i);
                if ("break" === _ret) break;
            }
        }
        if (state.placement !== firstFittingPlacement) {
            state.modifiersData[name]._skip = true;
            state.placement = firstFittingPlacement;
            state.reset = true;
        }
    }
    const modifiers_flip = {
        name: "flip",
        enabled: true,
        phase: "main",
        fn: flip,
        requiresIfExists: [ "offset" ],
        data: {
            _skip: false
        }
    };
    function getAltAxis(axis) {
        return "x" === axis ? "y" : "x";
    }
    function within(min, value, max) {
        return math_max(min, math_min(value, max));
    }
    function withinMaxClamp(min, value, max) {
        var v = within(min, value, max);
        return v > max ? max : v;
    }
    function preventOverflow(_ref) {
        var state = _ref.state, options = _ref.options, name = _ref.name;
        var _options$mainAxis = options.mainAxis, checkMainAxis = void 0 === _options$mainAxis ? true : _options$mainAxis, _options$altAxis = options.altAxis, checkAltAxis = void 0 === _options$altAxis ? false : _options$altAxis, boundary = options.boundary, rootBoundary = options.rootBoundary, altBoundary = options.altBoundary, padding = options.padding, _options$tether = options.tether, tether = void 0 === _options$tether ? true : _options$tether, _options$tetherOffset = options.tetherOffset, tetherOffset = void 0 === _options$tetherOffset ? 0 : _options$tetherOffset;
        var overflow = detectOverflow(state, {
            boundary,
            rootBoundary,
            padding,
            altBoundary
        });
        var basePlacement = getBasePlacement(state.placement);
        var variation = getVariation(state.placement);
        var isBasePlacement = !variation;
        var mainAxis = getMainAxisFromPlacement(basePlacement);
        var altAxis = getAltAxis(mainAxis);
        var popperOffsets = state.modifiersData.popperOffsets;
        var referenceRect = state.rects.reference;
        var popperRect = state.rects.popper;
        var tetherOffsetValue = "function" === typeof tetherOffset ? tetherOffset(Object.assign({}, state.rects, {
            placement: state.placement
        })) : tetherOffset;
        var normalizedTetherOffsetValue = "number" === typeof tetherOffsetValue ? {
            mainAxis: tetherOffsetValue,
            altAxis: tetherOffsetValue
        } : Object.assign({
            mainAxis: 0,
            altAxis: 0
        }, tetherOffsetValue);
        var offsetModifierState = state.modifiersData.offset ? state.modifiersData.offset[state.placement] : null;
        var data = {
            x: 0,
            y: 0
        };
        if (!popperOffsets) return;
        if (checkMainAxis) {
            var _offsetModifierState$;
            var mainSide = "y" === mainAxis ? enums_top : left;
            var altSide = "y" === mainAxis ? bottom : right;
            var len = "y" === mainAxis ? "height" : "width";
            var offset = popperOffsets[mainAxis];
            var min = offset + overflow[mainSide];
            var max = offset - overflow[altSide];
            var additive = tether ? -popperRect[len] / 2 : 0;
            var minLen = variation === start ? referenceRect[len] : popperRect[len];
            var maxLen = variation === start ? -popperRect[len] : -referenceRect[len];
            var arrowElement = state.elements.arrow;
            var arrowRect = tether && arrowElement ? getLayoutRect(arrowElement) : {
                width: 0,
                height: 0
            };
            var arrowPaddingObject = state.modifiersData["arrow#persistent"] ? state.modifiersData["arrow#persistent"].padding : getFreshSideObject();
            var arrowPaddingMin = arrowPaddingObject[mainSide];
            var arrowPaddingMax = arrowPaddingObject[altSide];
            var arrowLen = within(0, referenceRect[len], arrowRect[len]);
            var minOffset = isBasePlacement ? referenceRect[len] / 2 - additive - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis : minLen - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis;
            var maxOffset = isBasePlacement ? -referenceRect[len] / 2 + additive + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis : maxLen + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis;
            var arrowOffsetParent = state.elements.arrow && getOffsetParent(state.elements.arrow);
            var clientOffset = arrowOffsetParent ? "y" === mainAxis ? arrowOffsetParent.clientTop || 0 : arrowOffsetParent.clientLeft || 0 : 0;
            var offsetModifierValue = null != (_offsetModifierState$ = null == offsetModifierState ? void 0 : offsetModifierState[mainAxis]) ? _offsetModifierState$ : 0;
            var tetherMin = offset + minOffset - offsetModifierValue - clientOffset;
            var tetherMax = offset + maxOffset - offsetModifierValue;
            var preventedOffset = within(tether ? math_min(min, tetherMin) : min, offset, tether ? math_max(max, tetherMax) : max);
            popperOffsets[mainAxis] = preventedOffset;
            data[mainAxis] = preventedOffset - offset;
        }
        if (checkAltAxis) {
            var _offsetModifierState$2;
            var _mainSide = "x" === mainAxis ? enums_top : left;
            var _altSide = "x" === mainAxis ? bottom : right;
            var _offset = popperOffsets[altAxis];
            var _len = "y" === altAxis ? "height" : "width";
            var _min = _offset + overflow[_mainSide];
            var _max = _offset - overflow[_altSide];
            var isOriginSide = -1 !== [ enums_top, left ].indexOf(basePlacement);
            var _offsetModifierValue = null != (_offsetModifierState$2 = null == offsetModifierState ? void 0 : offsetModifierState[altAxis]) ? _offsetModifierState$2 : 0;
            var _tetherMin = isOriginSide ? _min : _offset - referenceRect[_len] - popperRect[_len] - _offsetModifierValue + normalizedTetherOffsetValue.altAxis;
            var _tetherMax = isOriginSide ? _offset + referenceRect[_len] + popperRect[_len] - _offsetModifierValue - normalizedTetherOffsetValue.altAxis : _max;
            var _preventedOffset = tether && isOriginSide ? withinMaxClamp(_tetherMin, _offset, _tetherMax) : within(tether ? _tetherMin : _min, _offset, tether ? _tetherMax : _max);
            popperOffsets[altAxis] = _preventedOffset;
            data[altAxis] = _preventedOffset - _offset;
        }
        state.modifiersData[name] = data;
    }
    const modifiers_preventOverflow = {
        name: "preventOverflow",
        enabled: true,
        phase: "main",
        fn: preventOverflow,
        requiresIfExists: [ "offset" ]
    };
    var toPaddingObject = function toPaddingObject(padding, state) {
        padding = "function" === typeof padding ? padding(Object.assign({}, state.rects, {
            placement: state.placement
        })) : padding;
        return mergePaddingObject("number" !== typeof padding ? padding : expandToHashMap(padding, basePlacements));
    };
    function arrow(_ref) {
        var _state$modifiersData$;
        var state = _ref.state, name = _ref.name, options = _ref.options;
        var arrowElement = state.elements.arrow;
        var popperOffsets = state.modifiersData.popperOffsets;
        var basePlacement = getBasePlacement(state.placement);
        var axis = getMainAxisFromPlacement(basePlacement);
        var isVertical = [ left, right ].indexOf(basePlacement) >= 0;
        var len = isVertical ? "height" : "width";
        if (!arrowElement || !popperOffsets) return;
        var paddingObject = toPaddingObject(options.padding, state);
        var arrowRect = getLayoutRect(arrowElement);
        var minProp = "y" === axis ? enums_top : left;
        var maxProp = "y" === axis ? bottom : right;
        var endDiff = state.rects.reference[len] + state.rects.reference[axis] - popperOffsets[axis] - state.rects.popper[len];
        var startDiff = popperOffsets[axis] - state.rects.reference[axis];
        var arrowOffsetParent = getOffsetParent(arrowElement);
        var clientSize = arrowOffsetParent ? "y" === axis ? arrowOffsetParent.clientHeight || 0 : arrowOffsetParent.clientWidth || 0 : 0;
        var centerToReference = endDiff / 2 - startDiff / 2;
        var min = paddingObject[minProp];
        var max = clientSize - arrowRect[len] - paddingObject[maxProp];
        var center = clientSize / 2 - arrowRect[len] / 2 + centerToReference;
        var offset = within(min, center, max);
        var axisProp = axis;
        state.modifiersData[name] = (_state$modifiersData$ = {}, _state$modifiersData$[axisProp] = offset, 
        _state$modifiersData$.centerOffset = offset - center, _state$modifiersData$);
    }
    function arrow_effect(_ref2) {
        var state = _ref2.state, options = _ref2.options;
        var _options$element = options.element, arrowElement = void 0 === _options$element ? "[data-popper-arrow]" : _options$element;
        if (null == arrowElement) return;
        if ("string" === typeof arrowElement) {
            arrowElement = state.elements.popper.querySelector(arrowElement);
            if (!arrowElement) return;
        }
        if (false) ;
        if (!contains(state.elements.popper, arrowElement)) {
            if (false) ;
            return;
        }
        state.elements.arrow = arrowElement;
    }
    const modifiers_arrow = {
        name: "arrow",
        enabled: true,
        phase: "main",
        fn: arrow,
        effect: arrow_effect,
        requires: [ "popperOffsets" ],
        requiresIfExists: [ "preventOverflow" ]
    };
    function getSideOffsets(overflow, rect, preventedOffsets) {
        if (void 0 === preventedOffsets) preventedOffsets = {
            x: 0,
            y: 0
        };
        return {
            top: overflow.top - rect.height - preventedOffsets.y,
            right: overflow.right - rect.width + preventedOffsets.x,
            bottom: overflow.bottom - rect.height + preventedOffsets.y,
            left: overflow.left - rect.width - preventedOffsets.x
        };
    }
    function isAnySideFullyClipped(overflow) {
        return [ enums_top, right, bottom, left ].some((function(side) {
            return overflow[side] >= 0;
        }));
    }
    function hide(_ref) {
        var state = _ref.state, name = _ref.name;
        var referenceRect = state.rects.reference;
        var popperRect = state.rects.popper;
        var preventedOffsets = state.modifiersData.preventOverflow;
        var referenceOverflow = detectOverflow(state, {
            elementContext: "reference"
        });
        var popperAltOverflow = detectOverflow(state, {
            altBoundary: true
        });
        var referenceClippingOffsets = getSideOffsets(referenceOverflow, referenceRect);
        var popperEscapeOffsets = getSideOffsets(popperAltOverflow, popperRect, preventedOffsets);
        var isReferenceHidden = isAnySideFullyClipped(referenceClippingOffsets);
        var hasPopperEscaped = isAnySideFullyClipped(popperEscapeOffsets);
        state.modifiersData[name] = {
            referenceClippingOffsets,
            popperEscapeOffsets,
            isReferenceHidden,
            hasPopperEscaped
        };
        state.attributes.popper = Object.assign({}, state.attributes.popper, {
            "data-popper-reference-hidden": isReferenceHidden,
            "data-popper-escaped": hasPopperEscaped
        });
    }
    const modifiers_hide = {
        name: "hide",
        enabled: true,
        phase: "main",
        requiresIfExists: [ "preventOverflow" ],
        fn: hide
    };
    var defaultModifiers = [ eventListeners, modifiers_popperOffsets, modifiers_computeStyles, modifiers_applyStyles, modifiers_offset, modifiers_flip, modifiers_preventOverflow, modifiers_arrow, modifiers_hide ];
    var popper_createPopper = popperGenerator({
        defaultModifiers
    });
    var BOX_CLASS = "tippy-box";
    var CONTENT_CLASS = "tippy-content";
    var BACKDROP_CLASS = "tippy-backdrop";
    var ARROW_CLASS = "tippy-arrow";
    var SVG_ARROW_CLASS = "tippy-svg-arrow";
    var TOUCH_OPTIONS = {
        passive: true,
        capture: true
    };
    var TIPPY_DEFAULT_APPEND_TO = function TIPPY_DEFAULT_APPEND_TO() {
        return document.body;
    };
    function getValueAtIndexOrReturn(value, index, defaultValue) {
        if (Array.isArray(value)) {
            var v = value[index];
            return null == v ? Array.isArray(defaultValue) ? defaultValue[index] : defaultValue : v;
        }
        return value;
    }
    function isType(value, type) {
        var str = {}.toString.call(value);
        return 0 === str.indexOf("[object") && str.indexOf(type + "]") > -1;
    }
    function invokeWithArgsOrReturn(value, args) {
        return "function" === typeof value ? value.apply(void 0, args) : value;
    }
    function tippy_esm_debounce(fn, ms) {
        if (0 === ms) return fn;
        var timeout;
        return function(arg) {
            clearTimeout(timeout);
            timeout = setTimeout((function() {
                fn(arg);
            }), ms);
        };
    }
    function splitBySpaces(value) {
        return value.split(/\s+/).filter(Boolean);
    }
    function normalizeToArray(value) {
        return [].concat(value);
    }
    function pushIfUnique(arr, value) {
        if (-1 === arr.indexOf(value)) arr.push(value);
    }
    function unique(arr) {
        return arr.filter((function(item, index) {
            return arr.indexOf(item) === index;
        }));
    }
    function tippy_esm_getBasePlacement(placement) {
        return placement.split("-")[0];
    }
    function arrayFrom(value) {
        return [].slice.call(value);
    }
    function removeUndefinedProps(obj) {
        return Object.keys(obj).reduce((function(acc, key) {
            if (void 0 !== obj[key]) acc[key] = obj[key];
            return acc;
        }), {});
    }
    function div() {
        return document.createElement("div");
    }
    function tippy_esm_isElement(value) {
        return [ "Element", "Fragment" ].some((function(type) {
            return isType(value, type);
        }));
    }
    function isNodeList(value) {
        return isType(value, "NodeList");
    }
    function isMouseEvent(value) {
        return isType(value, "MouseEvent");
    }
    function isReferenceElement(value) {
        return !!(value && value._tippy && value._tippy.reference === value);
    }
    function getArrayOfElements(value) {
        if (tippy_esm_isElement(value)) return [ value ];
        if (isNodeList(value)) return arrayFrom(value);
        if (Array.isArray(value)) return value;
        return arrayFrom(document.querySelectorAll(value));
    }
    function setTransitionDuration(els, value) {
        els.forEach((function(el) {
            if (el) el.style.transitionDuration = value + "ms";
        }));
    }
    function setVisibilityState(els, state) {
        els.forEach((function(el) {
            if (el) el.setAttribute("data-state", state);
        }));
    }
    function getOwnerDocument(elementOrElements) {
        var _element$ownerDocumen;
        var _normalizeToArray = normalizeToArray(elementOrElements), element = _normalizeToArray[0];
        return null != element && null != (_element$ownerDocumen = element.ownerDocument) && _element$ownerDocumen.body ? element.ownerDocument : document;
    }
    function isCursorOutsideInteractiveBorder(popperTreeData, event) {
        var clientX = event.clientX, clientY = event.clientY;
        return popperTreeData.every((function(_ref) {
            var popperRect = _ref.popperRect, popperState = _ref.popperState, props = _ref.props;
            var interactiveBorder = props.interactiveBorder;
            var basePlacement = tippy_esm_getBasePlacement(popperState.placement);
            var offsetData = popperState.modifiersData.offset;
            if (!offsetData) return true;
            var topDistance = "bottom" === basePlacement ? offsetData.top.y : 0;
            var bottomDistance = "top" === basePlacement ? offsetData.bottom.y : 0;
            var leftDistance = "right" === basePlacement ? offsetData.left.x : 0;
            var rightDistance = "left" === basePlacement ? offsetData.right.x : 0;
            var exceedsTop = popperRect.top - clientY + topDistance > interactiveBorder;
            var exceedsBottom = clientY - popperRect.bottom - bottomDistance > interactiveBorder;
            var exceedsLeft = popperRect.left - clientX + leftDistance > interactiveBorder;
            var exceedsRight = clientX - popperRect.right - rightDistance > interactiveBorder;
            return exceedsTop || exceedsBottom || exceedsLeft || exceedsRight;
        }));
    }
    function updateTransitionEndListener(box, action, listener) {
        var method = action + "EventListener";
        [ "transitionend", "webkitTransitionEnd" ].forEach((function(event) {
            box[method](event, listener);
        }));
    }
    function actualContains(parent, child) {
        var target = child;
        while (target) {
            var _target$getRootNode;
            if (parent.contains(target)) return true;
            target = null == target.getRootNode ? void 0 : null == (_target$getRootNode = target.getRootNode()) ? void 0 : _target$getRootNode.host;
        }
        return false;
    }
    var currentInput = {
        isTouch: false
    };
    var lastMouseMoveTime = 0;
    function onDocumentTouchStart() {
        if (currentInput.isTouch) return;
        currentInput.isTouch = true;
        if (window.performance) document.addEventListener("mousemove", onDocumentMouseMove);
    }
    function onDocumentMouseMove() {
        var now = performance.now();
        if (now - lastMouseMoveTime < 20) {
            currentInput.isTouch = false;
            document.removeEventListener("mousemove", onDocumentMouseMove);
        }
        lastMouseMoveTime = now;
    }
    function onWindowBlur() {
        var activeElement = document.activeElement;
        if (isReferenceElement(activeElement)) {
            var instance = activeElement._tippy;
            if (activeElement.blur && !instance.state.isVisible) activeElement.blur();
        }
    }
    function bindGlobalEventListeners() {
        document.addEventListener("touchstart", onDocumentTouchStart, TOUCH_OPTIONS);
        window.addEventListener("blur", onWindowBlur);
    }
    var isBrowser = "undefined" !== typeof window && "undefined" !== typeof document;
    var isIE11 = isBrowser ? !!window.msCrypto : false;
    if (false) ;
    var pluginProps = {
        animateFill: false,
        followCursor: false,
        inlinePositioning: false,
        sticky: false
    };
    var renderProps = {
        allowHTML: false,
        animation: "fade",
        arrow: true,
        content: "",
        inertia: false,
        maxWidth: 350,
        role: "tooltip",
        theme: "",
        zIndex: 9999
    };
    var defaultProps = Object.assign({
        appendTo: TIPPY_DEFAULT_APPEND_TO,
        aria: {
            content: "auto",
            expanded: "auto"
        },
        delay: 0,
        duration: [ 300, 250 ],
        getReferenceClientRect: null,
        hideOnClick: true,
        ignoreAttributes: false,
        interactive: false,
        interactiveBorder: 2,
        interactiveDebounce: 0,
        moveTransition: "",
        offset: [ 0, 10 ],
        onAfterUpdate: function onAfterUpdate() {},
        onBeforeUpdate: function onBeforeUpdate() {},
        onCreate: function onCreate() {},
        onDestroy: function onDestroy() {},
        onHidden: function onHidden() {},
        onHide: function onHide() {},
        onMount: function onMount() {},
        onShow: function onShow() {},
        onShown: function onShown() {},
        onTrigger: function onTrigger() {},
        onUntrigger: function onUntrigger() {},
        onClickOutside: function onClickOutside() {},
        placement: "top",
        plugins: [],
        popperOptions: {},
        render: null,
        showOnCreate: false,
        touch: true,
        trigger: "mouseenter focus",
        triggerTarget: null
    }, pluginProps, renderProps);
    var defaultKeys = Object.keys(defaultProps);
    var setDefaultProps = function setDefaultProps(partialProps) {
        if (false) ;
        var keys = Object.keys(partialProps);
        keys.forEach((function(key) {
            defaultProps[key] = partialProps[key];
        }));
    };
    function getExtendedPassedProps(passedProps) {
        var plugins = passedProps.plugins || [];
        var pluginProps = plugins.reduce((function(acc, plugin) {
            var name = plugin.name, defaultValue = plugin.defaultValue;
            if (name) {
                var _name;
                acc[name] = void 0 !== passedProps[name] ? passedProps[name] : null != (_name = defaultProps[name]) ? _name : defaultValue;
            }
            return acc;
        }), {});
        return Object.assign({}, passedProps, pluginProps);
    }
    function getDataAttributeProps(reference, plugins) {
        var propKeys = plugins ? Object.keys(getExtendedPassedProps(Object.assign({}, defaultProps, {
            plugins
        }))) : defaultKeys;
        var props = propKeys.reduce((function(acc, key) {
            var valueAsString = (reference.getAttribute("data-tippy-" + key) || "").trim();
            if (!valueAsString) return acc;
            if ("content" === key) acc[key] = valueAsString; else try {
                acc[key] = JSON.parse(valueAsString);
            } catch (e) {
                acc[key] = valueAsString;
            }
            return acc;
        }), {});
        return props;
    }
    function evaluateProps(reference, props) {
        var out = Object.assign({}, props, {
            content: invokeWithArgsOrReturn(props.content, [ reference ])
        }, props.ignoreAttributes ? {} : getDataAttributeProps(reference, props.plugins));
        out.aria = Object.assign({}, defaultProps.aria, out.aria);
        out.aria = {
            expanded: "auto" === out.aria.expanded ? props.interactive : out.aria.expanded,
            content: "auto" === out.aria.content ? props.interactive ? null : "describedby" : out.aria.content
        };
        return out;
    }
    var innerHTML = function innerHTML() {
        return "innerHTML";
    };
    function dangerouslySetInnerHTML(element, html) {
        element[innerHTML()] = html;
    }
    function createArrowElement(value) {
        var arrow = div();
        if (true === value) arrow.className = ARROW_CLASS; else {
            arrow.className = SVG_ARROW_CLASS;
            if (tippy_esm_isElement(value)) arrow.appendChild(value); else dangerouslySetInnerHTML(arrow, value);
        }
        return arrow;
    }
    function setContent(content, props) {
        if (tippy_esm_isElement(props.content)) {
            dangerouslySetInnerHTML(content, "");
            content.appendChild(props.content);
        } else if ("function" !== typeof props.content) if (props.allowHTML) dangerouslySetInnerHTML(content, props.content); else content.textContent = props.content;
    }
    function getChildren(popper) {
        var box = popper.firstElementChild;
        var boxChildren = arrayFrom(box.children);
        return {
            box,
            content: boxChildren.find((function(node) {
                return node.classList.contains(CONTENT_CLASS);
            })),
            arrow: boxChildren.find((function(node) {
                return node.classList.contains(ARROW_CLASS) || node.classList.contains(SVG_ARROW_CLASS);
            })),
            backdrop: boxChildren.find((function(node) {
                return node.classList.contains(BACKDROP_CLASS);
            }))
        };
    }
    function render(instance) {
        var popper = div();
        var box = div();
        box.className = BOX_CLASS;
        box.setAttribute("data-state", "hidden");
        box.setAttribute("tabindex", "-1");
        var content = div();
        content.className = CONTENT_CLASS;
        content.setAttribute("data-state", "hidden");
        setContent(content, instance.props);
        popper.appendChild(box);
        box.appendChild(content);
        onUpdate(instance.props, instance.props);
        function onUpdate(prevProps, nextProps) {
            var _getChildren = getChildren(popper), box = _getChildren.box, content = _getChildren.content, arrow = _getChildren.arrow;
            if (nextProps.theme) box.setAttribute("data-theme", nextProps.theme); else box.removeAttribute("data-theme");
            if ("string" === typeof nextProps.animation) box.setAttribute("data-animation", nextProps.animation); else box.removeAttribute("data-animation");
            if (nextProps.inertia) box.setAttribute("data-inertia", ""); else box.removeAttribute("data-inertia");
            box.style.maxWidth = "number" === typeof nextProps.maxWidth ? nextProps.maxWidth + "px" : nextProps.maxWidth;
            if (nextProps.role) box.setAttribute("role", nextProps.role); else box.removeAttribute("role");
            if (prevProps.content !== nextProps.content || prevProps.allowHTML !== nextProps.allowHTML) setContent(content, instance.props);
            if (nextProps.arrow) {
                if (!arrow) box.appendChild(createArrowElement(nextProps.arrow)); else if (prevProps.arrow !== nextProps.arrow) {
                    box.removeChild(arrow);
                    box.appendChild(createArrowElement(nextProps.arrow));
                }
            } else if (arrow) box.removeChild(arrow);
        }
        return {
            popper,
            onUpdate
        };
    }
    render.$$tippy = true;
    var idCounter = 1;
    var mouseMoveListeners = [];
    var mountedInstances = [];
    function createTippy(reference, passedProps) {
        var props = evaluateProps(reference, Object.assign({}, defaultProps, getExtendedPassedProps(removeUndefinedProps(passedProps))));
        var showTimeout;
        var hideTimeout;
        var scheduleHideAnimationFrame;
        var isVisibleFromClick = false;
        var didHideDueToDocumentMouseDown = false;
        var didTouchMove = false;
        var ignoreOnFirstUpdate = false;
        var lastTriggerEvent;
        var currentTransitionEndListener;
        var onFirstUpdate;
        var listeners = [];
        var debouncedOnMouseMove = tippy_esm_debounce(onMouseMove, props.interactiveDebounce);
        var currentTarget;
        var id = idCounter++;
        var popperInstance = null;
        var plugins = unique(props.plugins);
        var state = {
            isEnabled: true,
            isVisible: false,
            isDestroyed: false,
            isMounted: false,
            isShown: false
        };
        var instance = {
            id,
            reference,
            popper: div(),
            popperInstance,
            props,
            state,
            plugins,
            clearDelayTimeouts,
            setProps,
            setContent,
            show,
            hide,
            hideWithInteractivity,
            enable,
            disable,
            unmount,
            destroy
        };
        if (!props.render) {
            if (false) ;
            return instance;
        }
        var _props$render = props.render(instance), popper = _props$render.popper, onUpdate = _props$render.onUpdate;
        popper.setAttribute("data-tippy-root", "");
        popper.id = "tippy-" + instance.id;
        instance.popper = popper;
        reference._tippy = instance;
        popper._tippy = instance;
        var pluginsHooks = plugins.map((function(plugin) {
            return plugin.fn(instance);
        }));
        var hasAriaExpanded = reference.hasAttribute("aria-expanded");
        addListeners();
        handleAriaExpandedAttribute();
        handleStyles();
        invokeHook("onCreate", [ instance ]);
        if (props.showOnCreate) scheduleShow();
        popper.addEventListener("mouseenter", (function() {
            if (instance.props.interactive && instance.state.isVisible) instance.clearDelayTimeouts();
        }));
        popper.addEventListener("mouseleave", (function() {
            if (instance.props.interactive && instance.props.trigger.indexOf("mouseenter") >= 0) getDocument().addEventListener("mousemove", debouncedOnMouseMove);
        }));
        return instance;
        function getNormalizedTouchSettings() {
            var touch = instance.props.touch;
            return Array.isArray(touch) ? touch : [ touch, 0 ];
        }
        function getIsCustomTouchBehavior() {
            return "hold" === getNormalizedTouchSettings()[0];
        }
        function getIsDefaultRenderFn() {
            var _instance$props$rende;
            return !!(null != (_instance$props$rende = instance.props.render) && _instance$props$rende.$$tippy);
        }
        function getCurrentTarget() {
            return currentTarget || reference;
        }
        function getDocument() {
            var parent = getCurrentTarget().parentNode;
            return parent ? getOwnerDocument(parent) : document;
        }
        function getDefaultTemplateChildren() {
            return getChildren(popper);
        }
        function getDelay(isShow) {
            if (instance.state.isMounted && !instance.state.isVisible || currentInput.isTouch || lastTriggerEvent && "focus" === lastTriggerEvent.type) return 0;
            return getValueAtIndexOrReturn(instance.props.delay, isShow ? 0 : 1, defaultProps.delay);
        }
        function handleStyles(fromHide) {
            if (void 0 === fromHide) fromHide = false;
            popper.style.pointerEvents = instance.props.interactive && !fromHide ? "" : "none";
            popper.style.zIndex = "" + instance.props.zIndex;
        }
        function invokeHook(hook, args, shouldInvokePropsHook) {
            if (void 0 === shouldInvokePropsHook) shouldInvokePropsHook = true;
            pluginsHooks.forEach((function(pluginHooks) {
                if (pluginHooks[hook]) pluginHooks[hook].apply(pluginHooks, args);
            }));
            if (shouldInvokePropsHook) {
                var _instance$props;
                (_instance$props = instance.props)[hook].apply(_instance$props, args);
            }
        }
        function handleAriaContentAttribute() {
            var aria = instance.props.aria;
            if (!aria.content) return;
            var attr = "aria-" + aria.content;
            var id = popper.id;
            var nodes = normalizeToArray(instance.props.triggerTarget || reference);
            nodes.forEach((function(node) {
                var currentValue = node.getAttribute(attr);
                if (instance.state.isVisible) node.setAttribute(attr, currentValue ? currentValue + " " + id : id); else {
                    var nextValue = currentValue && currentValue.replace(id, "").trim();
                    if (nextValue) node.setAttribute(attr, nextValue); else node.removeAttribute(attr);
                }
            }));
        }
        function handleAriaExpandedAttribute() {
            if (hasAriaExpanded || !instance.props.aria.expanded) return;
            var nodes = normalizeToArray(instance.props.triggerTarget || reference);
            nodes.forEach((function(node) {
                if (instance.props.interactive) node.setAttribute("aria-expanded", instance.state.isVisible && node === getCurrentTarget() ? "true" : "false"); else node.removeAttribute("aria-expanded");
            }));
        }
        function cleanupInteractiveMouseListeners() {
            getDocument().removeEventListener("mousemove", debouncedOnMouseMove);
            mouseMoveListeners = mouseMoveListeners.filter((function(listener) {
                return listener !== debouncedOnMouseMove;
            }));
        }
        function onDocumentPress(event) {
            if (currentInput.isTouch) if (didTouchMove || "mousedown" === event.type) return;
            var actualTarget = event.composedPath && event.composedPath()[0] || event.target;
            if (instance.props.interactive && actualContains(popper, actualTarget)) return;
            if (normalizeToArray(instance.props.triggerTarget || reference).some((function(el) {
                return actualContains(el, actualTarget);
            }))) {
                if (currentInput.isTouch) return;
                if (instance.state.isVisible && instance.props.trigger.indexOf("click") >= 0) return;
            } else invokeHook("onClickOutside", [ instance, event ]);
            if (true === instance.props.hideOnClick) {
                instance.clearDelayTimeouts();
                instance.hide();
                didHideDueToDocumentMouseDown = true;
                setTimeout((function() {
                    didHideDueToDocumentMouseDown = false;
                }));
                if (!instance.state.isMounted) removeDocumentPress();
            }
        }
        function onTouchMove() {
            didTouchMove = true;
        }
        function onTouchStart() {
            didTouchMove = false;
        }
        function addDocumentPress() {
            var doc = getDocument();
            doc.addEventListener("mousedown", onDocumentPress, true);
            doc.addEventListener("touchend", onDocumentPress, TOUCH_OPTIONS);
            doc.addEventListener("touchstart", onTouchStart, TOUCH_OPTIONS);
            doc.addEventListener("touchmove", onTouchMove, TOUCH_OPTIONS);
        }
        function removeDocumentPress() {
            var doc = getDocument();
            doc.removeEventListener("mousedown", onDocumentPress, true);
            doc.removeEventListener("touchend", onDocumentPress, TOUCH_OPTIONS);
            doc.removeEventListener("touchstart", onTouchStart, TOUCH_OPTIONS);
            doc.removeEventListener("touchmove", onTouchMove, TOUCH_OPTIONS);
        }
        function onTransitionedOut(duration, callback) {
            onTransitionEnd(duration, (function() {
                if (!instance.state.isVisible && popper.parentNode && popper.parentNode.contains(popper)) callback();
            }));
        }
        function onTransitionedIn(duration, callback) {
            onTransitionEnd(duration, callback);
        }
        function onTransitionEnd(duration, callback) {
            var box = getDefaultTemplateChildren().box;
            function listener(event) {
                if (event.target === box) {
                    updateTransitionEndListener(box, "remove", listener);
                    callback();
                }
            }
            if (0 === duration) return callback();
            updateTransitionEndListener(box, "remove", currentTransitionEndListener);
            updateTransitionEndListener(box, "add", listener);
            currentTransitionEndListener = listener;
        }
        function on(eventType, handler, options) {
            if (void 0 === options) options = false;
            var nodes = normalizeToArray(instance.props.triggerTarget || reference);
            nodes.forEach((function(node) {
                node.addEventListener(eventType, handler, options);
                listeners.push({
                    node,
                    eventType,
                    handler,
                    options
                });
            }));
        }
        function addListeners() {
            if (getIsCustomTouchBehavior()) {
                on("touchstart", onTrigger, {
                    passive: true
                });
                on("touchend", onMouseLeave, {
                    passive: true
                });
            }
            splitBySpaces(instance.props.trigger).forEach((function(eventType) {
                if ("manual" === eventType) return;
                on(eventType, onTrigger);
                switch (eventType) {
                  case "mouseenter":
                    on("mouseleave", onMouseLeave);
                    break;

                  case "focus":
                    on(isIE11 ? "focusout" : "blur", onBlurOrFocusOut);
                    break;

                  case "focusin":
                    on("focusout", onBlurOrFocusOut);
                    break;
                }
            }));
        }
        function removeListeners() {
            listeners.forEach((function(_ref) {
                var node = _ref.node, eventType = _ref.eventType, handler = _ref.handler, options = _ref.options;
                node.removeEventListener(eventType, handler, options);
            }));
            listeners = [];
        }
        function onTrigger(event) {
            var _lastTriggerEvent;
            var shouldScheduleClickHide = false;
            if (!instance.state.isEnabled || isEventListenerStopped(event) || didHideDueToDocumentMouseDown) return;
            var wasFocused = "focus" === (null == (_lastTriggerEvent = lastTriggerEvent) ? void 0 : _lastTriggerEvent.type);
            lastTriggerEvent = event;
            currentTarget = event.currentTarget;
            handleAriaExpandedAttribute();
            if (!instance.state.isVisible && isMouseEvent(event)) mouseMoveListeners.forEach((function(listener) {
                return listener(event);
            }));
            if ("click" === event.type && (instance.props.trigger.indexOf("mouseenter") < 0 || isVisibleFromClick) && false !== instance.props.hideOnClick && instance.state.isVisible) shouldScheduleClickHide = true; else scheduleShow(event);
            if ("click" === event.type) isVisibleFromClick = !shouldScheduleClickHide;
            if (shouldScheduleClickHide && !wasFocused) scheduleHide(event);
        }
        function onMouseMove(event) {
            var target = event.target;
            var isCursorOverReferenceOrPopper = getCurrentTarget().contains(target) || popper.contains(target);
            if ("mousemove" === event.type && isCursorOverReferenceOrPopper) return;
            var popperTreeData = getNestedPopperTree().concat(popper).map((function(popper) {
                var _instance$popperInsta;
                var instance = popper._tippy;
                var state = null == (_instance$popperInsta = instance.popperInstance) ? void 0 : _instance$popperInsta.state;
                if (state) return {
                    popperRect: popper.getBoundingClientRect(),
                    popperState: state,
                    props
                };
                return null;
            })).filter(Boolean);
            if (isCursorOutsideInteractiveBorder(popperTreeData, event)) {
                cleanupInteractiveMouseListeners();
                scheduleHide(event);
            }
        }
        function onMouseLeave(event) {
            var shouldBail = isEventListenerStopped(event) || instance.props.trigger.indexOf("click") >= 0 && isVisibleFromClick;
            if (shouldBail) return;
            if (instance.props.interactive) {
                instance.hideWithInteractivity(event);
                return;
            }
            scheduleHide(event);
        }
        function onBlurOrFocusOut(event) {
            if (instance.props.trigger.indexOf("focusin") < 0 && event.target !== getCurrentTarget()) return;
            if (instance.props.interactive && event.relatedTarget && popper.contains(event.relatedTarget)) return;
            scheduleHide(event);
        }
        function isEventListenerStopped(event) {
            return currentInput.isTouch ? getIsCustomTouchBehavior() !== event.type.indexOf("touch") >= 0 : false;
        }
        function createPopperInstance() {
            destroyPopperInstance();
            var _instance$props2 = instance.props, popperOptions = _instance$props2.popperOptions, placement = _instance$props2.placement, offset = _instance$props2.offset, getReferenceClientRect = _instance$props2.getReferenceClientRect, moveTransition = _instance$props2.moveTransition;
            var arrow = getIsDefaultRenderFn() ? getChildren(popper).arrow : null;
            var computedReference = getReferenceClientRect ? {
                getBoundingClientRect: getReferenceClientRect,
                contextElement: getReferenceClientRect.contextElement || getCurrentTarget()
            } : reference;
            var tippyModifier = {
                name: "$$tippy",
                enabled: true,
                phase: "beforeWrite",
                requires: [ "computeStyles" ],
                fn: function fn(_ref2) {
                    var state = _ref2.state;
                    if (getIsDefaultRenderFn()) {
                        var _getDefaultTemplateCh = getDefaultTemplateChildren(), box = _getDefaultTemplateCh.box;
                        [ "placement", "reference-hidden", "escaped" ].forEach((function(attr) {
                            if ("placement" === attr) box.setAttribute("data-placement", state.placement); else if (state.attributes.popper["data-popper-" + attr]) box.setAttribute("data-" + attr, ""); else box.removeAttribute("data-" + attr);
                        }));
                        state.attributes.popper = {};
                    }
                }
            };
            var modifiers = [ {
                name: "offset",
                options: {
                    offset
                }
            }, {
                name: "preventOverflow",
                options: {
                    padding: {
                        top: 2,
                        bottom: 2,
                        left: 5,
                        right: 5
                    }
                }
            }, {
                name: "flip",
                options: {
                    padding: 5
                }
            }, {
                name: "computeStyles",
                options: {
                    adaptive: !moveTransition
                }
            }, tippyModifier ];
            if (getIsDefaultRenderFn() && arrow) modifiers.push({
                name: "arrow",
                options: {
                    element: arrow,
                    padding: 3
                }
            });
            modifiers.push.apply(modifiers, (null == popperOptions ? void 0 : popperOptions.modifiers) || []);
            instance.popperInstance = popper_createPopper(computedReference, popper, Object.assign({}, popperOptions, {
                placement,
                onFirstUpdate,
                modifiers
            }));
        }
        function destroyPopperInstance() {
            if (instance.popperInstance) {
                instance.popperInstance.destroy();
                instance.popperInstance = null;
            }
        }
        function mount() {
            var appendTo = instance.props.appendTo;
            var parentNode;
            var node = getCurrentTarget();
            if (instance.props.interactive && appendTo === TIPPY_DEFAULT_APPEND_TO || "parent" === appendTo) parentNode = node.parentNode; else parentNode = invokeWithArgsOrReturn(appendTo, [ node ]);
            if (!parentNode.contains(popper)) parentNode.appendChild(popper);
            instance.state.isMounted = true;
            createPopperInstance();
            if (false) ;
        }
        function getNestedPopperTree() {
            return arrayFrom(popper.querySelectorAll("[data-tippy-root]"));
        }
        function scheduleShow(event) {
            instance.clearDelayTimeouts();
            if (event) invokeHook("onTrigger", [ instance, event ]);
            addDocumentPress();
            var delay = getDelay(true);
            var _getNormalizedTouchSe = getNormalizedTouchSettings(), touchValue = _getNormalizedTouchSe[0], touchDelay = _getNormalizedTouchSe[1];
            if (currentInput.isTouch && "hold" === touchValue && touchDelay) delay = touchDelay;
            if (delay) showTimeout = setTimeout((function() {
                instance.show();
            }), delay); else instance.show();
        }
        function scheduleHide(event) {
            instance.clearDelayTimeouts();
            invokeHook("onUntrigger", [ instance, event ]);
            if (!instance.state.isVisible) {
                removeDocumentPress();
                return;
            }
            if (instance.props.trigger.indexOf("mouseenter") >= 0 && instance.props.trigger.indexOf("click") >= 0 && [ "mouseleave", "mousemove" ].indexOf(event.type) >= 0 && isVisibleFromClick) return;
            var delay = getDelay(false);
            if (delay) hideTimeout = setTimeout((function() {
                if (instance.state.isVisible) instance.hide();
            }), delay); else scheduleHideAnimationFrame = requestAnimationFrame((function() {
                instance.hide();
            }));
        }
        function enable() {
            instance.state.isEnabled = true;
        }
        function disable() {
            instance.hide();
            instance.state.isEnabled = false;
        }
        function clearDelayTimeouts() {
            clearTimeout(showTimeout);
            clearTimeout(hideTimeout);
            cancelAnimationFrame(scheduleHideAnimationFrame);
        }
        function setProps(partialProps) {
            if (false) ;
            if (instance.state.isDestroyed) return;
            invokeHook("onBeforeUpdate", [ instance, partialProps ]);
            removeListeners();
            var prevProps = instance.props;
            var nextProps = evaluateProps(reference, Object.assign({}, prevProps, removeUndefinedProps(partialProps), {
                ignoreAttributes: true
            }));
            instance.props = nextProps;
            addListeners();
            if (prevProps.interactiveDebounce !== nextProps.interactiveDebounce) {
                cleanupInteractiveMouseListeners();
                debouncedOnMouseMove = tippy_esm_debounce(onMouseMove, nextProps.interactiveDebounce);
            }
            if (prevProps.triggerTarget && !nextProps.triggerTarget) normalizeToArray(prevProps.triggerTarget).forEach((function(node) {
                node.removeAttribute("aria-expanded");
            })); else if (nextProps.triggerTarget) reference.removeAttribute("aria-expanded");
            handleAriaExpandedAttribute();
            handleStyles();
            if (onUpdate) onUpdate(prevProps, nextProps);
            if (instance.popperInstance) {
                createPopperInstance();
                getNestedPopperTree().forEach((function(nestedPopper) {
                    requestAnimationFrame(nestedPopper._tippy.popperInstance.forceUpdate);
                }));
            }
            invokeHook("onAfterUpdate", [ instance, partialProps ]);
        }
        function setContent(content) {
            instance.setProps({
                content
            });
        }
        function show() {
            if (false) ;
            var isAlreadyVisible = instance.state.isVisible;
            var isDestroyed = instance.state.isDestroyed;
            var isDisabled = !instance.state.isEnabled;
            var isTouchAndTouchDisabled = currentInput.isTouch && !instance.props.touch;
            var duration = getValueAtIndexOrReturn(instance.props.duration, 0, defaultProps.duration);
            if (isAlreadyVisible || isDestroyed || isDisabled || isTouchAndTouchDisabled) return;
            if (getCurrentTarget().hasAttribute("disabled")) return;
            invokeHook("onShow", [ instance ], false);
            if (false === instance.props.onShow(instance)) return;
            instance.state.isVisible = true;
            if (getIsDefaultRenderFn()) popper.style.visibility = "visible";
            handleStyles();
            addDocumentPress();
            if (!instance.state.isMounted) popper.style.transition = "none";
            if (getIsDefaultRenderFn()) {
                var _getDefaultTemplateCh2 = getDefaultTemplateChildren(), box = _getDefaultTemplateCh2.box, content = _getDefaultTemplateCh2.content;
                setTransitionDuration([ box, content ], 0);
            }
            onFirstUpdate = function onFirstUpdate() {
                var _instance$popperInsta2;
                if (!instance.state.isVisible || ignoreOnFirstUpdate) return;
                ignoreOnFirstUpdate = true;
                void popper.offsetHeight;
                popper.style.transition = instance.props.moveTransition;
                if (getIsDefaultRenderFn() && instance.props.animation) {
                    var _getDefaultTemplateCh3 = getDefaultTemplateChildren(), _box = _getDefaultTemplateCh3.box, _content = _getDefaultTemplateCh3.content;
                    setTransitionDuration([ _box, _content ], duration);
                    setVisibilityState([ _box, _content ], "visible");
                }
                handleAriaContentAttribute();
                handleAriaExpandedAttribute();
                pushIfUnique(mountedInstances, instance);
                null == (_instance$popperInsta2 = instance.popperInstance) ? void 0 : _instance$popperInsta2.forceUpdate();
                invokeHook("onMount", [ instance ]);
                if (instance.props.animation && getIsDefaultRenderFn()) onTransitionedIn(duration, (function() {
                    instance.state.isShown = true;
                    invokeHook("onShown", [ instance ]);
                }));
            };
            mount();
        }
        function hide() {
            if (false) ;
            var isAlreadyHidden = !instance.state.isVisible;
            var isDestroyed = instance.state.isDestroyed;
            var isDisabled = !instance.state.isEnabled;
            var duration = getValueAtIndexOrReturn(instance.props.duration, 1, defaultProps.duration);
            if (isAlreadyHidden || isDestroyed || isDisabled) return;
            invokeHook("onHide", [ instance ], false);
            if (false === instance.props.onHide(instance)) return;
            instance.state.isVisible = false;
            instance.state.isShown = false;
            ignoreOnFirstUpdate = false;
            isVisibleFromClick = false;
            if (getIsDefaultRenderFn()) popper.style.visibility = "hidden";
            cleanupInteractiveMouseListeners();
            removeDocumentPress();
            handleStyles(true);
            if (getIsDefaultRenderFn()) {
                var _getDefaultTemplateCh4 = getDefaultTemplateChildren(), box = _getDefaultTemplateCh4.box, content = _getDefaultTemplateCh4.content;
                if (instance.props.animation) {
                    setTransitionDuration([ box, content ], duration);
                    setVisibilityState([ box, content ], "hidden");
                }
            }
            handleAriaContentAttribute();
            handleAriaExpandedAttribute();
            if (instance.props.animation) {
                if (getIsDefaultRenderFn()) onTransitionedOut(duration, instance.unmount);
            } else instance.unmount();
        }
        function hideWithInteractivity(event) {
            if (false) ;
            getDocument().addEventListener("mousemove", debouncedOnMouseMove);
            pushIfUnique(mouseMoveListeners, debouncedOnMouseMove);
            debouncedOnMouseMove(event);
        }
        function unmount() {
            if (false) ;
            if (instance.state.isVisible) instance.hide();
            if (!instance.state.isMounted) return;
            destroyPopperInstance();
            getNestedPopperTree().forEach((function(nestedPopper) {
                nestedPopper._tippy.unmount();
            }));
            if (popper.parentNode) popper.parentNode.removeChild(popper);
            mountedInstances = mountedInstances.filter((function(i) {
                return i !== instance;
            }));
            instance.state.isMounted = false;
            invokeHook("onHidden", [ instance ]);
        }
        function destroy() {
            if (false) ;
            if (instance.state.isDestroyed) return;
            instance.clearDelayTimeouts();
            instance.unmount();
            removeListeners();
            delete reference._tippy;
            instance.state.isDestroyed = true;
            invokeHook("onDestroy", [ instance ]);
        }
    }
    function tippy(targets, optionalProps) {
        if (void 0 === optionalProps) optionalProps = {};
        var plugins = defaultProps.plugins.concat(optionalProps.plugins || []);
        if (false) ;
        bindGlobalEventListeners();
        var passedProps = Object.assign({}, optionalProps, {
            plugins
        });
        var elements = getArrayOfElements(targets);
        if (false) ;
        var instances = elements.reduce((function(acc, reference) {
            var instance = reference && createTippy(reference, passedProps);
            if (instance) acc.push(instance);
            return acc;
        }), []);
        return tippy_esm_isElement(targets) ? instances[0] : instances;
    }
    tippy.defaultProps = defaultProps;
    tippy.setDefaultProps = setDefaultProps;
    tippy.currentInput = currentInput;
    Object.assign({}, modifiers_applyStyles, {
        effect: function effect(_ref) {
            var state = _ref.state;
            var initialStyles = {
                popper: {
                    position: state.options.strategy,
                    left: "0",
                    top: "0",
                    margin: "0"
                },
                arrow: {
                    position: "absolute"
                },
                reference: {}
            };
            Object.assign(state.elements.popper.style, initialStyles.popper);
            state.styles = initialStyles;
            if (state.elements.arrow) Object.assign(state.elements.arrow.style, initialStyles.arrow);
        }
    });
    tippy.setDefaultProps({
        render
    });
    const tippy_esm = tippy;
    modules_flsModules.tippy = tippy_esm("[data-tippy-content]", {});
    function isObject(obj) {
        return null !== obj && "object" === typeof obj && "constructor" in obj && obj.constructor === Object;
    }
    function extend(target = {}, src = {}) {
        Object.keys(src).forEach((key => {
            if ("undefined" === typeof target[key]) target[key] = src[key]; else if (isObject(src[key]) && isObject(target[key]) && Object.keys(src[key]).length > 0) extend(target[key], src[key]);
        }));
    }
    const ssrDocument = {
        body: {},
        addEventListener() {},
        removeEventListener() {},
        activeElement: {
            blur() {},
            nodeName: ""
        },
        querySelector() {
            return null;
        },
        querySelectorAll() {
            return [];
        },
        getElementById() {
            return null;
        },
        createEvent() {
            return {
                initEvent() {}
            };
        },
        createElement() {
            return {
                children: [],
                childNodes: [],
                style: {},
                setAttribute() {},
                getElementsByTagName() {
                    return [];
                }
            };
        },
        createElementNS() {
            return {};
        },
        importNode() {
            return null;
        },
        location: {
            hash: "",
            host: "",
            hostname: "",
            href: "",
            origin: "",
            pathname: "",
            protocol: "",
            search: ""
        }
    };
    function ssr_window_esm_getDocument() {
        const doc = "undefined" !== typeof document ? document : {};
        extend(doc, ssrDocument);
        return doc;
    }
    const ssrWindow = {
        document: ssrDocument,
        navigator: {
            userAgent: ""
        },
        location: {
            hash: "",
            host: "",
            hostname: "",
            href: "",
            origin: "",
            pathname: "",
            protocol: "",
            search: ""
        },
        history: {
            replaceState() {},
            pushState() {},
            go() {},
            back() {}
        },
        CustomEvent: function CustomEvent() {
            return this;
        },
        addEventListener() {},
        removeEventListener() {},
        getComputedStyle() {
            return {
                getPropertyValue() {
                    return "";
                }
            };
        },
        Image() {},
        Date() {},
        screen: {},
        setTimeout() {},
        clearTimeout() {},
        matchMedia() {
            return {};
        },
        requestAnimationFrame(callback) {
            if ("undefined" === typeof setTimeout) {
                callback();
                return null;
            }
            return setTimeout(callback, 0);
        },
        cancelAnimationFrame(id) {
            if ("undefined" === typeof setTimeout) return;
            clearTimeout(id);
        }
    };
    function ssr_window_esm_getWindow() {
        const win = "undefined" !== typeof window ? window : {};
        extend(win, ssrWindow);
        return win;
    }
    function makeReactive(obj) {
        const proto = obj.__proto__;
        Object.defineProperty(obj, "__proto__", {
            get() {
                return proto;
            },
            set(value) {
                proto.__proto__ = value;
            }
        });
    }
    class Dom7 extends Array {
        constructor(items) {
            if ("number" === typeof items) super(items); else {
                super(...items || []);
                makeReactive(this);
            }
        }
    }
    function arrayFlat(arr = []) {
        const res = [];
        arr.forEach((el => {
            if (Array.isArray(el)) res.push(...arrayFlat(el)); else res.push(el);
        }));
        return res;
    }
    function arrayFilter(arr, callback) {
        return Array.prototype.filter.call(arr, callback);
    }
    function arrayUnique(arr) {
        const uniqueArray = [];
        for (let i = 0; i < arr.length; i += 1) if (-1 === uniqueArray.indexOf(arr[i])) uniqueArray.push(arr[i]);
        return uniqueArray;
    }
    function qsa(selector, context) {
        if ("string" !== typeof selector) return [ selector ];
        const a = [];
        const res = context.querySelectorAll(selector);
        for (let i = 0; i < res.length; i += 1) a.push(res[i]);
        return a;
    }
    function dom7_esm_$(selector, context) {
        const window = ssr_window_esm_getWindow();
        const document = ssr_window_esm_getDocument();
        let arr = [];
        if (!context && selector instanceof Dom7) return selector;
        if (!selector) return new Dom7(arr);
        if ("string" === typeof selector) {
            const html = selector.trim();
            if (html.indexOf("<") >= 0 && html.indexOf(">") >= 0) {
                let toCreate = "div";
                if (0 === html.indexOf("<li")) toCreate = "ul";
                if (0 === html.indexOf("<tr")) toCreate = "tbody";
                if (0 === html.indexOf("<td") || 0 === html.indexOf("<th")) toCreate = "tr";
                if (0 === html.indexOf("<tbody")) toCreate = "table";
                if (0 === html.indexOf("<option")) toCreate = "select";
                const tempParent = document.createElement(toCreate);
                tempParent.innerHTML = html;
                for (let i = 0; i < tempParent.childNodes.length; i += 1) arr.push(tempParent.childNodes[i]);
            } else arr = qsa(selector.trim(), context || document);
        } else if (selector.nodeType || selector === window || selector === document) arr.push(selector); else if (Array.isArray(selector)) {
            if (selector instanceof Dom7) return selector;
            arr = selector;
        }
        return new Dom7(arrayUnique(arr));
    }
    dom7_esm_$.fn = Dom7.prototype;
    function addClass(...classes) {
        const classNames = arrayFlat(classes.map((c => c.split(" "))));
        this.forEach((el => {
            el.classList.add(...classNames);
        }));
        return this;
    }
    function removeClass(...classes) {
        const classNames = arrayFlat(classes.map((c => c.split(" "))));
        this.forEach((el => {
            el.classList.remove(...classNames);
        }));
        return this;
    }
    function toggleClass(...classes) {
        const classNames = arrayFlat(classes.map((c => c.split(" "))));
        this.forEach((el => {
            classNames.forEach((className => {
                el.classList.toggle(className);
            }));
        }));
    }
    function hasClass(...classes) {
        const classNames = arrayFlat(classes.map((c => c.split(" "))));
        return arrayFilter(this, (el => classNames.filter((className => el.classList.contains(className))).length > 0)).length > 0;
    }
    function attr(attrs, value) {
        if (1 === arguments.length && "string" === typeof attrs) {
            if (this[0]) return this[0].getAttribute(attrs);
            return;
        }
        for (let i = 0; i < this.length; i += 1) if (2 === arguments.length) this[i].setAttribute(attrs, value); else for (const attrName in attrs) {
            this[i][attrName] = attrs[attrName];
            this[i].setAttribute(attrName, attrs[attrName]);
        }
        return this;
    }
    function removeAttr(attr) {
        for (let i = 0; i < this.length; i += 1) this[i].removeAttribute(attr);
        return this;
    }
    function transform(transform) {
        for (let i = 0; i < this.length; i += 1) this[i].style.transform = transform;
        return this;
    }
    function transition(duration) {
        for (let i = 0; i < this.length; i += 1) this[i].style.transitionDuration = "string" !== typeof duration ? `${duration}ms` : duration;
        return this;
    }
    function on(...args) {
        let [eventType, targetSelector, listener, capture] = args;
        if ("function" === typeof args[1]) {
            [eventType, listener, capture] = args;
            targetSelector = void 0;
        }
        if (!capture) capture = false;
        function handleLiveEvent(e) {
            const target = e.target;
            if (!target) return;
            const eventData = e.target.dom7EventData || [];
            if (eventData.indexOf(e) < 0) eventData.unshift(e);
            if (dom7_esm_$(target).is(targetSelector)) listener.apply(target, eventData); else {
                const parents = dom7_esm_$(target).parents();
                for (let k = 0; k < parents.length; k += 1) if (dom7_esm_$(parents[k]).is(targetSelector)) listener.apply(parents[k], eventData);
            }
        }
        function handleEvent(e) {
            const eventData = e && e.target ? e.target.dom7EventData || [] : [];
            if (eventData.indexOf(e) < 0) eventData.unshift(e);
            listener.apply(this, eventData);
        }
        const events = eventType.split(" ");
        let j;
        for (let i = 0; i < this.length; i += 1) {
            const el = this[i];
            if (!targetSelector) for (j = 0; j < events.length; j += 1) {
                const event = events[j];
                if (!el.dom7Listeners) el.dom7Listeners = {};
                if (!el.dom7Listeners[event]) el.dom7Listeners[event] = [];
                el.dom7Listeners[event].push({
                    listener,
                    proxyListener: handleEvent
                });
                el.addEventListener(event, handleEvent, capture);
            } else for (j = 0; j < events.length; j += 1) {
                const event = events[j];
                if (!el.dom7LiveListeners) el.dom7LiveListeners = {};
                if (!el.dom7LiveListeners[event]) el.dom7LiveListeners[event] = [];
                el.dom7LiveListeners[event].push({
                    listener,
                    proxyListener: handleLiveEvent
                });
                el.addEventListener(event, handleLiveEvent, capture);
            }
        }
        return this;
    }
    function off(...args) {
        let [eventType, targetSelector, listener, capture] = args;
        if ("function" === typeof args[1]) {
            [eventType, listener, capture] = args;
            targetSelector = void 0;
        }
        if (!capture) capture = false;
        const events = eventType.split(" ");
        for (let i = 0; i < events.length; i += 1) {
            const event = events[i];
            for (let j = 0; j < this.length; j += 1) {
                const el = this[j];
                let handlers;
                if (!targetSelector && el.dom7Listeners) handlers = el.dom7Listeners[event]; else if (targetSelector && el.dom7LiveListeners) handlers = el.dom7LiveListeners[event];
                if (handlers && handlers.length) for (let k = handlers.length - 1; k >= 0; k -= 1) {
                    const handler = handlers[k];
                    if (listener && handler.listener === listener) {
                        el.removeEventListener(event, handler.proxyListener, capture);
                        handlers.splice(k, 1);
                    } else if (listener && handler.listener && handler.listener.dom7proxy && handler.listener.dom7proxy === listener) {
                        el.removeEventListener(event, handler.proxyListener, capture);
                        handlers.splice(k, 1);
                    } else if (!listener) {
                        el.removeEventListener(event, handler.proxyListener, capture);
                        handlers.splice(k, 1);
                    }
                }
            }
        }
        return this;
    }
    function trigger(...args) {
        const window = ssr_window_esm_getWindow();
        const events = args[0].split(" ");
        const eventData = args[1];
        for (let i = 0; i < events.length; i += 1) {
            const event = events[i];
            for (let j = 0; j < this.length; j += 1) {
                const el = this[j];
                if (window.CustomEvent) {
                    const evt = new window.CustomEvent(event, {
                        detail: eventData,
                        bubbles: true,
                        cancelable: true
                    });
                    el.dom7EventData = args.filter(((data, dataIndex) => dataIndex > 0));
                    el.dispatchEvent(evt);
                    el.dom7EventData = [];
                    delete el.dom7EventData;
                }
            }
        }
        return this;
    }
    function transitionEnd(callback) {
        const dom = this;
        function fireCallBack(e) {
            if (e.target !== this) return;
            callback.call(this, e);
            dom.off("transitionend", fireCallBack);
        }
        if (callback) dom.on("transitionend", fireCallBack);
        return this;
    }
    function dom7_esm_outerWidth(includeMargins) {
        if (this.length > 0) {
            if (includeMargins) {
                const styles = this.styles();
                return this[0].offsetWidth + parseFloat(styles.getPropertyValue("margin-right")) + parseFloat(styles.getPropertyValue("margin-left"));
            }
            return this[0].offsetWidth;
        }
        return null;
    }
    function dom7_esm_outerHeight(includeMargins) {
        if (this.length > 0) {
            if (includeMargins) {
                const styles = this.styles();
                return this[0].offsetHeight + parseFloat(styles.getPropertyValue("margin-top")) + parseFloat(styles.getPropertyValue("margin-bottom"));
            }
            return this[0].offsetHeight;
        }
        return null;
    }
    function dom7_esm_offset() {
        if (this.length > 0) {
            const window = ssr_window_esm_getWindow();
            const document = ssr_window_esm_getDocument();
            const el = this[0];
            const box = el.getBoundingClientRect();
            const body = document.body;
            const clientTop = el.clientTop || body.clientTop || 0;
            const clientLeft = el.clientLeft || body.clientLeft || 0;
            const scrollTop = el === window ? window.scrollY : el.scrollTop;
            const scrollLeft = el === window ? window.scrollX : el.scrollLeft;
            return {
                top: box.top + scrollTop - clientTop,
                left: box.left + scrollLeft - clientLeft
            };
        }
        return null;
    }
    function styles() {
        const window = ssr_window_esm_getWindow();
        if (this[0]) return window.getComputedStyle(this[0], null);
        return {};
    }
    function css(props, value) {
        const window = ssr_window_esm_getWindow();
        let i;
        if (1 === arguments.length) if ("string" === typeof props) {
            if (this[0]) return window.getComputedStyle(this[0], null).getPropertyValue(props);
        } else {
            for (i = 0; i < this.length; i += 1) for (const prop in props) this[i].style[prop] = props[prop];
            return this;
        }
        if (2 === arguments.length && "string" === typeof props) {
            for (i = 0; i < this.length; i += 1) this[i].style[props] = value;
            return this;
        }
        return this;
    }
    function each(callback) {
        if (!callback) return this;
        this.forEach(((el, index) => {
            callback.apply(el, [ el, index ]);
        }));
        return this;
    }
    function filter(callback) {
        const result = arrayFilter(this, callback);
        return dom7_esm_$(result);
    }
    function html(html) {
        if ("undefined" === typeof html) return this[0] ? this[0].innerHTML : null;
        for (let i = 0; i < this.length; i += 1) this[i].innerHTML = html;
        return this;
    }
    function dom7_esm_text(text) {
        if ("undefined" === typeof text) return this[0] ? this[0].textContent.trim() : null;
        for (let i = 0; i < this.length; i += 1) this[i].textContent = text;
        return this;
    }
    function is(selector) {
        const window = ssr_window_esm_getWindow();
        const document = ssr_window_esm_getDocument();
        const el = this[0];
        let compareWith;
        let i;
        if (!el || "undefined" === typeof selector) return false;
        if ("string" === typeof selector) {
            if (el.matches) return el.matches(selector);
            if (el.webkitMatchesSelector) return el.webkitMatchesSelector(selector);
            if (el.msMatchesSelector) return el.msMatchesSelector(selector);
            compareWith = dom7_esm_$(selector);
            for (i = 0; i < compareWith.length; i += 1) if (compareWith[i] === el) return true;
            return false;
        }
        if (selector === document) return el === document;
        if (selector === window) return el === window;
        if (selector.nodeType || selector instanceof Dom7) {
            compareWith = selector.nodeType ? [ selector ] : selector;
            for (i = 0; i < compareWith.length; i += 1) if (compareWith[i] === el) return true;
            return false;
        }
        return false;
    }
    function index() {
        let child = this[0];
        let i;
        if (child) {
            i = 0;
            while (null !== (child = child.previousSibling)) if (1 === child.nodeType) i += 1;
            return i;
        }
        return;
    }
    function eq(index) {
        if ("undefined" === typeof index) return this;
        const length = this.length;
        if (index > length - 1) return dom7_esm_$([]);
        if (index < 0) {
            const returnIndex = length + index;
            if (returnIndex < 0) return dom7_esm_$([]);
            return dom7_esm_$([ this[returnIndex] ]);
        }
        return dom7_esm_$([ this[index] ]);
    }
    function append(...els) {
        let newChild;
        const document = ssr_window_esm_getDocument();
        for (let k = 0; k < els.length; k += 1) {
            newChild = els[k];
            for (let i = 0; i < this.length; i += 1) if ("string" === typeof newChild) {
                const tempDiv = document.createElement("div");
                tempDiv.innerHTML = newChild;
                while (tempDiv.firstChild) this[i].appendChild(tempDiv.firstChild);
            } else if (newChild instanceof Dom7) for (let j = 0; j < newChild.length; j += 1) this[i].appendChild(newChild[j]); else this[i].appendChild(newChild);
        }
        return this;
    }
    function prepend(newChild) {
        const document = ssr_window_esm_getDocument();
        let i;
        let j;
        for (i = 0; i < this.length; i += 1) if ("string" === typeof newChild) {
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = newChild;
            for (j = tempDiv.childNodes.length - 1; j >= 0; j -= 1) this[i].insertBefore(tempDiv.childNodes[j], this[i].childNodes[0]);
        } else if (newChild instanceof Dom7) for (j = 0; j < newChild.length; j += 1) this[i].insertBefore(newChild[j], this[i].childNodes[0]); else this[i].insertBefore(newChild, this[i].childNodes[0]);
        return this;
    }
    function next(selector) {
        if (this.length > 0) {
            if (selector) {
                if (this[0].nextElementSibling && dom7_esm_$(this[0].nextElementSibling).is(selector)) return dom7_esm_$([ this[0].nextElementSibling ]);
                return dom7_esm_$([]);
            }
            if (this[0].nextElementSibling) return dom7_esm_$([ this[0].nextElementSibling ]);
            return dom7_esm_$([]);
        }
        return dom7_esm_$([]);
    }
    function nextAll(selector) {
        const nextEls = [];
        let el = this[0];
        if (!el) return dom7_esm_$([]);
        while (el.nextElementSibling) {
            const next = el.nextElementSibling;
            if (selector) {
                if (dom7_esm_$(next).is(selector)) nextEls.push(next);
            } else nextEls.push(next);
            el = next;
        }
        return dom7_esm_$(nextEls);
    }
    function prev(selector) {
        if (this.length > 0) {
            const el = this[0];
            if (selector) {
                if (el.previousElementSibling && dom7_esm_$(el.previousElementSibling).is(selector)) return dom7_esm_$([ el.previousElementSibling ]);
                return dom7_esm_$([]);
            }
            if (el.previousElementSibling) return dom7_esm_$([ el.previousElementSibling ]);
            return dom7_esm_$([]);
        }
        return dom7_esm_$([]);
    }
    function prevAll(selector) {
        const prevEls = [];
        let el = this[0];
        if (!el) return dom7_esm_$([]);
        while (el.previousElementSibling) {
            const prev = el.previousElementSibling;
            if (selector) {
                if (dom7_esm_$(prev).is(selector)) prevEls.push(prev);
            } else prevEls.push(prev);
            el = prev;
        }
        return dom7_esm_$(prevEls);
    }
    function dom7_esm_parent(selector) {
        const parents = [];
        for (let i = 0; i < this.length; i += 1) if (null !== this[i].parentNode) if (selector) {
            if (dom7_esm_$(this[i].parentNode).is(selector)) parents.push(this[i].parentNode);
        } else parents.push(this[i].parentNode);
        return dom7_esm_$(parents);
    }
    function parents(selector) {
        const parents = [];
        for (let i = 0; i < this.length; i += 1) {
            let parent = this[i].parentNode;
            while (parent) {
                if (selector) {
                    if (dom7_esm_$(parent).is(selector)) parents.push(parent);
                } else parents.push(parent);
                parent = parent.parentNode;
            }
        }
        return dom7_esm_$(parents);
    }
    function closest(selector) {
        let closest = this;
        if ("undefined" === typeof selector) return dom7_esm_$([]);
        if (!closest.is(selector)) closest = closest.parents(selector).eq(0);
        return closest;
    }
    function find(selector) {
        const foundElements = [];
        for (let i = 0; i < this.length; i += 1) {
            const found = this[i].querySelectorAll(selector);
            for (let j = 0; j < found.length; j += 1) foundElements.push(found[j]);
        }
        return dom7_esm_$(foundElements);
    }
    function children(selector) {
        const children = [];
        for (let i = 0; i < this.length; i += 1) {
            const childNodes = this[i].children;
            for (let j = 0; j < childNodes.length; j += 1) if (!selector || dom7_esm_$(childNodes[j]).is(selector)) children.push(childNodes[j]);
        }
        return dom7_esm_$(children);
    }
    function remove() {
        for (let i = 0; i < this.length; i += 1) if (this[i].parentNode) this[i].parentNode.removeChild(this[i]);
        return this;
    }
    const noTrigger = "resize scroll".split(" ");
    function shortcut(name) {
        function eventHandler(...args) {
            if ("undefined" === typeof args[0]) {
                for (let i = 0; i < this.length; i += 1) if (noTrigger.indexOf(name) < 0) if (name in this[i]) this[i][name](); else dom7_esm_$(this[i]).trigger(name);
                return this;
            }
            return this.on(name, ...args);
        }
        return eventHandler;
    }
    shortcut("click");
    shortcut("blur");
    shortcut("focus");
    shortcut("focusin");
    shortcut("focusout");
    shortcut("keyup");
    shortcut("keydown");
    shortcut("keypress");
    shortcut("submit");
    shortcut("change");
    shortcut("mousedown");
    shortcut("mousemove");
    shortcut("mouseup");
    shortcut("mouseenter");
    shortcut("mouseleave");
    shortcut("mouseout");
    shortcut("mouseover");
    shortcut("touchstart");
    shortcut("touchend");
    shortcut("touchmove");
    shortcut("resize");
    shortcut("scroll");
    const Methods = {
        addClass,
        removeClass,
        hasClass,
        toggleClass,
        attr,
        removeAttr,
        transform,
        transition,
        on,
        off,
        trigger,
        transitionEnd,
        outerWidth: dom7_esm_outerWidth,
        outerHeight: dom7_esm_outerHeight,
        styles,
        offset: dom7_esm_offset,
        css,
        each,
        html,
        text: dom7_esm_text,
        is,
        index,
        eq,
        append,
        prepend,
        next,
        nextAll,
        prev,
        prevAll,
        parent: dom7_esm_parent,
        parents,
        closest,
        find,
        children,
        filter,
        remove
    };
    Object.keys(Methods).forEach((methodName => {
        Object.defineProperty(dom7_esm_$.fn, methodName, {
            value: Methods[methodName],
            writable: true
        });
    }));
    const dom = dom7_esm_$;
    function deleteProps(obj) {
        const object = obj;
        Object.keys(object).forEach((key => {
            try {
                object[key] = null;
            } catch (e) {}
            try {
                delete object[key];
            } catch (e) {}
        }));
    }
    function utils_nextTick(callback, delay) {
        if (void 0 === delay) delay = 0;
        return setTimeout(callback, delay);
    }
    function utils_now() {
        return Date.now();
    }
    function utils_getComputedStyle(el) {
        const window = ssr_window_esm_getWindow();
        let style;
        if (window.getComputedStyle) style = window.getComputedStyle(el, null);
        if (!style && el.currentStyle) style = el.currentStyle;
        if (!style) style = el.style;
        return style;
    }
    function utils_getTranslate(el, axis) {
        if (void 0 === axis) axis = "x";
        const window = ssr_window_esm_getWindow();
        let matrix;
        let curTransform;
        let transformMatrix;
        const curStyle = utils_getComputedStyle(el, null);
        if (window.WebKitCSSMatrix) {
            curTransform = curStyle.transform || curStyle.webkitTransform;
            if (curTransform.split(",").length > 6) curTransform = curTransform.split(", ").map((a => a.replace(",", "."))).join(", ");
            transformMatrix = new window.WebKitCSSMatrix("none" === curTransform ? "" : curTransform);
        } else {
            transformMatrix = curStyle.MozTransform || curStyle.OTransform || curStyle.MsTransform || curStyle.msTransform || curStyle.transform || curStyle.getPropertyValue("transform").replace("translate(", "matrix(1, 0, 0, 1,");
            matrix = transformMatrix.toString().split(",");
        }
        if ("x" === axis) if (window.WebKitCSSMatrix) curTransform = transformMatrix.m41; else if (16 === matrix.length) curTransform = parseFloat(matrix[12]); else curTransform = parseFloat(matrix[4]);
        if ("y" === axis) if (window.WebKitCSSMatrix) curTransform = transformMatrix.m42; else if (16 === matrix.length) curTransform = parseFloat(matrix[13]); else curTransform = parseFloat(matrix[5]);
        return curTransform || 0;
    }
    function utils_isObject(o) {
        return "object" === typeof o && null !== o && o.constructor && "Object" === Object.prototype.toString.call(o).slice(8, -1);
    }
    function isNode(node) {
        if ("undefined" !== typeof window && "undefined" !== typeof window.HTMLElement) return node instanceof HTMLElement;
        return node && (1 === node.nodeType || 11 === node.nodeType);
    }
    function utils_extend() {
        const to = Object(arguments.length <= 0 ? void 0 : arguments[0]);
        const noExtend = [ "__proto__", "constructor", "prototype" ];
        for (let i = 1; i < arguments.length; i += 1) {
            const nextSource = i < 0 || arguments.length <= i ? void 0 : arguments[i];
            if (void 0 !== nextSource && null !== nextSource && !isNode(nextSource)) {
                const keysArray = Object.keys(Object(nextSource)).filter((key => noExtend.indexOf(key) < 0));
                for (let nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex += 1) {
                    const nextKey = keysArray[nextIndex];
                    const desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
                    if (void 0 !== desc && desc.enumerable) if (utils_isObject(to[nextKey]) && utils_isObject(nextSource[nextKey])) if (nextSource[nextKey].__swiper__) to[nextKey] = nextSource[nextKey]; else utils_extend(to[nextKey], nextSource[nextKey]); else if (!utils_isObject(to[nextKey]) && utils_isObject(nextSource[nextKey])) {
                        to[nextKey] = {};
                        if (nextSource[nextKey].__swiper__) to[nextKey] = nextSource[nextKey]; else utils_extend(to[nextKey], nextSource[nextKey]);
                    } else to[nextKey] = nextSource[nextKey];
                }
            }
        }
        return to;
    }
    function utils_setCSSProperty(el, varName, varValue) {
        el.style.setProperty(varName, varValue);
    }
    function animateCSSModeScroll(_ref) {
        let {swiper, targetPosition, side} = _ref;
        const window = ssr_window_esm_getWindow();
        const startPosition = -swiper.translate;
        let startTime = null;
        let time;
        const duration = swiper.params.speed;
        swiper.wrapperEl.style.scrollSnapType = "none";
        window.cancelAnimationFrame(swiper.cssModeFrameID);
        const dir = targetPosition > startPosition ? "next" : "prev";
        const isOutOfBound = (current, target) => "next" === dir && current >= target || "prev" === dir && current <= target;
        const animate = () => {
            time = (new Date).getTime();
            if (null === startTime) startTime = time;
            const progress = Math.max(Math.min((time - startTime) / duration, 1), 0);
            const easeProgress = .5 - Math.cos(progress * Math.PI) / 2;
            let currentPosition = startPosition + easeProgress * (targetPosition - startPosition);
            if (isOutOfBound(currentPosition, targetPosition)) currentPosition = targetPosition;
            swiper.wrapperEl.scrollTo({
                [side]: currentPosition
            });
            if (isOutOfBound(currentPosition, targetPosition)) {
                swiper.wrapperEl.style.overflow = "hidden";
                swiper.wrapperEl.style.scrollSnapType = "";
                setTimeout((() => {
                    swiper.wrapperEl.style.overflow = "";
                    swiper.wrapperEl.scrollTo({
                        [side]: currentPosition
                    });
                }));
                window.cancelAnimationFrame(swiper.cssModeFrameID);
                return;
            }
            swiper.cssModeFrameID = window.requestAnimationFrame(animate);
        };
        animate();
    }
    let support;
    function calcSupport() {
        const window = ssr_window_esm_getWindow();
        const document = ssr_window_esm_getDocument();
        return {
            smoothScroll: document.documentElement && "scrollBehavior" in document.documentElement.style,
            touch: !!("ontouchstart" in window || window.DocumentTouch && document instanceof window.DocumentTouch),
            passiveListener: function checkPassiveListener() {
                let supportsPassive = false;
                try {
                    const opts = Object.defineProperty({}, "passive", {
                        get() {
                            supportsPassive = true;
                        }
                    });
                    window.addEventListener("testPassiveListener", null, opts);
                } catch (e) {}
                return supportsPassive;
            }(),
            gestures: function checkGestures() {
                return "ongesturestart" in window;
            }()
        };
    }
    function getSupport() {
        if (!support) support = calcSupport();
        return support;
    }
    let deviceCached;
    function calcDevice(_temp) {
        let {userAgent} = void 0 === _temp ? {} : _temp;
        const support = getSupport();
        const window = ssr_window_esm_getWindow();
        const platform = window.navigator.platform;
        const ua = userAgent || window.navigator.userAgent;
        const device = {
            ios: false,
            android: false
        };
        const screenWidth = window.screen.width;
        const screenHeight = window.screen.height;
        const android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
        let ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
        const ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
        const iphone = !ipad && ua.match(/(iPhone\sOS|iOS)\s([\d_]+)/);
        const windows = "Win32" === platform;
        let macos = "MacIntel" === platform;
        const iPadScreens = [ "1024x1366", "1366x1024", "834x1194", "1194x834", "834x1112", "1112x834", "768x1024", "1024x768", "820x1180", "1180x820", "810x1080", "1080x810" ];
        if (!ipad && macos && support.touch && iPadScreens.indexOf(`${screenWidth}x${screenHeight}`) >= 0) {
            ipad = ua.match(/(Version)\/([\d.]+)/);
            if (!ipad) ipad = [ 0, 1, "13_0_0" ];
            macos = false;
        }
        if (android && !windows) {
            device.os = "android";
            device.android = true;
        }
        if (ipad || iphone || ipod) {
            device.os = "ios";
            device.ios = true;
        }
        return device;
    }
    function getDevice(overrides) {
        if (void 0 === overrides) overrides = {};
        if (!deviceCached) deviceCached = calcDevice(overrides);
        return deviceCached;
    }
    let browser;
    function calcBrowser() {
        const window = ssr_window_esm_getWindow();
        function isSafari() {
            const ua = window.navigator.userAgent.toLowerCase();
            return ua.indexOf("safari") >= 0 && ua.indexOf("chrome") < 0 && ua.indexOf("android") < 0;
        }
        return {
            isSafari: isSafari(),
            isWebView: /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(window.navigator.userAgent)
        };
    }
    function getBrowser() {
        if (!browser) browser = calcBrowser();
        return browser;
    }
    function Resize(_ref) {
        let {swiper, on, emit} = _ref;
        const window = ssr_window_esm_getWindow();
        let observer = null;
        let animationFrame = null;
        const resizeHandler = () => {
            if (!swiper || swiper.destroyed || !swiper.initialized) return;
            emit("beforeResize");
            emit("resize");
        };
        const createObserver = () => {
            if (!swiper || swiper.destroyed || !swiper.initialized) return;
            observer = new ResizeObserver((entries => {
                animationFrame = window.requestAnimationFrame((() => {
                    const {width, height} = swiper;
                    let newWidth = width;
                    let newHeight = height;
                    entries.forEach((_ref2 => {
                        let {contentBoxSize, contentRect, target} = _ref2;
                        if (target && target !== swiper.el) return;
                        newWidth = contentRect ? contentRect.width : (contentBoxSize[0] || contentBoxSize).inlineSize;
                        newHeight = contentRect ? contentRect.height : (contentBoxSize[0] || contentBoxSize).blockSize;
                    }));
                    if (newWidth !== width || newHeight !== height) resizeHandler();
                }));
            }));
            observer.observe(swiper.el);
        };
        const removeObserver = () => {
            if (animationFrame) window.cancelAnimationFrame(animationFrame);
            if (observer && observer.unobserve && swiper.el) {
                observer.unobserve(swiper.el);
                observer = null;
            }
        };
        const orientationChangeHandler = () => {
            if (!swiper || swiper.destroyed || !swiper.initialized) return;
            emit("orientationchange");
        };
        on("init", (() => {
            if (swiper.params.resizeObserver && "undefined" !== typeof window.ResizeObserver) {
                createObserver();
                return;
            }
            window.addEventListener("resize", resizeHandler);
            window.addEventListener("orientationchange", orientationChangeHandler);
        }));
        on("destroy", (() => {
            removeObserver();
            window.removeEventListener("resize", resizeHandler);
            window.removeEventListener("orientationchange", orientationChangeHandler);
        }));
    }
    function Observer(_ref) {
        let {swiper, extendParams, on, emit} = _ref;
        const observers = [];
        const window = ssr_window_esm_getWindow();
        const attach = function(target, options) {
            if (void 0 === options) options = {};
            const ObserverFunc = window.MutationObserver || window.WebkitMutationObserver;
            const observer = new ObserverFunc((mutations => {
                if (1 === mutations.length) {
                    emit("observerUpdate", mutations[0]);
                    return;
                }
                const observerUpdate = function observerUpdate() {
                    emit("observerUpdate", mutations[0]);
                };
                if (window.requestAnimationFrame) window.requestAnimationFrame(observerUpdate); else window.setTimeout(observerUpdate, 0);
            }));
            observer.observe(target, {
                attributes: "undefined" === typeof options.attributes ? true : options.attributes,
                childList: "undefined" === typeof options.childList ? true : options.childList,
                characterData: "undefined" === typeof options.characterData ? true : options.characterData
            });
            observers.push(observer);
        };
        const init = () => {
            if (!swiper.params.observer) return;
            if (swiper.params.observeParents) {
                const containerParents = swiper.$el.parents();
                for (let i = 0; i < containerParents.length; i += 1) attach(containerParents[i]);
            }
            attach(swiper.$el[0], {
                childList: swiper.params.observeSlideChildren
            });
            attach(swiper.$wrapperEl[0], {
                attributes: false
            });
        };
        const destroy = () => {
            observers.forEach((observer => {
                observer.disconnect();
            }));
            observers.splice(0, observers.length);
        };
        extendParams({
            observer: false,
            observeParents: false,
            observeSlideChildren: false
        });
        on("init", init);
        on("destroy", destroy);
    }
    const events_emitter = {
        on(events, handler, priority) {
            const self = this;
            if (!self.eventsListeners || self.destroyed) return self;
            if ("function" !== typeof handler) return self;
            const method = priority ? "unshift" : "push";
            events.split(" ").forEach((event => {
                if (!self.eventsListeners[event]) self.eventsListeners[event] = [];
                self.eventsListeners[event][method](handler);
            }));
            return self;
        },
        once(events, handler, priority) {
            const self = this;
            if (!self.eventsListeners || self.destroyed) return self;
            if ("function" !== typeof handler) return self;
            function onceHandler() {
                self.off(events, onceHandler);
                if (onceHandler.__emitterProxy) delete onceHandler.__emitterProxy;
                for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
                handler.apply(self, args);
            }
            onceHandler.__emitterProxy = handler;
            return self.on(events, onceHandler, priority);
        },
        onAny(handler, priority) {
            const self = this;
            if (!self.eventsListeners || self.destroyed) return self;
            if ("function" !== typeof handler) return self;
            const method = priority ? "unshift" : "push";
            if (self.eventsAnyListeners.indexOf(handler) < 0) self.eventsAnyListeners[method](handler);
            return self;
        },
        offAny(handler) {
            const self = this;
            if (!self.eventsListeners || self.destroyed) return self;
            if (!self.eventsAnyListeners) return self;
            const index = self.eventsAnyListeners.indexOf(handler);
            if (index >= 0) self.eventsAnyListeners.splice(index, 1);
            return self;
        },
        off(events, handler) {
            const self = this;
            if (!self.eventsListeners || self.destroyed) return self;
            if (!self.eventsListeners) return self;
            events.split(" ").forEach((event => {
                if ("undefined" === typeof handler) self.eventsListeners[event] = []; else if (self.eventsListeners[event]) self.eventsListeners[event].forEach(((eventHandler, index) => {
                    if (eventHandler === handler || eventHandler.__emitterProxy && eventHandler.__emitterProxy === handler) self.eventsListeners[event].splice(index, 1);
                }));
            }));
            return self;
        },
        emit() {
            const self = this;
            if (!self.eventsListeners || self.destroyed) return self;
            if (!self.eventsListeners) return self;
            let events;
            let data;
            let context;
            for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) args[_key2] = arguments[_key2];
            if ("string" === typeof args[0] || Array.isArray(args[0])) {
                events = args[0];
                data = args.slice(1, args.length);
                context = self;
            } else {
                events = args[0].events;
                data = args[0].data;
                context = args[0].context || self;
            }
            data.unshift(context);
            const eventsArray = Array.isArray(events) ? events : events.split(" ");
            eventsArray.forEach((event => {
                if (self.eventsAnyListeners && self.eventsAnyListeners.length) self.eventsAnyListeners.forEach((eventHandler => {
                    eventHandler.apply(context, [ event, ...data ]);
                }));
                if (self.eventsListeners && self.eventsListeners[event]) self.eventsListeners[event].forEach((eventHandler => {
                    eventHandler.apply(context, data);
                }));
            }));
            return self;
        }
    };
    function updateSize() {
        const swiper = this;
        let width;
        let height;
        const $el = swiper.$el;
        if ("undefined" !== typeof swiper.params.width && null !== swiper.params.width) width = swiper.params.width; else width = $el[0].clientWidth;
        if ("undefined" !== typeof swiper.params.height && null !== swiper.params.height) height = swiper.params.height; else height = $el[0].clientHeight;
        if (0 === width && swiper.isHorizontal() || 0 === height && swiper.isVertical()) return;
        width = width - parseInt($el.css("padding-left") || 0, 10) - parseInt($el.css("padding-right") || 0, 10);
        height = height - parseInt($el.css("padding-top") || 0, 10) - parseInt($el.css("padding-bottom") || 0, 10);
        if (Number.isNaN(width)) width = 0;
        if (Number.isNaN(height)) height = 0;
        Object.assign(swiper, {
            width,
            height,
            size: swiper.isHorizontal() ? width : height
        });
    }
    function updateSlides() {
        const swiper = this;
        function getDirectionLabel(property) {
            if (swiper.isHorizontal()) return property;
            return {
                width: "height",
                "margin-top": "margin-left",
                "margin-bottom ": "margin-right",
                "margin-left": "margin-top",
                "margin-right": "margin-bottom",
                "padding-left": "padding-top",
                "padding-right": "padding-bottom",
                marginRight: "marginBottom"
            }[property];
        }
        function getDirectionPropertyValue(node, label) {
            return parseFloat(node.getPropertyValue(getDirectionLabel(label)) || 0);
        }
        const params = swiper.params;
        const {$wrapperEl, size: swiperSize, rtlTranslate: rtl, wrongRTL} = swiper;
        const isVirtual = swiper.virtual && params.virtual.enabled;
        const previousSlidesLength = isVirtual ? swiper.virtual.slides.length : swiper.slides.length;
        const slides = $wrapperEl.children(`.${swiper.params.slideClass}`);
        const slidesLength = isVirtual ? swiper.virtual.slides.length : slides.length;
        let snapGrid = [];
        const slidesGrid = [];
        const slidesSizesGrid = [];
        let offsetBefore = params.slidesOffsetBefore;
        if ("function" === typeof offsetBefore) offsetBefore = params.slidesOffsetBefore.call(swiper);
        let offsetAfter = params.slidesOffsetAfter;
        if ("function" === typeof offsetAfter) offsetAfter = params.slidesOffsetAfter.call(swiper);
        const previousSnapGridLength = swiper.snapGrid.length;
        const previousSlidesGridLength = swiper.slidesGrid.length;
        let spaceBetween = params.spaceBetween;
        let slidePosition = -offsetBefore;
        let prevSlideSize = 0;
        let index = 0;
        if ("undefined" === typeof swiperSize) return;
        if ("string" === typeof spaceBetween && spaceBetween.indexOf("%") >= 0) spaceBetween = parseFloat(spaceBetween.replace("%", "")) / 100 * swiperSize;
        swiper.virtualSize = -spaceBetween;
        if (rtl) slides.css({
            marginLeft: "",
            marginBottom: "",
            marginTop: ""
        }); else slides.css({
            marginRight: "",
            marginBottom: "",
            marginTop: ""
        });
        if (params.centeredSlides && params.cssMode) {
            utils_setCSSProperty(swiper.wrapperEl, "--swiper-centered-offset-before", "");
            utils_setCSSProperty(swiper.wrapperEl, "--swiper-centered-offset-after", "");
        }
        const gridEnabled = params.grid && params.grid.rows > 1 && swiper.grid;
        if (gridEnabled) swiper.grid.initSlides(slidesLength);
        let slideSize;
        const shouldResetSlideSize = "auto" === params.slidesPerView && params.breakpoints && Object.keys(params.breakpoints).filter((key => "undefined" !== typeof params.breakpoints[key].slidesPerView)).length > 0;
        for (let i = 0; i < slidesLength; i += 1) {
            slideSize = 0;
            const slide = slides.eq(i);
            if (gridEnabled) swiper.grid.updateSlide(i, slide, slidesLength, getDirectionLabel);
            if ("none" === slide.css("display")) continue;
            if ("auto" === params.slidesPerView) {
                if (shouldResetSlideSize) slides[i].style[getDirectionLabel("width")] = ``;
                const slideStyles = getComputedStyle(slide[0]);
                const currentTransform = slide[0].style.transform;
                const currentWebKitTransform = slide[0].style.webkitTransform;
                if (currentTransform) slide[0].style.transform = "none";
                if (currentWebKitTransform) slide[0].style.webkitTransform = "none";
                if (params.roundLengths) slideSize = swiper.isHorizontal() ? slide.outerWidth(true) : slide.outerHeight(true); else {
                    const width = getDirectionPropertyValue(slideStyles, "width");
                    const paddingLeft = getDirectionPropertyValue(slideStyles, "padding-left");
                    const paddingRight = getDirectionPropertyValue(slideStyles, "padding-right");
                    const marginLeft = getDirectionPropertyValue(slideStyles, "margin-left");
                    const marginRight = getDirectionPropertyValue(slideStyles, "margin-right");
                    const boxSizing = slideStyles.getPropertyValue("box-sizing");
                    if (boxSizing && "border-box" === boxSizing) slideSize = width + marginLeft + marginRight; else {
                        const {clientWidth, offsetWidth} = slide[0];
                        slideSize = width + paddingLeft + paddingRight + marginLeft + marginRight + (offsetWidth - clientWidth);
                    }
                }
                if (currentTransform) slide[0].style.transform = currentTransform;
                if (currentWebKitTransform) slide[0].style.webkitTransform = currentWebKitTransform;
                if (params.roundLengths) slideSize = Math.floor(slideSize);
            } else {
                slideSize = (swiperSize - (params.slidesPerView - 1) * spaceBetween) / params.slidesPerView;
                if (params.roundLengths) slideSize = Math.floor(slideSize);
                if (slides[i]) slides[i].style[getDirectionLabel("width")] = `${slideSize}px`;
            }
            if (slides[i]) slides[i].swiperSlideSize = slideSize;
            slidesSizesGrid.push(slideSize);
            if (params.centeredSlides) {
                slidePosition = slidePosition + slideSize / 2 + prevSlideSize / 2 + spaceBetween;
                if (0 === prevSlideSize && 0 !== i) slidePosition = slidePosition - swiperSize / 2 - spaceBetween;
                if (0 === i) slidePosition = slidePosition - swiperSize / 2 - spaceBetween;
                if (Math.abs(slidePosition) < 1 / 1e3) slidePosition = 0;
                if (params.roundLengths) slidePosition = Math.floor(slidePosition);
                if (index % params.slidesPerGroup === 0) snapGrid.push(slidePosition);
                slidesGrid.push(slidePosition);
            } else {
                if (params.roundLengths) slidePosition = Math.floor(slidePosition);
                if ((index - Math.min(swiper.params.slidesPerGroupSkip, index)) % swiper.params.slidesPerGroup === 0) snapGrid.push(slidePosition);
                slidesGrid.push(slidePosition);
                slidePosition = slidePosition + slideSize + spaceBetween;
            }
            swiper.virtualSize += slideSize + spaceBetween;
            prevSlideSize = slideSize;
            index += 1;
        }
        swiper.virtualSize = Math.max(swiper.virtualSize, swiperSize) + offsetAfter;
        if (rtl && wrongRTL && ("slide" === params.effect || "coverflow" === params.effect)) $wrapperEl.css({
            width: `${swiper.virtualSize + params.spaceBetween}px`
        });
        if (params.setWrapperSize) $wrapperEl.css({
            [getDirectionLabel("width")]: `${swiper.virtualSize + params.spaceBetween}px`
        });
        if (gridEnabled) swiper.grid.updateWrapperSize(slideSize, snapGrid, getDirectionLabel);
        if (!params.centeredSlides) {
            const newSlidesGrid = [];
            for (let i = 0; i < snapGrid.length; i += 1) {
                let slidesGridItem = snapGrid[i];
                if (params.roundLengths) slidesGridItem = Math.floor(slidesGridItem);
                if (snapGrid[i] <= swiper.virtualSize - swiperSize) newSlidesGrid.push(slidesGridItem);
            }
            snapGrid = newSlidesGrid;
            if (Math.floor(swiper.virtualSize - swiperSize) - Math.floor(snapGrid[snapGrid.length - 1]) > 1) snapGrid.push(swiper.virtualSize - swiperSize);
        }
        if (0 === snapGrid.length) snapGrid = [ 0 ];
        if (0 !== params.spaceBetween) {
            const key = swiper.isHorizontal() && rtl ? "marginLeft" : getDirectionLabel("marginRight");
            slides.filter(((_, slideIndex) => {
                if (!params.cssMode) return true;
                if (slideIndex === slides.length - 1) return false;
                return true;
            })).css({
                [key]: `${spaceBetween}px`
            });
        }
        if (params.centeredSlides && params.centeredSlidesBounds) {
            let allSlidesSize = 0;
            slidesSizesGrid.forEach((slideSizeValue => {
                allSlidesSize += slideSizeValue + (params.spaceBetween ? params.spaceBetween : 0);
            }));
            allSlidesSize -= params.spaceBetween;
            const maxSnap = allSlidesSize - swiperSize;
            snapGrid = snapGrid.map((snap => {
                if (snap < 0) return -offsetBefore;
                if (snap > maxSnap) return maxSnap + offsetAfter;
                return snap;
            }));
        }
        if (params.centerInsufficientSlides) {
            let allSlidesSize = 0;
            slidesSizesGrid.forEach((slideSizeValue => {
                allSlidesSize += slideSizeValue + (params.spaceBetween ? params.spaceBetween : 0);
            }));
            allSlidesSize -= params.spaceBetween;
            if (allSlidesSize < swiperSize) {
                const allSlidesOffset = (swiperSize - allSlidesSize) / 2;
                snapGrid.forEach(((snap, snapIndex) => {
                    snapGrid[snapIndex] = snap - allSlidesOffset;
                }));
                slidesGrid.forEach(((snap, snapIndex) => {
                    slidesGrid[snapIndex] = snap + allSlidesOffset;
                }));
            }
        }
        Object.assign(swiper, {
            slides,
            snapGrid,
            slidesGrid,
            slidesSizesGrid
        });
        if (params.centeredSlides && params.cssMode && !params.centeredSlidesBounds) {
            utils_setCSSProperty(swiper.wrapperEl, "--swiper-centered-offset-before", `${-snapGrid[0]}px`);
            utils_setCSSProperty(swiper.wrapperEl, "--swiper-centered-offset-after", `${swiper.size / 2 - slidesSizesGrid[slidesSizesGrid.length - 1] / 2}px`);
            const addToSnapGrid = -swiper.snapGrid[0];
            const addToSlidesGrid = -swiper.slidesGrid[0];
            swiper.snapGrid = swiper.snapGrid.map((v => v + addToSnapGrid));
            swiper.slidesGrid = swiper.slidesGrid.map((v => v + addToSlidesGrid));
        }
        if (slidesLength !== previousSlidesLength) swiper.emit("slidesLengthChange");
        if (snapGrid.length !== previousSnapGridLength) {
            if (swiper.params.watchOverflow) swiper.checkOverflow();
            swiper.emit("snapGridLengthChange");
        }
        if (slidesGrid.length !== previousSlidesGridLength) swiper.emit("slidesGridLengthChange");
        if (params.watchSlidesProgress) swiper.updateSlidesOffset();
        if (!isVirtual && !params.cssMode && ("slide" === params.effect || "fade" === params.effect)) {
            const backFaceHiddenClass = `${params.containerModifierClass}backface-hidden`;
            const hasClassBackfaceClassAdded = swiper.$el.hasClass(backFaceHiddenClass);
            if (slidesLength <= params.maxBackfaceHiddenSlides) {
                if (!hasClassBackfaceClassAdded) swiper.$el.addClass(backFaceHiddenClass);
            } else if (hasClassBackfaceClassAdded) swiper.$el.removeClass(backFaceHiddenClass);
        }
    }
    function updateAutoHeight(speed) {
        const swiper = this;
        const activeSlides = [];
        const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
        let newHeight = 0;
        let i;
        if ("number" === typeof speed) swiper.setTransition(speed); else if (true === speed) swiper.setTransition(swiper.params.speed);
        const getSlideByIndex = index => {
            if (isVirtual) return swiper.slides.filter((el => parseInt(el.getAttribute("data-swiper-slide-index"), 10) === index))[0];
            return swiper.slides.eq(index)[0];
        };
        if ("auto" !== swiper.params.slidesPerView && swiper.params.slidesPerView > 1) if (swiper.params.centeredSlides) (swiper.visibleSlides || dom([])).each((slide => {
            activeSlides.push(slide);
        })); else for (i = 0; i < Math.ceil(swiper.params.slidesPerView); i += 1) {
            const index = swiper.activeIndex + i;
            if (index > swiper.slides.length && !isVirtual) break;
            activeSlides.push(getSlideByIndex(index));
        } else activeSlides.push(getSlideByIndex(swiper.activeIndex));
        for (i = 0; i < activeSlides.length; i += 1) if ("undefined" !== typeof activeSlides[i]) {
            const height = activeSlides[i].offsetHeight;
            newHeight = height > newHeight ? height : newHeight;
        }
        if (newHeight || 0 === newHeight) swiper.$wrapperEl.css("height", `${newHeight}px`);
    }
    function updateSlidesOffset() {
        const swiper = this;
        const slides = swiper.slides;
        for (let i = 0; i < slides.length; i += 1) slides[i].swiperSlideOffset = swiper.isHorizontal() ? slides[i].offsetLeft : slides[i].offsetTop;
    }
    function updateSlidesProgress(translate) {
        if (void 0 === translate) translate = this && this.translate || 0;
        const swiper = this;
        const params = swiper.params;
        const {slides, rtlTranslate: rtl, snapGrid} = swiper;
        if (0 === slides.length) return;
        if ("undefined" === typeof slides[0].swiperSlideOffset) swiper.updateSlidesOffset();
        let offsetCenter = -translate;
        if (rtl) offsetCenter = translate;
        slides.removeClass(params.slideVisibleClass);
        swiper.visibleSlidesIndexes = [];
        swiper.visibleSlides = [];
        for (let i = 0; i < slides.length; i += 1) {
            const slide = slides[i];
            let slideOffset = slide.swiperSlideOffset;
            if (params.cssMode && params.centeredSlides) slideOffset -= slides[0].swiperSlideOffset;
            const slideProgress = (offsetCenter + (params.centeredSlides ? swiper.minTranslate() : 0) - slideOffset) / (slide.swiperSlideSize + params.spaceBetween);
            const originalSlideProgress = (offsetCenter - snapGrid[0] + (params.centeredSlides ? swiper.minTranslate() : 0) - slideOffset) / (slide.swiperSlideSize + params.spaceBetween);
            const slideBefore = -(offsetCenter - slideOffset);
            const slideAfter = slideBefore + swiper.slidesSizesGrid[i];
            const isVisible = slideBefore >= 0 && slideBefore < swiper.size - 1 || slideAfter > 1 && slideAfter <= swiper.size || slideBefore <= 0 && slideAfter >= swiper.size;
            if (isVisible) {
                swiper.visibleSlides.push(slide);
                swiper.visibleSlidesIndexes.push(i);
                slides.eq(i).addClass(params.slideVisibleClass);
            }
            slide.progress = rtl ? -slideProgress : slideProgress;
            slide.originalProgress = rtl ? -originalSlideProgress : originalSlideProgress;
        }
        swiper.visibleSlides = dom(swiper.visibleSlides);
    }
    function updateProgress(translate) {
        const swiper = this;
        if ("undefined" === typeof translate) {
            const multiplier = swiper.rtlTranslate ? -1 : 1;
            translate = swiper && swiper.translate && swiper.translate * multiplier || 0;
        }
        const params = swiper.params;
        const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
        let {progress, isBeginning, isEnd} = swiper;
        const wasBeginning = isBeginning;
        const wasEnd = isEnd;
        if (0 === translatesDiff) {
            progress = 0;
            isBeginning = true;
            isEnd = true;
        } else {
            progress = (translate - swiper.minTranslate()) / translatesDiff;
            isBeginning = progress <= 0;
            isEnd = progress >= 1;
        }
        Object.assign(swiper, {
            progress,
            isBeginning,
            isEnd
        });
        if (params.watchSlidesProgress || params.centeredSlides && params.autoHeight) swiper.updateSlidesProgress(translate);
        if (isBeginning && !wasBeginning) swiper.emit("reachBeginning toEdge");
        if (isEnd && !wasEnd) swiper.emit("reachEnd toEdge");
        if (wasBeginning && !isBeginning || wasEnd && !isEnd) swiper.emit("fromEdge");
        swiper.emit("progress", progress);
    }
    function updateSlidesClasses() {
        const swiper = this;
        const {slides, params, $wrapperEl, activeIndex, realIndex} = swiper;
        const isVirtual = swiper.virtual && params.virtual.enabled;
        slides.removeClass(`${params.slideActiveClass} ${params.slideNextClass} ${params.slidePrevClass} ${params.slideDuplicateActiveClass} ${params.slideDuplicateNextClass} ${params.slideDuplicatePrevClass}`);
        let activeSlide;
        if (isVirtual) activeSlide = swiper.$wrapperEl.find(`.${params.slideClass}[data-swiper-slide-index="${activeIndex}"]`); else activeSlide = slides.eq(activeIndex);
        activeSlide.addClass(params.slideActiveClass);
        if (params.loop) if (activeSlide.hasClass(params.slideDuplicateClass)) $wrapperEl.children(`.${params.slideClass}:not(.${params.slideDuplicateClass})[data-swiper-slide-index="${realIndex}"]`).addClass(params.slideDuplicateActiveClass); else $wrapperEl.children(`.${params.slideClass}.${params.slideDuplicateClass}[data-swiper-slide-index="${realIndex}"]`).addClass(params.slideDuplicateActiveClass);
        let nextSlide = activeSlide.nextAll(`.${params.slideClass}`).eq(0).addClass(params.slideNextClass);
        if (params.loop && 0 === nextSlide.length) {
            nextSlide = slides.eq(0);
            nextSlide.addClass(params.slideNextClass);
        }
        let prevSlide = activeSlide.prevAll(`.${params.slideClass}`).eq(0).addClass(params.slidePrevClass);
        if (params.loop && 0 === prevSlide.length) {
            prevSlide = slides.eq(-1);
            prevSlide.addClass(params.slidePrevClass);
        }
        if (params.loop) {
            if (nextSlide.hasClass(params.slideDuplicateClass)) $wrapperEl.children(`.${params.slideClass}:not(.${params.slideDuplicateClass})[data-swiper-slide-index="${nextSlide.attr("data-swiper-slide-index")}"]`).addClass(params.slideDuplicateNextClass); else $wrapperEl.children(`.${params.slideClass}.${params.slideDuplicateClass}[data-swiper-slide-index="${nextSlide.attr("data-swiper-slide-index")}"]`).addClass(params.slideDuplicateNextClass);
            if (prevSlide.hasClass(params.slideDuplicateClass)) $wrapperEl.children(`.${params.slideClass}:not(.${params.slideDuplicateClass})[data-swiper-slide-index="${prevSlide.attr("data-swiper-slide-index")}"]`).addClass(params.slideDuplicatePrevClass); else $wrapperEl.children(`.${params.slideClass}.${params.slideDuplicateClass}[data-swiper-slide-index="${prevSlide.attr("data-swiper-slide-index")}"]`).addClass(params.slideDuplicatePrevClass);
        }
        swiper.emitSlidesClasses();
    }
    function updateActiveIndex(newActiveIndex) {
        const swiper = this;
        const translate = swiper.rtlTranslate ? swiper.translate : -swiper.translate;
        const {slidesGrid, snapGrid, params, activeIndex: previousIndex, realIndex: previousRealIndex, snapIndex: previousSnapIndex} = swiper;
        let activeIndex = newActiveIndex;
        let snapIndex;
        if ("undefined" === typeof activeIndex) {
            for (let i = 0; i < slidesGrid.length; i += 1) if ("undefined" !== typeof slidesGrid[i + 1]) {
                if (translate >= slidesGrid[i] && translate < slidesGrid[i + 1] - (slidesGrid[i + 1] - slidesGrid[i]) / 2) activeIndex = i; else if (translate >= slidesGrid[i] && translate < slidesGrid[i + 1]) activeIndex = i + 1;
            } else if (translate >= slidesGrid[i]) activeIndex = i;
            if (params.normalizeSlideIndex) if (activeIndex < 0 || "undefined" === typeof activeIndex) activeIndex = 0;
        }
        if (snapGrid.indexOf(translate) >= 0) snapIndex = snapGrid.indexOf(translate); else {
            const skip = Math.min(params.slidesPerGroupSkip, activeIndex);
            snapIndex = skip + Math.floor((activeIndex - skip) / params.slidesPerGroup);
        }
        if (snapIndex >= snapGrid.length) snapIndex = snapGrid.length - 1;
        if (activeIndex === previousIndex) {
            if (snapIndex !== previousSnapIndex) {
                swiper.snapIndex = snapIndex;
                swiper.emit("snapIndexChange");
            }
            return;
        }
        const realIndex = parseInt(swiper.slides.eq(activeIndex).attr("data-swiper-slide-index") || activeIndex, 10);
        Object.assign(swiper, {
            snapIndex,
            realIndex,
            previousIndex,
            activeIndex
        });
        swiper.emit("activeIndexChange");
        swiper.emit("snapIndexChange");
        if (previousRealIndex !== realIndex) swiper.emit("realIndexChange");
        if (swiper.initialized || swiper.params.runCallbacksOnInit) swiper.emit("slideChange");
    }
    function updateClickedSlide(e) {
        const swiper = this;
        const params = swiper.params;
        const slide = dom(e).closest(`.${params.slideClass}`)[0];
        let slideFound = false;
        let slideIndex;
        if (slide) for (let i = 0; i < swiper.slides.length; i += 1) if (swiper.slides[i] === slide) {
            slideFound = true;
            slideIndex = i;
            break;
        }
        if (slide && slideFound) {
            swiper.clickedSlide = slide;
            if (swiper.virtual && swiper.params.virtual.enabled) swiper.clickedIndex = parseInt(dom(slide).attr("data-swiper-slide-index"), 10); else swiper.clickedIndex = slideIndex;
        } else {
            swiper.clickedSlide = void 0;
            swiper.clickedIndex = void 0;
            return;
        }
        if (params.slideToClickedSlide && void 0 !== swiper.clickedIndex && swiper.clickedIndex !== swiper.activeIndex) swiper.slideToClickedSlide();
    }
    const update = {
        updateSize,
        updateSlides,
        updateAutoHeight,
        updateSlidesOffset,
        updateSlidesProgress,
        updateProgress,
        updateSlidesClasses,
        updateActiveIndex,
        updateClickedSlide
    };
    function getSwiperTranslate(axis) {
        if (void 0 === axis) axis = this.isHorizontal() ? "x" : "y";
        const swiper = this;
        const {params, rtlTranslate: rtl, translate, $wrapperEl} = swiper;
        if (params.virtualTranslate) return rtl ? -translate : translate;
        if (params.cssMode) return translate;
        let currentTranslate = utils_getTranslate($wrapperEl[0], axis);
        if (rtl) currentTranslate = -currentTranslate;
        return currentTranslate || 0;
    }
    function setTranslate(translate, byController) {
        const swiper = this;
        const {rtlTranslate: rtl, params, $wrapperEl, wrapperEl, progress} = swiper;
        let x = 0;
        let y = 0;
        const z = 0;
        if (swiper.isHorizontal()) x = rtl ? -translate : translate; else y = translate;
        if (params.roundLengths) {
            x = Math.floor(x);
            y = Math.floor(y);
        }
        if (params.cssMode) wrapperEl[swiper.isHorizontal() ? "scrollLeft" : "scrollTop"] = swiper.isHorizontal() ? -x : -y; else if (!params.virtualTranslate) $wrapperEl.transform(`translate3d(${x}px, ${y}px, ${z}px)`);
        swiper.previousTranslate = swiper.translate;
        swiper.translate = swiper.isHorizontal() ? x : y;
        let newProgress;
        const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
        if (0 === translatesDiff) newProgress = 0; else newProgress = (translate - swiper.minTranslate()) / translatesDiff;
        if (newProgress !== progress) swiper.updateProgress(translate);
        swiper.emit("setTranslate", swiper.translate, byController);
    }
    function minTranslate() {
        return -this.snapGrid[0];
    }
    function maxTranslate() {
        return -this.snapGrid[this.snapGrid.length - 1];
    }
    function translateTo(translate, speed, runCallbacks, translateBounds, internal) {
        if (void 0 === translate) translate = 0;
        if (void 0 === speed) speed = this.params.speed;
        if (void 0 === runCallbacks) runCallbacks = true;
        if (void 0 === translateBounds) translateBounds = true;
        const swiper = this;
        const {params, wrapperEl} = swiper;
        if (swiper.animating && params.preventInteractionOnTransition) return false;
        const minTranslate = swiper.minTranslate();
        const maxTranslate = swiper.maxTranslate();
        let newTranslate;
        if (translateBounds && translate > minTranslate) newTranslate = minTranslate; else if (translateBounds && translate < maxTranslate) newTranslate = maxTranslate; else newTranslate = translate;
        swiper.updateProgress(newTranslate);
        if (params.cssMode) {
            const isH = swiper.isHorizontal();
            if (0 === speed) wrapperEl[isH ? "scrollLeft" : "scrollTop"] = -newTranslate; else {
                if (!swiper.support.smoothScroll) {
                    animateCSSModeScroll({
                        swiper,
                        targetPosition: -newTranslate,
                        side: isH ? "left" : "top"
                    });
                    return true;
                }
                wrapperEl.scrollTo({
                    [isH ? "left" : "top"]: -newTranslate,
                    behavior: "smooth"
                });
            }
            return true;
        }
        if (0 === speed) {
            swiper.setTransition(0);
            swiper.setTranslate(newTranslate);
            if (runCallbacks) {
                swiper.emit("beforeTransitionStart", speed, internal);
                swiper.emit("transitionEnd");
            }
        } else {
            swiper.setTransition(speed);
            swiper.setTranslate(newTranslate);
            if (runCallbacks) {
                swiper.emit("beforeTransitionStart", speed, internal);
                swiper.emit("transitionStart");
            }
            if (!swiper.animating) {
                swiper.animating = true;
                if (!swiper.onTranslateToWrapperTransitionEnd) swiper.onTranslateToWrapperTransitionEnd = function transitionEnd(e) {
                    if (!swiper || swiper.destroyed) return;
                    if (e.target !== this) return;
                    swiper.$wrapperEl[0].removeEventListener("transitionend", swiper.onTranslateToWrapperTransitionEnd);
                    swiper.$wrapperEl[0].removeEventListener("webkitTransitionEnd", swiper.onTranslateToWrapperTransitionEnd);
                    swiper.onTranslateToWrapperTransitionEnd = null;
                    delete swiper.onTranslateToWrapperTransitionEnd;
                    if (runCallbacks) swiper.emit("transitionEnd");
                };
                swiper.$wrapperEl[0].addEventListener("transitionend", swiper.onTranslateToWrapperTransitionEnd);
                swiper.$wrapperEl[0].addEventListener("webkitTransitionEnd", swiper.onTranslateToWrapperTransitionEnd);
            }
        }
        return true;
    }
    const translate = {
        getTranslate: getSwiperTranslate,
        setTranslate,
        minTranslate,
        maxTranslate,
        translateTo
    };
    function setTransition(duration, byController) {
        const swiper = this;
        if (!swiper.params.cssMode) swiper.$wrapperEl.transition(duration);
        swiper.emit("setTransition", duration, byController);
    }
    function transitionEmit(_ref) {
        let {swiper, runCallbacks, direction, step} = _ref;
        const {activeIndex, previousIndex} = swiper;
        let dir = direction;
        if (!dir) if (activeIndex > previousIndex) dir = "next"; else if (activeIndex < previousIndex) dir = "prev"; else dir = "reset";
        swiper.emit(`transition${step}`);
        if (runCallbacks && activeIndex !== previousIndex) {
            if ("reset" === dir) {
                swiper.emit(`slideResetTransition${step}`);
                return;
            }
            swiper.emit(`slideChangeTransition${step}`);
            if ("next" === dir) swiper.emit(`slideNextTransition${step}`); else swiper.emit(`slidePrevTransition${step}`);
        }
    }
    function transitionStart(runCallbacks, direction) {
        if (void 0 === runCallbacks) runCallbacks = true;
        const swiper = this;
        const {params} = swiper;
        if (params.cssMode) return;
        if (params.autoHeight) swiper.updateAutoHeight();
        transitionEmit({
            swiper,
            runCallbacks,
            direction,
            step: "Start"
        });
    }
    function transitionEnd_transitionEnd(runCallbacks, direction) {
        if (void 0 === runCallbacks) runCallbacks = true;
        const swiper = this;
        const {params} = swiper;
        swiper.animating = false;
        if (params.cssMode) return;
        swiper.setTransition(0);
        transitionEmit({
            swiper,
            runCallbacks,
            direction,
            step: "End"
        });
    }
    const core_transition = {
        setTransition,
        transitionStart,
        transitionEnd: transitionEnd_transitionEnd
    };
    function slideTo(index, speed, runCallbacks, internal, initial) {
        if (void 0 === index) index = 0;
        if (void 0 === speed) speed = this.params.speed;
        if (void 0 === runCallbacks) runCallbacks = true;
        if ("number" !== typeof index && "string" !== typeof index) throw new Error(`The 'index' argument cannot have type other than 'number' or 'string'. [${typeof index}] given.`);
        if ("string" === typeof index) {
            const indexAsNumber = parseInt(index, 10);
            const isValidNumber = isFinite(indexAsNumber);
            if (!isValidNumber) throw new Error(`The passed-in 'index' (string) couldn't be converted to 'number'. [${index}] given.`);
            index = indexAsNumber;
        }
        const swiper = this;
        let slideIndex = index;
        if (slideIndex < 0) slideIndex = 0;
        const {params, snapGrid, slidesGrid, previousIndex, activeIndex, rtlTranslate: rtl, wrapperEl, enabled} = swiper;
        if (swiper.animating && params.preventInteractionOnTransition || !enabled && !internal && !initial) return false;
        const skip = Math.min(swiper.params.slidesPerGroupSkip, slideIndex);
        let snapIndex = skip + Math.floor((slideIndex - skip) / swiper.params.slidesPerGroup);
        if (snapIndex >= snapGrid.length) snapIndex = snapGrid.length - 1;
        if ((activeIndex || params.initialSlide || 0) === (previousIndex || 0) && runCallbacks) swiper.emit("beforeSlideChangeStart");
        const translate = -snapGrid[snapIndex];
        swiper.updateProgress(translate);
        if (params.normalizeSlideIndex) for (let i = 0; i < slidesGrid.length; i += 1) {
            const normalizedTranslate = -Math.floor(100 * translate);
            const normalizedGrid = Math.floor(100 * slidesGrid[i]);
            const normalizedGridNext = Math.floor(100 * slidesGrid[i + 1]);
            if ("undefined" !== typeof slidesGrid[i + 1]) {
                if (normalizedTranslate >= normalizedGrid && normalizedTranslate < normalizedGridNext - (normalizedGridNext - normalizedGrid) / 2) slideIndex = i; else if (normalizedTranslate >= normalizedGrid && normalizedTranslate < normalizedGridNext) slideIndex = i + 1;
            } else if (normalizedTranslate >= normalizedGrid) slideIndex = i;
        }
        if (swiper.initialized && slideIndex !== activeIndex) {
            if (!swiper.allowSlideNext && translate < swiper.translate && translate < swiper.minTranslate()) return false;
            if (!swiper.allowSlidePrev && translate > swiper.translate && translate > swiper.maxTranslate()) if ((activeIndex || 0) !== slideIndex) return false;
        }
        let direction;
        if (slideIndex > activeIndex) direction = "next"; else if (slideIndex < activeIndex) direction = "prev"; else direction = "reset";
        if (rtl && -translate === swiper.translate || !rtl && translate === swiper.translate) {
            swiper.updateActiveIndex(slideIndex);
            if (params.autoHeight) swiper.updateAutoHeight();
            swiper.updateSlidesClasses();
            if ("slide" !== params.effect) swiper.setTranslate(translate);
            if ("reset" !== direction) {
                swiper.transitionStart(runCallbacks, direction);
                swiper.transitionEnd(runCallbacks, direction);
            }
            return false;
        }
        if (params.cssMode) {
            const isH = swiper.isHorizontal();
            const t = rtl ? translate : -translate;
            if (0 === speed) {
                const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
                if (isVirtual) {
                    swiper.wrapperEl.style.scrollSnapType = "none";
                    swiper._immediateVirtual = true;
                }
                wrapperEl[isH ? "scrollLeft" : "scrollTop"] = t;
                if (isVirtual) requestAnimationFrame((() => {
                    swiper.wrapperEl.style.scrollSnapType = "";
                    swiper._swiperImmediateVirtual = false;
                }));
            } else {
                if (!swiper.support.smoothScroll) {
                    animateCSSModeScroll({
                        swiper,
                        targetPosition: t,
                        side: isH ? "left" : "top"
                    });
                    return true;
                }
                wrapperEl.scrollTo({
                    [isH ? "left" : "top"]: t,
                    behavior: "smooth"
                });
            }
            return true;
        }
        swiper.setTransition(speed);
        swiper.setTranslate(translate);
        swiper.updateActiveIndex(slideIndex);
        swiper.updateSlidesClasses();
        swiper.emit("beforeTransitionStart", speed, internal);
        swiper.transitionStart(runCallbacks, direction);
        if (0 === speed) swiper.transitionEnd(runCallbacks, direction); else if (!swiper.animating) {
            swiper.animating = true;
            if (!swiper.onSlideToWrapperTransitionEnd) swiper.onSlideToWrapperTransitionEnd = function transitionEnd(e) {
                if (!swiper || swiper.destroyed) return;
                if (e.target !== this) return;
                swiper.$wrapperEl[0].removeEventListener("transitionend", swiper.onSlideToWrapperTransitionEnd);
                swiper.$wrapperEl[0].removeEventListener("webkitTransitionEnd", swiper.onSlideToWrapperTransitionEnd);
                swiper.onSlideToWrapperTransitionEnd = null;
                delete swiper.onSlideToWrapperTransitionEnd;
                swiper.transitionEnd(runCallbacks, direction);
            };
            swiper.$wrapperEl[0].addEventListener("transitionend", swiper.onSlideToWrapperTransitionEnd);
            swiper.$wrapperEl[0].addEventListener("webkitTransitionEnd", swiper.onSlideToWrapperTransitionEnd);
        }
        return true;
    }
    function slideToLoop(index, speed, runCallbacks, internal) {
        if (void 0 === index) index = 0;
        if (void 0 === speed) speed = this.params.speed;
        if (void 0 === runCallbacks) runCallbacks = true;
        if ("string" === typeof index) {
            const indexAsNumber = parseInt(index, 10);
            const isValidNumber = isFinite(indexAsNumber);
            if (!isValidNumber) throw new Error(`The passed-in 'index' (string) couldn't be converted to 'number'. [${index}] given.`);
            index = indexAsNumber;
        }
        const swiper = this;
        let newIndex = index;
        if (swiper.params.loop) newIndex += swiper.loopedSlides;
        return swiper.slideTo(newIndex, speed, runCallbacks, internal);
    }
    function slideNext(speed, runCallbacks, internal) {
        if (void 0 === speed) speed = this.params.speed;
        if (void 0 === runCallbacks) runCallbacks = true;
        const swiper = this;
        const {animating, enabled, params} = swiper;
        if (!enabled) return swiper;
        let perGroup = params.slidesPerGroup;
        if ("auto" === params.slidesPerView && 1 === params.slidesPerGroup && params.slidesPerGroupAuto) perGroup = Math.max(swiper.slidesPerViewDynamic("current", true), 1);
        const increment = swiper.activeIndex < params.slidesPerGroupSkip ? 1 : perGroup;
        if (params.loop) {
            if (animating && params.loopPreventsSlide) return false;
            swiper.loopFix();
            swiper._clientLeft = swiper.$wrapperEl[0].clientLeft;
        }
        if (params.rewind && swiper.isEnd) return swiper.slideTo(0, speed, runCallbacks, internal);
        return swiper.slideTo(swiper.activeIndex + increment, speed, runCallbacks, internal);
    }
    function slidePrev(speed, runCallbacks, internal) {
        if (void 0 === speed) speed = this.params.speed;
        if (void 0 === runCallbacks) runCallbacks = true;
        const swiper = this;
        const {params, animating, snapGrid, slidesGrid, rtlTranslate, enabled} = swiper;
        if (!enabled) return swiper;
        if (params.loop) {
            if (animating && params.loopPreventsSlide) return false;
            swiper.loopFix();
            swiper._clientLeft = swiper.$wrapperEl[0].clientLeft;
        }
        const translate = rtlTranslate ? swiper.translate : -swiper.translate;
        function normalize(val) {
            if (val < 0) return -Math.floor(Math.abs(val));
            return Math.floor(val);
        }
        const normalizedTranslate = normalize(translate);
        const normalizedSnapGrid = snapGrid.map((val => normalize(val)));
        let prevSnap = snapGrid[normalizedSnapGrid.indexOf(normalizedTranslate) - 1];
        if ("undefined" === typeof prevSnap && params.cssMode) {
            let prevSnapIndex;
            snapGrid.forEach(((snap, snapIndex) => {
                if (normalizedTranslate >= snap) prevSnapIndex = snapIndex;
            }));
            if ("undefined" !== typeof prevSnapIndex) prevSnap = snapGrid[prevSnapIndex > 0 ? prevSnapIndex - 1 : prevSnapIndex];
        }
        let prevIndex = 0;
        if ("undefined" !== typeof prevSnap) {
            prevIndex = slidesGrid.indexOf(prevSnap);
            if (prevIndex < 0) prevIndex = swiper.activeIndex - 1;
            if ("auto" === params.slidesPerView && 1 === params.slidesPerGroup && params.slidesPerGroupAuto) {
                prevIndex = prevIndex - swiper.slidesPerViewDynamic("previous", true) + 1;
                prevIndex = Math.max(prevIndex, 0);
            }
        }
        if (params.rewind && swiper.isBeginning) {
            const lastIndex = swiper.params.virtual && swiper.params.virtual.enabled && swiper.virtual ? swiper.virtual.slides.length - 1 : swiper.slides.length - 1;
            return swiper.slideTo(lastIndex, speed, runCallbacks, internal);
        }
        return swiper.slideTo(prevIndex, speed, runCallbacks, internal);
    }
    function slideReset(speed, runCallbacks, internal) {
        if (void 0 === speed) speed = this.params.speed;
        if (void 0 === runCallbacks) runCallbacks = true;
        const swiper = this;
        return swiper.slideTo(swiper.activeIndex, speed, runCallbacks, internal);
    }
    function slideToClosest(speed, runCallbacks, internal, threshold) {
        if (void 0 === speed) speed = this.params.speed;
        if (void 0 === runCallbacks) runCallbacks = true;
        if (void 0 === threshold) threshold = .5;
        const swiper = this;
        let index = swiper.activeIndex;
        const skip = Math.min(swiper.params.slidesPerGroupSkip, index);
        const snapIndex = skip + Math.floor((index - skip) / swiper.params.slidesPerGroup);
        const translate = swiper.rtlTranslate ? swiper.translate : -swiper.translate;
        if (translate >= swiper.snapGrid[snapIndex]) {
            const currentSnap = swiper.snapGrid[snapIndex];
            const nextSnap = swiper.snapGrid[snapIndex + 1];
            if (translate - currentSnap > (nextSnap - currentSnap) * threshold) index += swiper.params.slidesPerGroup;
        } else {
            const prevSnap = swiper.snapGrid[snapIndex - 1];
            const currentSnap = swiper.snapGrid[snapIndex];
            if (translate - prevSnap <= (currentSnap - prevSnap) * threshold) index -= swiper.params.slidesPerGroup;
        }
        index = Math.max(index, 0);
        index = Math.min(index, swiper.slidesGrid.length - 1);
        return swiper.slideTo(index, speed, runCallbacks, internal);
    }
    function slideToClickedSlide() {
        const swiper = this;
        const {params, $wrapperEl} = swiper;
        const slidesPerView = "auto" === params.slidesPerView ? swiper.slidesPerViewDynamic() : params.slidesPerView;
        let slideToIndex = swiper.clickedIndex;
        let realIndex;
        if (params.loop) {
            if (swiper.animating) return;
            realIndex = parseInt(dom(swiper.clickedSlide).attr("data-swiper-slide-index"), 10);
            if (params.centeredSlides) if (slideToIndex < swiper.loopedSlides - slidesPerView / 2 || slideToIndex > swiper.slides.length - swiper.loopedSlides + slidesPerView / 2) {
                swiper.loopFix();
                slideToIndex = $wrapperEl.children(`.${params.slideClass}[data-swiper-slide-index="${realIndex}"]:not(.${params.slideDuplicateClass})`).eq(0).index();
                utils_nextTick((() => {
                    swiper.slideTo(slideToIndex);
                }));
            } else swiper.slideTo(slideToIndex); else if (slideToIndex > swiper.slides.length - slidesPerView) {
                swiper.loopFix();
                slideToIndex = $wrapperEl.children(`.${params.slideClass}[data-swiper-slide-index="${realIndex}"]:not(.${params.slideDuplicateClass})`).eq(0).index();
                utils_nextTick((() => {
                    swiper.slideTo(slideToIndex);
                }));
            } else swiper.slideTo(slideToIndex);
        } else swiper.slideTo(slideToIndex);
    }
    const slide = {
        slideTo,
        slideToLoop,
        slideNext,
        slidePrev,
        slideReset,
        slideToClosest,
        slideToClickedSlide
    };
    function loopCreate() {
        const swiper = this;
        const document = ssr_window_esm_getDocument();
        const {params, $wrapperEl} = swiper;
        const $selector = $wrapperEl.children().length > 0 ? dom($wrapperEl.children()[0].parentNode) : $wrapperEl;
        $selector.children(`.${params.slideClass}.${params.slideDuplicateClass}`).remove();
        let slides = $selector.children(`.${params.slideClass}`);
        if (params.loopFillGroupWithBlank) {
            const blankSlidesNum = params.slidesPerGroup - slides.length % params.slidesPerGroup;
            if (blankSlidesNum !== params.slidesPerGroup) {
                for (let i = 0; i < blankSlidesNum; i += 1) {
                    const blankNode = dom(document.createElement("div")).addClass(`${params.slideClass} ${params.slideBlankClass}`);
                    $selector.append(blankNode);
                }
                slides = $selector.children(`.${params.slideClass}`);
            }
        }
        if ("auto" === params.slidesPerView && !params.loopedSlides) params.loopedSlides = slides.length;
        swiper.loopedSlides = Math.ceil(parseFloat(params.loopedSlides || params.slidesPerView, 10));
        swiper.loopedSlides += params.loopAdditionalSlides;
        if (swiper.loopedSlides > slides.length) swiper.loopedSlides = slides.length;
        const prependSlides = [];
        const appendSlides = [];
        slides.each(((el, index) => {
            const slide = dom(el);
            if (index < swiper.loopedSlides) appendSlides.push(el);
            if (index < slides.length && index >= slides.length - swiper.loopedSlides) prependSlides.push(el);
            slide.attr("data-swiper-slide-index", index);
        }));
        for (let i = 0; i < appendSlides.length; i += 1) $selector.append(dom(appendSlides[i].cloneNode(true)).addClass(params.slideDuplicateClass));
        for (let i = prependSlides.length - 1; i >= 0; i -= 1) $selector.prepend(dom(prependSlides[i].cloneNode(true)).addClass(params.slideDuplicateClass));
    }
    function loopFix() {
        const swiper = this;
        swiper.emit("beforeLoopFix");
        const {activeIndex, slides, loopedSlides, allowSlidePrev, allowSlideNext, snapGrid, rtlTranslate: rtl} = swiper;
        let newIndex;
        swiper.allowSlidePrev = true;
        swiper.allowSlideNext = true;
        const snapTranslate = -snapGrid[activeIndex];
        const diff = snapTranslate - swiper.getTranslate();
        if (activeIndex < loopedSlides) {
            newIndex = slides.length - 3 * loopedSlides + activeIndex;
            newIndex += loopedSlides;
            const slideChanged = swiper.slideTo(newIndex, 0, false, true);
            if (slideChanged && 0 !== diff) swiper.setTranslate((rtl ? -swiper.translate : swiper.translate) - diff);
        } else if (activeIndex >= slides.length - loopedSlides) {
            newIndex = -slides.length + activeIndex + loopedSlides;
            newIndex += loopedSlides;
            const slideChanged = swiper.slideTo(newIndex, 0, false, true);
            if (slideChanged && 0 !== diff) swiper.setTranslate((rtl ? -swiper.translate : swiper.translate) - diff);
        }
        swiper.allowSlidePrev = allowSlidePrev;
        swiper.allowSlideNext = allowSlideNext;
        swiper.emit("loopFix");
    }
    function loopDestroy() {
        const swiper = this;
        const {$wrapperEl, params, slides} = swiper;
        $wrapperEl.children(`.${params.slideClass}.${params.slideDuplicateClass},.${params.slideClass}.${params.slideBlankClass}`).remove();
        slides.removeAttr("data-swiper-slide-index");
    }
    const loop = {
        loopCreate,
        loopFix,
        loopDestroy
    };
    function setGrabCursor(moving) {
        const swiper = this;
        if (swiper.support.touch || !swiper.params.simulateTouch || swiper.params.watchOverflow && swiper.isLocked || swiper.params.cssMode) return;
        const el = "container" === swiper.params.touchEventsTarget ? swiper.el : swiper.wrapperEl;
        el.style.cursor = "move";
        el.style.cursor = moving ? "grabbing" : "grab";
    }
    function unsetGrabCursor() {
        const swiper = this;
        if (swiper.support.touch || swiper.params.watchOverflow && swiper.isLocked || swiper.params.cssMode) return;
        swiper["container" === swiper.params.touchEventsTarget ? "el" : "wrapperEl"].style.cursor = "";
    }
    const grab_cursor = {
        setGrabCursor,
        unsetGrabCursor
    };
    function closestElement(selector, base) {
        if (void 0 === base) base = this;
        function __closestFrom(el) {
            if (!el || el === ssr_window_esm_getDocument() || el === ssr_window_esm_getWindow()) return null;
            if (el.assignedSlot) el = el.assignedSlot;
            const found = el.closest(selector);
            if (!found && !el.getRootNode) return null;
            return found || __closestFrom(el.getRootNode().host);
        }
        return __closestFrom(base);
    }
    function onTouchStart(event) {
        const swiper = this;
        const document = ssr_window_esm_getDocument();
        const window = ssr_window_esm_getWindow();
        const data = swiper.touchEventsData;
        const {params, touches, enabled} = swiper;
        if (!enabled) return;
        if (swiper.animating && params.preventInteractionOnTransition) return;
        if (!swiper.animating && params.cssMode && params.loop) swiper.loopFix();
        let e = event;
        if (e.originalEvent) e = e.originalEvent;
        let $targetEl = dom(e.target);
        if ("wrapper" === params.touchEventsTarget) if (!$targetEl.closest(swiper.wrapperEl).length) return;
        data.isTouchEvent = "touchstart" === e.type;
        if (!data.isTouchEvent && "which" in e && 3 === e.which) return;
        if (!data.isTouchEvent && "button" in e && e.button > 0) return;
        if (data.isTouched && data.isMoved) return;
        const swipingClassHasValue = !!params.noSwipingClass && "" !== params.noSwipingClass;
        if (swipingClassHasValue && e.target && e.target.shadowRoot && event.path && event.path[0]) $targetEl = dom(event.path[0]);
        const noSwipingSelector = params.noSwipingSelector ? params.noSwipingSelector : `.${params.noSwipingClass}`;
        const isTargetShadow = !!(e.target && e.target.shadowRoot);
        if (params.noSwiping && (isTargetShadow ? closestElement(noSwipingSelector, $targetEl[0]) : $targetEl.closest(noSwipingSelector)[0])) {
            swiper.allowClick = true;
            return;
        }
        if (params.swipeHandler) if (!$targetEl.closest(params.swipeHandler)[0]) return;
        touches.currentX = "touchstart" === e.type ? e.targetTouches[0].pageX : e.pageX;
        touches.currentY = "touchstart" === e.type ? e.targetTouches[0].pageY : e.pageY;
        const startX = touches.currentX;
        const startY = touches.currentY;
        const edgeSwipeDetection = params.edgeSwipeDetection || params.iOSEdgeSwipeDetection;
        const edgeSwipeThreshold = params.edgeSwipeThreshold || params.iOSEdgeSwipeThreshold;
        if (edgeSwipeDetection && (startX <= edgeSwipeThreshold || startX >= window.innerWidth - edgeSwipeThreshold)) if ("prevent" === edgeSwipeDetection) event.preventDefault(); else return;
        Object.assign(data, {
            isTouched: true,
            isMoved: false,
            allowTouchCallbacks: true,
            isScrolling: void 0,
            startMoving: void 0
        });
        touches.startX = startX;
        touches.startY = startY;
        data.touchStartTime = utils_now();
        swiper.allowClick = true;
        swiper.updateSize();
        swiper.swipeDirection = void 0;
        if (params.threshold > 0) data.allowThresholdMove = false;
        if ("touchstart" !== e.type) {
            let preventDefault = true;
            if ($targetEl.is(data.focusableElements)) {
                preventDefault = false;
                if ("SELECT" === $targetEl[0].nodeName) data.isTouched = false;
            }
            if (document.activeElement && dom(document.activeElement).is(data.focusableElements) && document.activeElement !== $targetEl[0]) document.activeElement.blur();
            const shouldPreventDefault = preventDefault && swiper.allowTouchMove && params.touchStartPreventDefault;
            if ((params.touchStartForcePreventDefault || shouldPreventDefault) && !$targetEl[0].isContentEditable) e.preventDefault();
        }
        if (swiper.params.freeMode && swiper.params.freeMode.enabled && swiper.freeMode && swiper.animating && !params.cssMode) swiper.freeMode.onTouchStart();
        swiper.emit("touchStart", e);
    }
    function onTouchMove(event) {
        const document = ssr_window_esm_getDocument();
        const swiper = this;
        const data = swiper.touchEventsData;
        const {params, touches, rtlTranslate: rtl, enabled} = swiper;
        if (!enabled) return;
        let e = event;
        if (e.originalEvent) e = e.originalEvent;
        if (!data.isTouched) {
            if (data.startMoving && data.isScrolling) swiper.emit("touchMoveOpposite", e);
            return;
        }
        if (data.isTouchEvent && "touchmove" !== e.type) return;
        const targetTouch = "touchmove" === e.type && e.targetTouches && (e.targetTouches[0] || e.changedTouches[0]);
        const pageX = "touchmove" === e.type ? targetTouch.pageX : e.pageX;
        const pageY = "touchmove" === e.type ? targetTouch.pageY : e.pageY;
        if (e.preventedByNestedSwiper) {
            touches.startX = pageX;
            touches.startY = pageY;
            return;
        }
        if (!swiper.allowTouchMove) {
            if (!dom(e.target).is(data.focusableElements)) swiper.allowClick = false;
            if (data.isTouched) {
                Object.assign(touches, {
                    startX: pageX,
                    startY: pageY,
                    currentX: pageX,
                    currentY: pageY
                });
                data.touchStartTime = utils_now();
            }
            return;
        }
        if (data.isTouchEvent && params.touchReleaseOnEdges && !params.loop) if (swiper.isVertical()) {
            if (pageY < touches.startY && swiper.translate <= swiper.maxTranslate() || pageY > touches.startY && swiper.translate >= swiper.minTranslate()) {
                data.isTouched = false;
                data.isMoved = false;
                return;
            }
        } else if (pageX < touches.startX && swiper.translate <= swiper.maxTranslate() || pageX > touches.startX && swiper.translate >= swiper.minTranslate()) return;
        if (data.isTouchEvent && document.activeElement) if (e.target === document.activeElement && dom(e.target).is(data.focusableElements)) {
            data.isMoved = true;
            swiper.allowClick = false;
            return;
        }
        if (data.allowTouchCallbacks) swiper.emit("touchMove", e);
        if (e.targetTouches && e.targetTouches.length > 1) return;
        touches.currentX = pageX;
        touches.currentY = pageY;
        const diffX = touches.currentX - touches.startX;
        const diffY = touches.currentY - touches.startY;
        if (swiper.params.threshold && Math.sqrt(diffX ** 2 + diffY ** 2) < swiper.params.threshold) return;
        if ("undefined" === typeof data.isScrolling) {
            let touchAngle;
            if (swiper.isHorizontal() && touches.currentY === touches.startY || swiper.isVertical() && touches.currentX === touches.startX) data.isScrolling = false; else if (diffX * diffX + diffY * diffY >= 25) {
                touchAngle = 180 * Math.atan2(Math.abs(diffY), Math.abs(diffX)) / Math.PI;
                data.isScrolling = swiper.isHorizontal() ? touchAngle > params.touchAngle : 90 - touchAngle > params.touchAngle;
            }
        }
        if (data.isScrolling) swiper.emit("touchMoveOpposite", e);
        if ("undefined" === typeof data.startMoving) if (touches.currentX !== touches.startX || touches.currentY !== touches.startY) data.startMoving = true;
        if (data.isScrolling) {
            data.isTouched = false;
            return;
        }
        if (!data.startMoving) return;
        swiper.allowClick = false;
        if (!params.cssMode && e.cancelable) e.preventDefault();
        if (params.touchMoveStopPropagation && !params.nested) e.stopPropagation();
        if (!data.isMoved) {
            if (params.loop && !params.cssMode) swiper.loopFix();
            data.startTranslate = swiper.getTranslate();
            swiper.setTransition(0);
            if (swiper.animating) swiper.$wrapperEl.trigger("webkitTransitionEnd transitionend");
            data.allowMomentumBounce = false;
            if (params.grabCursor && (true === swiper.allowSlideNext || true === swiper.allowSlidePrev)) swiper.setGrabCursor(true);
            swiper.emit("sliderFirstMove", e);
        }
        swiper.emit("sliderMove", e);
        data.isMoved = true;
        let diff = swiper.isHorizontal() ? diffX : diffY;
        touches.diff = diff;
        diff *= params.touchRatio;
        if (rtl) diff = -diff;
        swiper.swipeDirection = diff > 0 ? "prev" : "next";
        data.currentTranslate = diff + data.startTranslate;
        let disableParentSwiper = true;
        let resistanceRatio = params.resistanceRatio;
        if (params.touchReleaseOnEdges) resistanceRatio = 0;
        if (diff > 0 && data.currentTranslate > swiper.minTranslate()) {
            disableParentSwiper = false;
            if (params.resistance) data.currentTranslate = swiper.minTranslate() - 1 + (-swiper.minTranslate() + data.startTranslate + diff) ** resistanceRatio;
        } else if (diff < 0 && data.currentTranslate < swiper.maxTranslate()) {
            disableParentSwiper = false;
            if (params.resistance) data.currentTranslate = swiper.maxTranslate() + 1 - (swiper.maxTranslate() - data.startTranslate - diff) ** resistanceRatio;
        }
        if (disableParentSwiper) e.preventedByNestedSwiper = true;
        if (!swiper.allowSlideNext && "next" === swiper.swipeDirection && data.currentTranslate < data.startTranslate) data.currentTranslate = data.startTranslate;
        if (!swiper.allowSlidePrev && "prev" === swiper.swipeDirection && data.currentTranslate > data.startTranslate) data.currentTranslate = data.startTranslate;
        if (!swiper.allowSlidePrev && !swiper.allowSlideNext) data.currentTranslate = data.startTranslate;
        if (params.threshold > 0) if (Math.abs(diff) > params.threshold || data.allowThresholdMove) {
            if (!data.allowThresholdMove) {
                data.allowThresholdMove = true;
                touches.startX = touches.currentX;
                touches.startY = touches.currentY;
                data.currentTranslate = data.startTranslate;
                touches.diff = swiper.isHorizontal() ? touches.currentX - touches.startX : touches.currentY - touches.startY;
                return;
            }
        } else {
            data.currentTranslate = data.startTranslate;
            return;
        }
        if (!params.followFinger || params.cssMode) return;
        if (params.freeMode && params.freeMode.enabled && swiper.freeMode || params.watchSlidesProgress) {
            swiper.updateActiveIndex();
            swiper.updateSlidesClasses();
        }
        if (swiper.params.freeMode && params.freeMode.enabled && swiper.freeMode) swiper.freeMode.onTouchMove();
        swiper.updateProgress(data.currentTranslate);
        swiper.setTranslate(data.currentTranslate);
    }
    function onTouchEnd(event) {
        const swiper = this;
        const data = swiper.touchEventsData;
        const {params, touches, rtlTranslate: rtl, slidesGrid, enabled} = swiper;
        if (!enabled) return;
        let e = event;
        if (e.originalEvent) e = e.originalEvent;
        if (data.allowTouchCallbacks) swiper.emit("touchEnd", e);
        data.allowTouchCallbacks = false;
        if (!data.isTouched) {
            if (data.isMoved && params.grabCursor) swiper.setGrabCursor(false);
            data.isMoved = false;
            data.startMoving = false;
            return;
        }
        if (params.grabCursor && data.isMoved && data.isTouched && (true === swiper.allowSlideNext || true === swiper.allowSlidePrev)) swiper.setGrabCursor(false);
        const touchEndTime = utils_now();
        const timeDiff = touchEndTime - data.touchStartTime;
        if (swiper.allowClick) {
            const pathTree = e.path || e.composedPath && e.composedPath();
            swiper.updateClickedSlide(pathTree && pathTree[0] || e.target);
            swiper.emit("tap click", e);
            if (timeDiff < 300 && touchEndTime - data.lastClickTime < 300) swiper.emit("doubleTap doubleClick", e);
        }
        data.lastClickTime = utils_now();
        utils_nextTick((() => {
            if (!swiper.destroyed) swiper.allowClick = true;
        }));
        if (!data.isTouched || !data.isMoved || !swiper.swipeDirection || 0 === touches.diff || data.currentTranslate === data.startTranslate) {
            data.isTouched = false;
            data.isMoved = false;
            data.startMoving = false;
            return;
        }
        data.isTouched = false;
        data.isMoved = false;
        data.startMoving = false;
        let currentPos;
        if (params.followFinger) currentPos = rtl ? swiper.translate : -swiper.translate; else currentPos = -data.currentTranslate;
        if (params.cssMode) return;
        if (swiper.params.freeMode && params.freeMode.enabled) {
            swiper.freeMode.onTouchEnd({
                currentPos
            });
            return;
        }
        let stopIndex = 0;
        let groupSize = swiper.slidesSizesGrid[0];
        for (let i = 0; i < slidesGrid.length; i += i < params.slidesPerGroupSkip ? 1 : params.slidesPerGroup) {
            const increment = i < params.slidesPerGroupSkip - 1 ? 1 : params.slidesPerGroup;
            if ("undefined" !== typeof slidesGrid[i + increment]) {
                if (currentPos >= slidesGrid[i] && currentPos < slidesGrid[i + increment]) {
                    stopIndex = i;
                    groupSize = slidesGrid[i + increment] - slidesGrid[i];
                }
            } else if (currentPos >= slidesGrid[i]) {
                stopIndex = i;
                groupSize = slidesGrid[slidesGrid.length - 1] - slidesGrid[slidesGrid.length - 2];
            }
        }
        let rewindFirstIndex = null;
        let rewindLastIndex = null;
        if (params.rewind) if (swiper.isBeginning) rewindLastIndex = swiper.params.virtual && swiper.params.virtual.enabled && swiper.virtual ? swiper.virtual.slides.length - 1 : swiper.slides.length - 1; else if (swiper.isEnd) rewindFirstIndex = 0;
        const ratio = (currentPos - slidesGrid[stopIndex]) / groupSize;
        const increment = stopIndex < params.slidesPerGroupSkip - 1 ? 1 : params.slidesPerGroup;
        if (timeDiff > params.longSwipesMs) {
            if (!params.longSwipes) {
                swiper.slideTo(swiper.activeIndex);
                return;
            }
            if ("next" === swiper.swipeDirection) if (ratio >= params.longSwipesRatio) swiper.slideTo(params.rewind && swiper.isEnd ? rewindFirstIndex : stopIndex + increment); else swiper.slideTo(stopIndex);
            if ("prev" === swiper.swipeDirection) if (ratio > 1 - params.longSwipesRatio) swiper.slideTo(stopIndex + increment); else if (null !== rewindLastIndex && ratio < 0 && Math.abs(ratio) > params.longSwipesRatio) swiper.slideTo(rewindLastIndex); else swiper.slideTo(stopIndex);
        } else {
            if (!params.shortSwipes) {
                swiper.slideTo(swiper.activeIndex);
                return;
            }
            const isNavButtonTarget = swiper.navigation && (e.target === swiper.navigation.nextEl || e.target === swiper.navigation.prevEl);
            if (!isNavButtonTarget) {
                if ("next" === swiper.swipeDirection) swiper.slideTo(null !== rewindFirstIndex ? rewindFirstIndex : stopIndex + increment);
                if ("prev" === swiper.swipeDirection) swiper.slideTo(null !== rewindLastIndex ? rewindLastIndex : stopIndex);
            } else if (e.target === swiper.navigation.nextEl) swiper.slideTo(stopIndex + increment); else swiper.slideTo(stopIndex);
        }
    }
    function onResize() {
        const swiper = this;
        const {params, el} = swiper;
        if (el && 0 === el.offsetWidth) return;
        if (params.breakpoints) swiper.setBreakpoint();
        const {allowSlideNext, allowSlidePrev, snapGrid} = swiper;
        swiper.allowSlideNext = true;
        swiper.allowSlidePrev = true;
        swiper.updateSize();
        swiper.updateSlides();
        swiper.updateSlidesClasses();
        if (("auto" === params.slidesPerView || params.slidesPerView > 1) && swiper.isEnd && !swiper.isBeginning && !swiper.params.centeredSlides) swiper.slideTo(swiper.slides.length - 1, 0, false, true); else swiper.slideTo(swiper.activeIndex, 0, false, true);
        if (swiper.autoplay && swiper.autoplay.running && swiper.autoplay.paused) swiper.autoplay.run();
        swiper.allowSlidePrev = allowSlidePrev;
        swiper.allowSlideNext = allowSlideNext;
        if (swiper.params.watchOverflow && snapGrid !== swiper.snapGrid) swiper.checkOverflow();
    }
    function onClick(e) {
        const swiper = this;
        if (!swiper.enabled) return;
        if (!swiper.allowClick) {
            if (swiper.params.preventClicks) e.preventDefault();
            if (swiper.params.preventClicksPropagation && swiper.animating) {
                e.stopPropagation();
                e.stopImmediatePropagation();
            }
        }
    }
    function onScroll() {
        const swiper = this;
        const {wrapperEl, rtlTranslate, enabled} = swiper;
        if (!enabled) return;
        swiper.previousTranslate = swiper.translate;
        if (swiper.isHorizontal()) swiper.translate = -wrapperEl.scrollLeft; else swiper.translate = -wrapperEl.scrollTop;
        if (0 === swiper.translate) swiper.translate = 0;
        swiper.updateActiveIndex();
        swiper.updateSlidesClasses();
        let newProgress;
        const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
        if (0 === translatesDiff) newProgress = 0; else newProgress = (swiper.translate - swiper.minTranslate()) / translatesDiff;
        if (newProgress !== swiper.progress) swiper.updateProgress(rtlTranslate ? -swiper.translate : swiper.translate);
        swiper.emit("setTranslate", swiper.translate, false);
    }
    let dummyEventAttached = false;
    function dummyEventListener() {}
    const events = (swiper, method) => {
        const document = ssr_window_esm_getDocument();
        const {params, touchEvents, el, wrapperEl, device, support} = swiper;
        const capture = !!params.nested;
        const domMethod = "on" === method ? "addEventListener" : "removeEventListener";
        const swiperMethod = method;
        if (!support.touch) {
            el[domMethod](touchEvents.start, swiper.onTouchStart, false);
            document[domMethod](touchEvents.move, swiper.onTouchMove, capture);
            document[domMethod](touchEvents.end, swiper.onTouchEnd, false);
        } else {
            const passiveListener = "touchstart" === touchEvents.start && support.passiveListener && params.passiveListeners ? {
                passive: true,
                capture: false
            } : false;
            el[domMethod](touchEvents.start, swiper.onTouchStart, passiveListener);
            el[domMethod](touchEvents.move, swiper.onTouchMove, support.passiveListener ? {
                passive: false,
                capture
            } : capture);
            el[domMethod](touchEvents.end, swiper.onTouchEnd, passiveListener);
            if (touchEvents.cancel) el[domMethod](touchEvents.cancel, swiper.onTouchEnd, passiveListener);
        }
        if (params.preventClicks || params.preventClicksPropagation) el[domMethod]("click", swiper.onClick, true);
        if (params.cssMode) wrapperEl[domMethod]("scroll", swiper.onScroll);
        if (params.updateOnWindowResize) swiper[swiperMethod](device.ios || device.android ? "resize orientationchange observerUpdate" : "resize observerUpdate", onResize, true); else swiper[swiperMethod]("observerUpdate", onResize, true);
    };
    function attachEvents() {
        const swiper = this;
        const document = ssr_window_esm_getDocument();
        const {params, support} = swiper;
        swiper.onTouchStart = onTouchStart.bind(swiper);
        swiper.onTouchMove = onTouchMove.bind(swiper);
        swiper.onTouchEnd = onTouchEnd.bind(swiper);
        if (params.cssMode) swiper.onScroll = onScroll.bind(swiper);
        swiper.onClick = onClick.bind(swiper);
        if (support.touch && !dummyEventAttached) {
            document.addEventListener("touchstart", dummyEventListener);
            dummyEventAttached = true;
        }
        events(swiper, "on");
    }
    function detachEvents() {
        const swiper = this;
        events(swiper, "off");
    }
    const core_events = {
        attachEvents,
        detachEvents
    };
    const isGridEnabled = (swiper, params) => swiper.grid && params.grid && params.grid.rows > 1;
    function setBreakpoint() {
        const swiper = this;
        const {activeIndex, initialized, loopedSlides = 0, params, $el} = swiper;
        const breakpoints = params.breakpoints;
        if (!breakpoints || breakpoints && 0 === Object.keys(breakpoints).length) return;
        const breakpoint = swiper.getBreakpoint(breakpoints, swiper.params.breakpointsBase, swiper.el);
        if (!breakpoint || swiper.currentBreakpoint === breakpoint) return;
        const breakpointOnlyParams = breakpoint in breakpoints ? breakpoints[breakpoint] : void 0;
        const breakpointParams = breakpointOnlyParams || swiper.originalParams;
        const wasMultiRow = isGridEnabled(swiper, params);
        const isMultiRow = isGridEnabled(swiper, breakpointParams);
        const wasEnabled = params.enabled;
        if (wasMultiRow && !isMultiRow) {
            $el.removeClass(`${params.containerModifierClass}grid ${params.containerModifierClass}grid-column`);
            swiper.emitContainerClasses();
        } else if (!wasMultiRow && isMultiRow) {
            $el.addClass(`${params.containerModifierClass}grid`);
            if (breakpointParams.grid.fill && "column" === breakpointParams.grid.fill || !breakpointParams.grid.fill && "column" === params.grid.fill) $el.addClass(`${params.containerModifierClass}grid-column`);
            swiper.emitContainerClasses();
        }
        [ "navigation", "pagination", "scrollbar" ].forEach((prop => {
            const wasModuleEnabled = params[prop] && params[prop].enabled;
            const isModuleEnabled = breakpointParams[prop] && breakpointParams[prop].enabled;
            if (wasModuleEnabled && !isModuleEnabled) swiper[prop].disable();
            if (!wasModuleEnabled && isModuleEnabled) swiper[prop].enable();
        }));
        const directionChanged = breakpointParams.direction && breakpointParams.direction !== params.direction;
        const needsReLoop = params.loop && (breakpointParams.slidesPerView !== params.slidesPerView || directionChanged);
        if (directionChanged && initialized) swiper.changeDirection();
        utils_extend(swiper.params, breakpointParams);
        const isEnabled = swiper.params.enabled;
        Object.assign(swiper, {
            allowTouchMove: swiper.params.allowTouchMove,
            allowSlideNext: swiper.params.allowSlideNext,
            allowSlidePrev: swiper.params.allowSlidePrev
        });
        if (wasEnabled && !isEnabled) swiper.disable(); else if (!wasEnabled && isEnabled) swiper.enable();
        swiper.currentBreakpoint = breakpoint;
        swiper.emit("_beforeBreakpoint", breakpointParams);
        if (needsReLoop && initialized) {
            swiper.loopDestroy();
            swiper.loopCreate();
            swiper.updateSlides();
            swiper.slideTo(activeIndex - loopedSlides + swiper.loopedSlides, 0, false);
        }
        swiper.emit("breakpoint", breakpointParams);
    }
    function getBreakpoint(breakpoints, base, containerEl) {
        if (void 0 === base) base = "window";
        if (!breakpoints || "container" === base && !containerEl) return;
        let breakpoint = false;
        const window = ssr_window_esm_getWindow();
        const currentHeight = "window" === base ? window.innerHeight : containerEl.clientHeight;
        const points = Object.keys(breakpoints).map((point => {
            if ("string" === typeof point && 0 === point.indexOf("@")) {
                const minRatio = parseFloat(point.substr(1));
                const value = currentHeight * minRatio;
                return {
                    value,
                    point
                };
            }
            return {
                value: point,
                point
            };
        }));
        points.sort(((a, b) => parseInt(a.value, 10) - parseInt(b.value, 10)));
        for (let i = 0; i < points.length; i += 1) {
            const {point, value} = points[i];
            if ("window" === base) {
                if (window.matchMedia(`(min-width: ${value}px)`).matches) breakpoint = point;
            } else if (value <= containerEl.clientWidth) breakpoint = point;
        }
        return breakpoint || "max";
    }
    const breakpoints = {
        setBreakpoint,
        getBreakpoint
    };
    function prepareClasses(entries, prefix) {
        const resultClasses = [];
        entries.forEach((item => {
            if ("object" === typeof item) Object.keys(item).forEach((classNames => {
                if (item[classNames]) resultClasses.push(prefix + classNames);
            })); else if ("string" === typeof item) resultClasses.push(prefix + item);
        }));
        return resultClasses;
    }
    function addClasses() {
        const swiper = this;
        const {classNames, params, rtl, $el, device, support} = swiper;
        const suffixes = prepareClasses([ "initialized", params.direction, {
            "pointer-events": !support.touch
        }, {
            "free-mode": swiper.params.freeMode && params.freeMode.enabled
        }, {
            autoheight: params.autoHeight
        }, {
            rtl
        }, {
            grid: params.grid && params.grid.rows > 1
        }, {
            "grid-column": params.grid && params.grid.rows > 1 && "column" === params.grid.fill
        }, {
            android: device.android
        }, {
            ios: device.ios
        }, {
            "css-mode": params.cssMode
        }, {
            centered: params.cssMode && params.centeredSlides
        }, {
            "watch-progress": params.watchSlidesProgress
        } ], params.containerModifierClass);
        classNames.push(...suffixes);
        $el.addClass([ ...classNames ].join(" "));
        swiper.emitContainerClasses();
    }
    function removeClasses_removeClasses() {
        const swiper = this;
        const {$el, classNames} = swiper;
        $el.removeClass(classNames.join(" "));
        swiper.emitContainerClasses();
    }
    const classes = {
        addClasses,
        removeClasses: removeClasses_removeClasses
    };
    function loadImage(imageEl, src, srcset, sizes, checkForComplete, callback) {
        const window = ssr_window_esm_getWindow();
        let image;
        function onReady() {
            if (callback) callback();
        }
        const isPicture = dom(imageEl).parent("picture")[0];
        if (!isPicture && (!imageEl.complete || !checkForComplete)) if (src) {
            image = new window.Image;
            image.onload = onReady;
            image.onerror = onReady;
            if (sizes) image.sizes = sizes;
            if (srcset) image.srcset = srcset;
            if (src) image.src = src;
        } else onReady(); else onReady();
    }
    function preloadImages() {
        const swiper = this;
        swiper.imagesToLoad = swiper.$el.find("img");
        function onReady() {
            if ("undefined" === typeof swiper || null === swiper || !swiper || swiper.destroyed) return;
            if (void 0 !== swiper.imagesLoaded) swiper.imagesLoaded += 1;
            if (swiper.imagesLoaded === swiper.imagesToLoad.length) {
                if (swiper.params.updateOnImagesReady) swiper.update();
                swiper.emit("imagesReady");
            }
        }
        for (let i = 0; i < swiper.imagesToLoad.length; i += 1) {
            const imageEl = swiper.imagesToLoad[i];
            swiper.loadImage(imageEl, imageEl.currentSrc || imageEl.getAttribute("src"), imageEl.srcset || imageEl.getAttribute("srcset"), imageEl.sizes || imageEl.getAttribute("sizes"), true, onReady);
        }
    }
    const core_images = {
        loadImage,
        preloadImages
    };
    function checkOverflow() {
        const swiper = this;
        const {isLocked: wasLocked, params} = swiper;
        const {slidesOffsetBefore} = params;
        if (slidesOffsetBefore) {
            const lastSlideIndex = swiper.slides.length - 1;
            const lastSlideRightEdge = swiper.slidesGrid[lastSlideIndex] + swiper.slidesSizesGrid[lastSlideIndex] + 2 * slidesOffsetBefore;
            swiper.isLocked = swiper.size > lastSlideRightEdge;
        } else swiper.isLocked = 1 === swiper.snapGrid.length;
        if (true === params.allowSlideNext) swiper.allowSlideNext = !swiper.isLocked;
        if (true === params.allowSlidePrev) swiper.allowSlidePrev = !swiper.isLocked;
        if (wasLocked && wasLocked !== swiper.isLocked) swiper.isEnd = false;
        if (wasLocked !== swiper.isLocked) swiper.emit(swiper.isLocked ? "lock" : "unlock");
    }
    const check_overflow = {
        checkOverflow
    };
    const defaults = {
        init: true,
        direction: "horizontal",
        touchEventsTarget: "wrapper",
        initialSlide: 0,
        speed: 300,
        cssMode: false,
        updateOnWindowResize: true,
        resizeObserver: true,
        nested: false,
        createElements: false,
        enabled: true,
        focusableElements: "input, select, option, textarea, button, video, label",
        width: null,
        height: null,
        preventInteractionOnTransition: false,
        userAgent: null,
        url: null,
        edgeSwipeDetection: false,
        edgeSwipeThreshold: 20,
        autoHeight: false,
        setWrapperSize: false,
        virtualTranslate: false,
        effect: "slide",
        breakpoints: void 0,
        breakpointsBase: "window",
        spaceBetween: 0,
        slidesPerView: 1,
        slidesPerGroup: 1,
        slidesPerGroupSkip: 0,
        slidesPerGroupAuto: false,
        centeredSlides: false,
        centeredSlidesBounds: false,
        slidesOffsetBefore: 0,
        slidesOffsetAfter: 0,
        normalizeSlideIndex: true,
        centerInsufficientSlides: false,
        watchOverflow: true,
        roundLengths: false,
        touchRatio: 1,
        touchAngle: 45,
        simulateTouch: true,
        shortSwipes: true,
        longSwipes: true,
        longSwipesRatio: .5,
        longSwipesMs: 300,
        followFinger: true,
        allowTouchMove: true,
        threshold: 0,
        touchMoveStopPropagation: false,
        touchStartPreventDefault: true,
        touchStartForcePreventDefault: false,
        touchReleaseOnEdges: false,
        uniqueNavElements: true,
        resistance: true,
        resistanceRatio: .85,
        watchSlidesProgress: false,
        grabCursor: false,
        preventClicks: true,
        preventClicksPropagation: true,
        slideToClickedSlide: false,
        preloadImages: true,
        updateOnImagesReady: true,
        loop: false,
        loopAdditionalSlides: 0,
        loopedSlides: null,
        loopFillGroupWithBlank: false,
        loopPreventsSlide: true,
        rewind: false,
        allowSlidePrev: true,
        allowSlideNext: true,
        swipeHandler: null,
        noSwiping: true,
        noSwipingClass: "swiper-no-swiping",
        noSwipingSelector: null,
        passiveListeners: true,
        maxBackfaceHiddenSlides: 10,
        containerModifierClass: "swiper-",
        slideClass: "swiper-slide",
        slideBlankClass: "swiper-slide-invisible-blank",
        slideActiveClass: "swiper-slide-active",
        slideDuplicateActiveClass: "swiper-slide-duplicate-active",
        slideVisibleClass: "swiper-slide-visible",
        slideDuplicateClass: "swiper-slide-duplicate",
        slideNextClass: "swiper-slide-next",
        slideDuplicateNextClass: "swiper-slide-duplicate-next",
        slidePrevClass: "swiper-slide-prev",
        slideDuplicatePrevClass: "swiper-slide-duplicate-prev",
        wrapperClass: "swiper-wrapper",
        runCallbacksOnInit: true,
        _emitClasses: false
    };
    function moduleExtendParams(params, allModulesParams) {
        return function extendParams(obj) {
            if (void 0 === obj) obj = {};
            const moduleParamName = Object.keys(obj)[0];
            const moduleParams = obj[moduleParamName];
            if ("object" !== typeof moduleParams || null === moduleParams) {
                utils_extend(allModulesParams, obj);
                return;
            }
            if ([ "navigation", "pagination", "scrollbar" ].indexOf(moduleParamName) >= 0 && true === params[moduleParamName]) params[moduleParamName] = {
                auto: true
            };
            if (!(moduleParamName in params && "enabled" in moduleParams)) {
                utils_extend(allModulesParams, obj);
                return;
            }
            if (true === params[moduleParamName]) params[moduleParamName] = {
                enabled: true
            };
            if ("object" === typeof params[moduleParamName] && !("enabled" in params[moduleParamName])) params[moduleParamName].enabled = true;
            if (!params[moduleParamName]) params[moduleParamName] = {
                enabled: false
            };
            utils_extend(allModulesParams, obj);
        };
    }
    const prototypes = {
        eventsEmitter: events_emitter,
        update,
        translate,
        transition: core_transition,
        slide,
        loop,
        grabCursor: grab_cursor,
        events: core_events,
        breakpoints,
        checkOverflow: check_overflow,
        classes,
        images: core_images
    };
    const extendedDefaults = {};
    class Swiper {
        constructor() {
            let el;
            let params;
            for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
            if (1 === args.length && args[0].constructor && "Object" === Object.prototype.toString.call(args[0]).slice(8, -1)) params = args[0]; else [el, params] = args;
            if (!params) params = {};
            params = utils_extend({}, params);
            if (el && !params.el) params.el = el;
            if (params.el && dom(params.el).length > 1) {
                const swipers = [];
                dom(params.el).each((containerEl => {
                    const newParams = utils_extend({}, params, {
                        el: containerEl
                    });
                    swipers.push(new Swiper(newParams));
                }));
                return swipers;
            }
            const swiper = this;
            swiper.__swiper__ = true;
            swiper.support = getSupport();
            swiper.device = getDevice({
                userAgent: params.userAgent
            });
            swiper.browser = getBrowser();
            swiper.eventsListeners = {};
            swiper.eventsAnyListeners = [];
            swiper.modules = [ ...swiper.__modules__ ];
            if (params.modules && Array.isArray(params.modules)) swiper.modules.push(...params.modules);
            const allModulesParams = {};
            swiper.modules.forEach((mod => {
                mod({
                    swiper,
                    extendParams: moduleExtendParams(params, allModulesParams),
                    on: swiper.on.bind(swiper),
                    once: swiper.once.bind(swiper),
                    off: swiper.off.bind(swiper),
                    emit: swiper.emit.bind(swiper)
                });
            }));
            const swiperParams = utils_extend({}, defaults, allModulesParams);
            swiper.params = utils_extend({}, swiperParams, extendedDefaults, params);
            swiper.originalParams = utils_extend({}, swiper.params);
            swiper.passedParams = utils_extend({}, params);
            if (swiper.params && swiper.params.on) Object.keys(swiper.params.on).forEach((eventName => {
                swiper.on(eventName, swiper.params.on[eventName]);
            }));
            if (swiper.params && swiper.params.onAny) swiper.onAny(swiper.params.onAny);
            swiper.$ = dom;
            Object.assign(swiper, {
                enabled: swiper.params.enabled,
                el,
                classNames: [],
                slides: dom(),
                slidesGrid: [],
                snapGrid: [],
                slidesSizesGrid: [],
                isHorizontal() {
                    return "horizontal" === swiper.params.direction;
                },
                isVertical() {
                    return "vertical" === swiper.params.direction;
                },
                activeIndex: 0,
                realIndex: 0,
                isBeginning: true,
                isEnd: false,
                translate: 0,
                previousTranslate: 0,
                progress: 0,
                velocity: 0,
                animating: false,
                allowSlideNext: swiper.params.allowSlideNext,
                allowSlidePrev: swiper.params.allowSlidePrev,
                touchEvents: function touchEvents() {
                    const touch = [ "touchstart", "touchmove", "touchend", "touchcancel" ];
                    const desktop = [ "pointerdown", "pointermove", "pointerup" ];
                    swiper.touchEventsTouch = {
                        start: touch[0],
                        move: touch[1],
                        end: touch[2],
                        cancel: touch[3]
                    };
                    swiper.touchEventsDesktop = {
                        start: desktop[0],
                        move: desktop[1],
                        end: desktop[2]
                    };
                    return swiper.support.touch || !swiper.params.simulateTouch ? swiper.touchEventsTouch : swiper.touchEventsDesktop;
                }(),
                touchEventsData: {
                    isTouched: void 0,
                    isMoved: void 0,
                    allowTouchCallbacks: void 0,
                    touchStartTime: void 0,
                    isScrolling: void 0,
                    currentTranslate: void 0,
                    startTranslate: void 0,
                    allowThresholdMove: void 0,
                    focusableElements: swiper.params.focusableElements,
                    lastClickTime: utils_now(),
                    clickTimeout: void 0,
                    velocities: [],
                    allowMomentumBounce: void 0,
                    isTouchEvent: void 0,
                    startMoving: void 0
                },
                allowClick: true,
                allowTouchMove: swiper.params.allowTouchMove,
                touches: {
                    startX: 0,
                    startY: 0,
                    currentX: 0,
                    currentY: 0,
                    diff: 0
                },
                imagesToLoad: [],
                imagesLoaded: 0
            });
            swiper.emit("_swiper");
            if (swiper.params.init) swiper.init();
            return swiper;
        }
        enable() {
            const swiper = this;
            if (swiper.enabled) return;
            swiper.enabled = true;
            if (swiper.params.grabCursor) swiper.setGrabCursor();
            swiper.emit("enable");
        }
        disable() {
            const swiper = this;
            if (!swiper.enabled) return;
            swiper.enabled = false;
            if (swiper.params.grabCursor) swiper.unsetGrabCursor();
            swiper.emit("disable");
        }
        setProgress(progress, speed) {
            const swiper = this;
            progress = Math.min(Math.max(progress, 0), 1);
            const min = swiper.minTranslate();
            const max = swiper.maxTranslate();
            const current = (max - min) * progress + min;
            swiper.translateTo(current, "undefined" === typeof speed ? 0 : speed);
            swiper.updateActiveIndex();
            swiper.updateSlidesClasses();
        }
        emitContainerClasses() {
            const swiper = this;
            if (!swiper.params._emitClasses || !swiper.el) return;
            const cls = swiper.el.className.split(" ").filter((className => 0 === className.indexOf("swiper") || 0 === className.indexOf(swiper.params.containerModifierClass)));
            swiper.emit("_containerClasses", cls.join(" "));
        }
        getSlideClasses(slideEl) {
            const swiper = this;
            if (swiper.destroyed) return "";
            return slideEl.className.split(" ").filter((className => 0 === className.indexOf("swiper-slide") || 0 === className.indexOf(swiper.params.slideClass))).join(" ");
        }
        emitSlidesClasses() {
            const swiper = this;
            if (!swiper.params._emitClasses || !swiper.el) return;
            const updates = [];
            swiper.slides.each((slideEl => {
                const classNames = swiper.getSlideClasses(slideEl);
                updates.push({
                    slideEl,
                    classNames
                });
                swiper.emit("_slideClass", slideEl, classNames);
            }));
            swiper.emit("_slideClasses", updates);
        }
        slidesPerViewDynamic(view, exact) {
            if (void 0 === view) view = "current";
            if (void 0 === exact) exact = false;
            const swiper = this;
            const {params, slides, slidesGrid, slidesSizesGrid, size: swiperSize, activeIndex} = swiper;
            let spv = 1;
            if (params.centeredSlides) {
                let slideSize = slides[activeIndex].swiperSlideSize;
                let breakLoop;
                for (let i = activeIndex + 1; i < slides.length; i += 1) if (slides[i] && !breakLoop) {
                    slideSize += slides[i].swiperSlideSize;
                    spv += 1;
                    if (slideSize > swiperSize) breakLoop = true;
                }
                for (let i = activeIndex - 1; i >= 0; i -= 1) if (slides[i] && !breakLoop) {
                    slideSize += slides[i].swiperSlideSize;
                    spv += 1;
                    if (slideSize > swiperSize) breakLoop = true;
                }
            } else if ("current" === view) for (let i = activeIndex + 1; i < slides.length; i += 1) {
                const slideInView = exact ? slidesGrid[i] + slidesSizesGrid[i] - slidesGrid[activeIndex] < swiperSize : slidesGrid[i] - slidesGrid[activeIndex] < swiperSize;
                if (slideInView) spv += 1;
            } else for (let i = activeIndex - 1; i >= 0; i -= 1) {
                const slideInView = slidesGrid[activeIndex] - slidesGrid[i] < swiperSize;
                if (slideInView) spv += 1;
            }
            return spv;
        }
        update() {
            const swiper = this;
            if (!swiper || swiper.destroyed) return;
            const {snapGrid, params} = swiper;
            if (params.breakpoints) swiper.setBreakpoint();
            swiper.updateSize();
            swiper.updateSlides();
            swiper.updateProgress();
            swiper.updateSlidesClasses();
            function setTranslate() {
                const translateValue = swiper.rtlTranslate ? -1 * swiper.translate : swiper.translate;
                const newTranslate = Math.min(Math.max(translateValue, swiper.maxTranslate()), swiper.minTranslate());
                swiper.setTranslate(newTranslate);
                swiper.updateActiveIndex();
                swiper.updateSlidesClasses();
            }
            let translated;
            if (swiper.params.freeMode && swiper.params.freeMode.enabled) {
                setTranslate();
                if (swiper.params.autoHeight) swiper.updateAutoHeight();
            } else {
                if (("auto" === swiper.params.slidesPerView || swiper.params.slidesPerView > 1) && swiper.isEnd && !swiper.params.centeredSlides) translated = swiper.slideTo(swiper.slides.length - 1, 0, false, true); else translated = swiper.slideTo(swiper.activeIndex, 0, false, true);
                if (!translated) setTranslate();
            }
            if (params.watchOverflow && snapGrid !== swiper.snapGrid) swiper.checkOverflow();
            swiper.emit("update");
        }
        changeDirection(newDirection, needUpdate) {
            if (void 0 === needUpdate) needUpdate = true;
            const swiper = this;
            const currentDirection = swiper.params.direction;
            if (!newDirection) newDirection = "horizontal" === currentDirection ? "vertical" : "horizontal";
            if (newDirection === currentDirection || "horizontal" !== newDirection && "vertical" !== newDirection) return swiper;
            swiper.$el.removeClass(`${swiper.params.containerModifierClass}${currentDirection}`).addClass(`${swiper.params.containerModifierClass}${newDirection}`);
            swiper.emitContainerClasses();
            swiper.params.direction = newDirection;
            swiper.slides.each((slideEl => {
                if ("vertical" === newDirection) slideEl.style.width = ""; else slideEl.style.height = "";
            }));
            swiper.emit("changeDirection");
            if (needUpdate) swiper.update();
            return swiper;
        }
        changeLanguageDirection(direction) {
            const swiper = this;
            if (swiper.rtl && "rtl" === direction || !swiper.rtl && "ltr" === direction) return;
            swiper.rtl = "rtl" === direction;
            swiper.rtlTranslate = "horizontal" === swiper.params.direction && swiper.rtl;
            if (swiper.rtl) {
                swiper.$el.addClass(`${swiper.params.containerModifierClass}rtl`);
                swiper.el.dir = "rtl";
            } else {
                swiper.$el.removeClass(`${swiper.params.containerModifierClass}rtl`);
                swiper.el.dir = "ltr";
            }
            swiper.update();
        }
        mount(el) {
            const swiper = this;
            if (swiper.mounted) return true;
            const $el = dom(el || swiper.params.el);
            el = $el[0];
            if (!el) return false;
            el.swiper = swiper;
            const getWrapperSelector = () => `.${(swiper.params.wrapperClass || "").trim().split(" ").join(".")}`;
            const getWrapper = () => {
                if (el && el.shadowRoot && el.shadowRoot.querySelector) {
                    const res = dom(el.shadowRoot.querySelector(getWrapperSelector()));
                    res.children = options => $el.children(options);
                    return res;
                }
                if (!$el.children) return dom($el).children(getWrapperSelector());
                return $el.children(getWrapperSelector());
            };
            let $wrapperEl = getWrapper();
            if (0 === $wrapperEl.length && swiper.params.createElements) {
                const document = ssr_window_esm_getDocument();
                const wrapper = document.createElement("div");
                $wrapperEl = dom(wrapper);
                wrapper.className = swiper.params.wrapperClass;
                $el.append(wrapper);
                $el.children(`.${swiper.params.slideClass}`).each((slideEl => {
                    $wrapperEl.append(slideEl);
                }));
            }
            Object.assign(swiper, {
                $el,
                el,
                $wrapperEl,
                wrapperEl: $wrapperEl[0],
                mounted: true,
                rtl: "rtl" === el.dir.toLowerCase() || "rtl" === $el.css("direction"),
                rtlTranslate: "horizontal" === swiper.params.direction && ("rtl" === el.dir.toLowerCase() || "rtl" === $el.css("direction")),
                wrongRTL: "-webkit-box" === $wrapperEl.css("display")
            });
            return true;
        }
        init(el) {
            const swiper = this;
            if (swiper.initialized) return swiper;
            const mounted = swiper.mount(el);
            if (false === mounted) return swiper;
            swiper.emit("beforeInit");
            if (swiper.params.breakpoints) swiper.setBreakpoint();
            swiper.addClasses();
            if (swiper.params.loop) swiper.loopCreate();
            swiper.updateSize();
            swiper.updateSlides();
            if (swiper.params.watchOverflow) swiper.checkOverflow();
            if (swiper.params.grabCursor && swiper.enabled) swiper.setGrabCursor();
            if (swiper.params.preloadImages) swiper.preloadImages();
            if (swiper.params.loop) swiper.slideTo(swiper.params.initialSlide + swiper.loopedSlides, 0, swiper.params.runCallbacksOnInit, false, true); else swiper.slideTo(swiper.params.initialSlide, 0, swiper.params.runCallbacksOnInit, false, true);
            swiper.attachEvents();
            swiper.initialized = true;
            swiper.emit("init");
            swiper.emit("afterInit");
            return swiper;
        }
        destroy(deleteInstance, cleanStyles) {
            if (void 0 === deleteInstance) deleteInstance = true;
            if (void 0 === cleanStyles) cleanStyles = true;
            const swiper = this;
            const {params, $el, $wrapperEl, slides} = swiper;
            if ("undefined" === typeof swiper.params || swiper.destroyed) return null;
            swiper.emit("beforeDestroy");
            swiper.initialized = false;
            swiper.detachEvents();
            if (params.loop) swiper.loopDestroy();
            if (cleanStyles) {
                swiper.removeClasses();
                $el.removeAttr("style");
                $wrapperEl.removeAttr("style");
                if (slides && slides.length) slides.removeClass([ params.slideVisibleClass, params.slideActiveClass, params.slideNextClass, params.slidePrevClass ].join(" ")).removeAttr("style").removeAttr("data-swiper-slide-index");
            }
            swiper.emit("destroy");
            Object.keys(swiper.eventsListeners).forEach((eventName => {
                swiper.off(eventName);
            }));
            if (false !== deleteInstance) {
                swiper.$el[0].swiper = null;
                deleteProps(swiper);
            }
            swiper.destroyed = true;
            return null;
        }
        static extendDefaults(newDefaults) {
            utils_extend(extendedDefaults, newDefaults);
        }
        static get extendedDefaults() {
            return extendedDefaults;
        }
        static get defaults() {
            return defaults;
        }
        static installModule(mod) {
            if (!Swiper.prototype.__modules__) Swiper.prototype.__modules__ = [];
            const modules = Swiper.prototype.__modules__;
            if ("function" === typeof mod && modules.indexOf(mod) < 0) modules.push(mod);
        }
        static use(module) {
            if (Array.isArray(module)) {
                module.forEach((m => Swiper.installModule(m)));
                return Swiper;
            }
            Swiper.installModule(module);
            return Swiper;
        }
    }
    Object.keys(prototypes).forEach((prototypeGroup => {
        Object.keys(prototypes[prototypeGroup]).forEach((protoMethod => {
            Swiper.prototype[protoMethod] = prototypes[prototypeGroup][protoMethod];
        }));
    }));
    Swiper.use([ Resize, Observer ]);
    const core = Swiper;
    function create_element_if_not_defined_createElementIfNotDefined(swiper, originalParams, params, checkProps) {
        const document = ssr_window_esm_getDocument();
        if (swiper.params.createElements) Object.keys(checkProps).forEach((key => {
            if (!params[key] && true === params.auto) {
                let element = swiper.$el.children(`.${checkProps[key]}`)[0];
                if (!element) {
                    element = document.createElement("div");
                    element.className = checkProps[key];
                    swiper.$el.append(element);
                }
                params[key] = element;
                originalParams[key] = element;
            }
        }));
        return params;
    }
    function Navigation(_ref) {
        let {swiper, extendParams, on, emit} = _ref;
        extendParams({
            navigation: {
                nextEl: null,
                prevEl: null,
                hideOnClick: false,
                disabledClass: "swiper-button-disabled",
                hiddenClass: "swiper-button-hidden",
                lockClass: "swiper-button-lock",
                navigationDisabledClass: "swiper-navigation-disabled"
            }
        });
        swiper.navigation = {
            nextEl: null,
            $nextEl: null,
            prevEl: null,
            $prevEl: null
        };
        function getEl(el) {
            let $el;
            if (el) {
                $el = dom(el);
                if (swiper.params.uniqueNavElements && "string" === typeof el && $el.length > 1 && 1 === swiper.$el.find(el).length) $el = swiper.$el.find(el);
            }
            return $el;
        }
        function toggleEl($el, disabled) {
            const params = swiper.params.navigation;
            if ($el && $el.length > 0) {
                $el[disabled ? "addClass" : "removeClass"](params.disabledClass);
                if ($el[0] && "BUTTON" === $el[0].tagName) $el[0].disabled = disabled;
                if (swiper.params.watchOverflow && swiper.enabled) $el[swiper.isLocked ? "addClass" : "removeClass"](params.lockClass);
            }
        }
        function update() {
            if (swiper.params.loop) return;
            const {$nextEl, $prevEl} = swiper.navigation;
            toggleEl($prevEl, swiper.isBeginning && !swiper.params.rewind);
            toggleEl($nextEl, swiper.isEnd && !swiper.params.rewind);
        }
        function onPrevClick(e) {
            e.preventDefault();
            if (swiper.isBeginning && !swiper.params.loop && !swiper.params.rewind) return;
            swiper.slidePrev();
            emit("navigationPrev");
        }
        function onNextClick(e) {
            e.preventDefault();
            if (swiper.isEnd && !swiper.params.loop && !swiper.params.rewind) return;
            swiper.slideNext();
            emit("navigationNext");
        }
        function init() {
            const params = swiper.params.navigation;
            swiper.params.navigation = create_element_if_not_defined_createElementIfNotDefined(swiper, swiper.originalParams.navigation, swiper.params.navigation, {
                nextEl: "swiper-button-next",
                prevEl: "swiper-button-prev"
            });
            if (!(params.nextEl || params.prevEl)) return;
            const $nextEl = getEl(params.nextEl);
            const $prevEl = getEl(params.prevEl);
            if ($nextEl && $nextEl.length > 0) $nextEl.on("click", onNextClick);
            if ($prevEl && $prevEl.length > 0) $prevEl.on("click", onPrevClick);
            Object.assign(swiper.navigation, {
                $nextEl,
                nextEl: $nextEl && $nextEl[0],
                $prevEl,
                prevEl: $prevEl && $prevEl[0]
            });
            if (!swiper.enabled) {
                if ($nextEl) $nextEl.addClass(params.lockClass);
                if ($prevEl) $prevEl.addClass(params.lockClass);
            }
        }
        function destroy() {
            const {$nextEl, $prevEl} = swiper.navigation;
            if ($nextEl && $nextEl.length) {
                $nextEl.off("click", onNextClick);
                $nextEl.removeClass(swiper.params.navigation.disabledClass);
            }
            if ($prevEl && $prevEl.length) {
                $prevEl.off("click", onPrevClick);
                $prevEl.removeClass(swiper.params.navigation.disabledClass);
            }
        }
        on("init", (() => {
            if (false === swiper.params.navigation.enabled) disable(); else {
                init();
                update();
            }
        }));
        on("toEdge fromEdge lock unlock", (() => {
            update();
        }));
        on("destroy", (() => {
            destroy();
        }));
        on("enable disable", (() => {
            const {$nextEl, $prevEl} = swiper.navigation;
            if ($nextEl) $nextEl[swiper.enabled ? "removeClass" : "addClass"](swiper.params.navigation.lockClass);
            if ($prevEl) $prevEl[swiper.enabled ? "removeClass" : "addClass"](swiper.params.navigation.lockClass);
        }));
        on("click", ((_s, e) => {
            const {$nextEl, $prevEl} = swiper.navigation;
            const targetEl = e.target;
            if (swiper.params.navigation.hideOnClick && !dom(targetEl).is($prevEl) && !dom(targetEl).is($nextEl)) {
                if (swiper.pagination && swiper.params.pagination && swiper.params.pagination.clickable && (swiper.pagination.el === targetEl || swiper.pagination.el.contains(targetEl))) return;
                let isHidden;
                if ($nextEl) isHidden = $nextEl.hasClass(swiper.params.navigation.hiddenClass); else if ($prevEl) isHidden = $prevEl.hasClass(swiper.params.navigation.hiddenClass);
                if (true === isHidden) emit("navigationShow"); else emit("navigationHide");
                if ($nextEl) $nextEl.toggleClass(swiper.params.navigation.hiddenClass);
                if ($prevEl) $prevEl.toggleClass(swiper.params.navigation.hiddenClass);
            }
        }));
        const enable = () => {
            swiper.$el.removeClass(swiper.params.navigation.navigationDisabledClass);
            init();
            update();
        };
        const disable = () => {
            swiper.$el.addClass(swiper.params.navigation.navigationDisabledClass);
            destroy();
        };
        Object.assign(swiper.navigation, {
            enable,
            disable,
            update,
            init,
            destroy
        });
    }
    function classes_to_selector_classesToSelector(classes) {
        if (void 0 === classes) classes = "";
        return `.${classes.trim().replace(/([\.:!\/])/g, "\\$1").replace(/ /g, ".")}`;
    }
    function Pagination(_ref) {
        let {swiper, extendParams, on, emit} = _ref;
        const pfx = "swiper-pagination";
        extendParams({
            pagination: {
                el: null,
                bulletElement: "span",
                clickable: false,
                hideOnClick: false,
                renderBullet: null,
                renderProgressbar: null,
                renderFraction: null,
                renderCustom: null,
                progressbarOpposite: false,
                type: "bullets",
                dynamicBullets: false,
                dynamicMainBullets: 1,
                formatFractionCurrent: number => number,
                formatFractionTotal: number => number,
                bulletClass: `${pfx}-bullet`,
                bulletActiveClass: `${pfx}-bullet-active`,
                modifierClass: `${pfx}-`,
                currentClass: `${pfx}-current`,
                totalClass: `${pfx}-total`,
                hiddenClass: `${pfx}-hidden`,
                progressbarFillClass: `${pfx}-progressbar-fill`,
                progressbarOppositeClass: `${pfx}-progressbar-opposite`,
                clickableClass: `${pfx}-clickable`,
                lockClass: `${pfx}-lock`,
                horizontalClass: `${pfx}-horizontal`,
                verticalClass: `${pfx}-vertical`,
                paginationDisabledClass: `${pfx}-disabled`
            }
        });
        swiper.pagination = {
            el: null,
            $el: null,
            bullets: []
        };
        let bulletSize;
        let dynamicBulletIndex = 0;
        function isPaginationDisabled() {
            return !swiper.params.pagination.el || !swiper.pagination.el || !swiper.pagination.$el || 0 === swiper.pagination.$el.length;
        }
        function setSideBullets($bulletEl, position) {
            const {bulletActiveClass} = swiper.params.pagination;
            $bulletEl[position]().addClass(`${bulletActiveClass}-${position}`)[position]().addClass(`${bulletActiveClass}-${position}-${position}`);
        }
        function update() {
            const rtl = swiper.rtl;
            const params = swiper.params.pagination;
            if (isPaginationDisabled()) return;
            const slidesLength = swiper.virtual && swiper.params.virtual.enabled ? swiper.virtual.slides.length : swiper.slides.length;
            const $el = swiper.pagination.$el;
            let current;
            const total = swiper.params.loop ? Math.ceil((slidesLength - 2 * swiper.loopedSlides) / swiper.params.slidesPerGroup) : swiper.snapGrid.length;
            if (swiper.params.loop) {
                current = Math.ceil((swiper.activeIndex - swiper.loopedSlides) / swiper.params.slidesPerGroup);
                if (current > slidesLength - 1 - 2 * swiper.loopedSlides) current -= slidesLength - 2 * swiper.loopedSlides;
                if (current > total - 1) current -= total;
                if (current < 0 && "bullets" !== swiper.params.paginationType) current = total + current;
            } else if ("undefined" !== typeof swiper.snapIndex) current = swiper.snapIndex; else current = swiper.activeIndex || 0;
            if ("bullets" === params.type && swiper.pagination.bullets && swiper.pagination.bullets.length > 0) {
                const bullets = swiper.pagination.bullets;
                let firstIndex;
                let lastIndex;
                let midIndex;
                if (params.dynamicBullets) {
                    bulletSize = bullets.eq(0)[swiper.isHorizontal() ? "outerWidth" : "outerHeight"](true);
                    $el.css(swiper.isHorizontal() ? "width" : "height", `${bulletSize * (params.dynamicMainBullets + 4)}px`);
                    if (params.dynamicMainBullets > 1 && void 0 !== swiper.previousIndex) {
                        dynamicBulletIndex += current - (swiper.previousIndex - swiper.loopedSlides || 0);
                        if (dynamicBulletIndex > params.dynamicMainBullets - 1) dynamicBulletIndex = params.dynamicMainBullets - 1; else if (dynamicBulletIndex < 0) dynamicBulletIndex = 0;
                    }
                    firstIndex = Math.max(current - dynamicBulletIndex, 0);
                    lastIndex = firstIndex + (Math.min(bullets.length, params.dynamicMainBullets) - 1);
                    midIndex = (lastIndex + firstIndex) / 2;
                }
                bullets.removeClass([ "", "-next", "-next-next", "-prev", "-prev-prev", "-main" ].map((suffix => `${params.bulletActiveClass}${suffix}`)).join(" "));
                if ($el.length > 1) bullets.each((bullet => {
                    const $bullet = dom(bullet);
                    const bulletIndex = $bullet.index();
                    if (bulletIndex === current) $bullet.addClass(params.bulletActiveClass);
                    if (params.dynamicBullets) {
                        if (bulletIndex >= firstIndex && bulletIndex <= lastIndex) $bullet.addClass(`${params.bulletActiveClass}-main`);
                        if (bulletIndex === firstIndex) setSideBullets($bullet, "prev");
                        if (bulletIndex === lastIndex) setSideBullets($bullet, "next");
                    }
                })); else {
                    const $bullet = bullets.eq(current);
                    const bulletIndex = $bullet.index();
                    $bullet.addClass(params.bulletActiveClass);
                    if (params.dynamicBullets) {
                        const $firstDisplayedBullet = bullets.eq(firstIndex);
                        const $lastDisplayedBullet = bullets.eq(lastIndex);
                        for (let i = firstIndex; i <= lastIndex; i += 1) bullets.eq(i).addClass(`${params.bulletActiveClass}-main`);
                        if (swiper.params.loop) if (bulletIndex >= bullets.length) {
                            for (let i = params.dynamicMainBullets; i >= 0; i -= 1) bullets.eq(bullets.length - i).addClass(`${params.bulletActiveClass}-main`);
                            bullets.eq(bullets.length - params.dynamicMainBullets - 1).addClass(`${params.bulletActiveClass}-prev`);
                        } else {
                            setSideBullets($firstDisplayedBullet, "prev");
                            setSideBullets($lastDisplayedBullet, "next");
                        } else {
                            setSideBullets($firstDisplayedBullet, "prev");
                            setSideBullets($lastDisplayedBullet, "next");
                        }
                    }
                }
                if (params.dynamicBullets) {
                    const dynamicBulletsLength = Math.min(bullets.length, params.dynamicMainBullets + 4);
                    const bulletsOffset = (bulletSize * dynamicBulletsLength - bulletSize) / 2 - midIndex * bulletSize;
                    const offsetProp = rtl ? "right" : "left";
                    bullets.css(swiper.isHorizontal() ? offsetProp : "top", `${bulletsOffset}px`);
                }
            }
            if ("fraction" === params.type) {
                $el.find(classes_to_selector_classesToSelector(params.currentClass)).text(params.formatFractionCurrent(current + 1));
                $el.find(classes_to_selector_classesToSelector(params.totalClass)).text(params.formatFractionTotal(total));
            }
            if ("progressbar" === params.type) {
                let progressbarDirection;
                if (params.progressbarOpposite) progressbarDirection = swiper.isHorizontal() ? "vertical" : "horizontal"; else progressbarDirection = swiper.isHorizontal() ? "horizontal" : "vertical";
                const scale = (current + 1) / total;
                let scaleX = 1;
                let scaleY = 1;
                if ("horizontal" === progressbarDirection) scaleX = scale; else scaleY = scale;
                $el.find(classes_to_selector_classesToSelector(params.progressbarFillClass)).transform(`translate3d(0,0,0) scaleX(${scaleX}) scaleY(${scaleY})`).transition(swiper.params.speed);
            }
            if ("custom" === params.type && params.renderCustom) {
                $el.html(params.renderCustom(swiper, current + 1, total));
                emit("paginationRender", $el[0]);
            } else emit("paginationUpdate", $el[0]);
            if (swiper.params.watchOverflow && swiper.enabled) $el[swiper.isLocked ? "addClass" : "removeClass"](params.lockClass);
        }
        function render() {
            const params = swiper.params.pagination;
            if (isPaginationDisabled()) return;
            const slidesLength = swiper.virtual && swiper.params.virtual.enabled ? swiper.virtual.slides.length : swiper.slides.length;
            const $el = swiper.pagination.$el;
            let paginationHTML = "";
            if ("bullets" === params.type) {
                let numberOfBullets = swiper.params.loop ? Math.ceil((slidesLength - 2 * swiper.loopedSlides) / swiper.params.slidesPerGroup) : swiper.snapGrid.length;
                if (swiper.params.freeMode && swiper.params.freeMode.enabled && !swiper.params.loop && numberOfBullets > slidesLength) numberOfBullets = slidesLength;
                for (let i = 0; i < numberOfBullets; i += 1) if (params.renderBullet) paginationHTML += params.renderBullet.call(swiper, i, params.bulletClass); else paginationHTML += `<${params.bulletElement} class="${params.bulletClass}"></${params.bulletElement}>`;
                $el.html(paginationHTML);
                swiper.pagination.bullets = $el.find(classes_to_selector_classesToSelector(params.bulletClass));
            }
            if ("fraction" === params.type) {
                if (params.renderFraction) paginationHTML = params.renderFraction.call(swiper, params.currentClass, params.totalClass); else paginationHTML = `<span class="${params.currentClass}"></span>` + " / " + `<span class="${params.totalClass}"></span>`;
                $el.html(paginationHTML);
            }
            if ("progressbar" === params.type) {
                if (params.renderProgressbar) paginationHTML = params.renderProgressbar.call(swiper, params.progressbarFillClass); else paginationHTML = `<span class="${params.progressbarFillClass}"></span>`;
                $el.html(paginationHTML);
            }
            if ("custom" !== params.type) emit("paginationRender", swiper.pagination.$el[0]);
        }
        function init() {
            swiper.params.pagination = create_element_if_not_defined_createElementIfNotDefined(swiper, swiper.originalParams.pagination, swiper.params.pagination, {
                el: "swiper-pagination"
            });
            const params = swiper.params.pagination;
            if (!params.el) return;
            let $el = dom(params.el);
            if (0 === $el.length) return;
            if (swiper.params.uniqueNavElements && "string" === typeof params.el && $el.length > 1) {
                $el = swiper.$el.find(params.el);
                if ($el.length > 1) $el = $el.filter((el => {
                    if (dom(el).parents(".swiper")[0] !== swiper.el) return false;
                    return true;
                }));
            }
            if ("bullets" === params.type && params.clickable) $el.addClass(params.clickableClass);
            $el.addClass(params.modifierClass + params.type);
            $el.addClass(swiper.isHorizontal() ? params.horizontalClass : params.verticalClass);
            if ("bullets" === params.type && params.dynamicBullets) {
                $el.addClass(`${params.modifierClass}${params.type}-dynamic`);
                dynamicBulletIndex = 0;
                if (params.dynamicMainBullets < 1) params.dynamicMainBullets = 1;
            }
            if ("progressbar" === params.type && params.progressbarOpposite) $el.addClass(params.progressbarOppositeClass);
            if (params.clickable) $el.on("click", classes_to_selector_classesToSelector(params.bulletClass), (function onClick(e) {
                e.preventDefault();
                let index = dom(this).index() * swiper.params.slidesPerGroup;
                if (swiper.params.loop) index += swiper.loopedSlides;
                swiper.slideTo(index);
            }));
            Object.assign(swiper.pagination, {
                $el,
                el: $el[0]
            });
            if (!swiper.enabled) $el.addClass(params.lockClass);
        }
        function destroy() {
            const params = swiper.params.pagination;
            if (isPaginationDisabled()) return;
            const $el = swiper.pagination.$el;
            $el.removeClass(params.hiddenClass);
            $el.removeClass(params.modifierClass + params.type);
            $el.removeClass(swiper.isHorizontal() ? params.horizontalClass : params.verticalClass);
            if (swiper.pagination.bullets && swiper.pagination.bullets.removeClass) swiper.pagination.bullets.removeClass(params.bulletActiveClass);
            if (params.clickable) $el.off("click", classes_to_selector_classesToSelector(params.bulletClass));
        }
        on("init", (() => {
            if (false === swiper.params.pagination.enabled) disable(); else {
                init();
                render();
                update();
            }
        }));
        on("activeIndexChange", (() => {
            if (swiper.params.loop) update(); else if ("undefined" === typeof swiper.snapIndex) update();
        }));
        on("snapIndexChange", (() => {
            if (!swiper.params.loop) update();
        }));
        on("slidesLengthChange", (() => {
            if (swiper.params.loop) {
                render();
                update();
            }
        }));
        on("snapGridLengthChange", (() => {
            if (!swiper.params.loop) {
                render();
                update();
            }
        }));
        on("destroy", (() => {
            destroy();
        }));
        on("enable disable", (() => {
            const {$el} = swiper.pagination;
            if ($el) $el[swiper.enabled ? "removeClass" : "addClass"](swiper.params.pagination.lockClass);
        }));
        on("lock unlock", (() => {
            update();
        }));
        on("click", ((_s, e) => {
            const targetEl = e.target;
            const {$el} = swiper.pagination;
            if (swiper.params.pagination.el && swiper.params.pagination.hideOnClick && $el && $el.length > 0 && !dom(targetEl).hasClass(swiper.params.pagination.bulletClass)) {
                if (swiper.navigation && (swiper.navigation.nextEl && targetEl === swiper.navigation.nextEl || swiper.navigation.prevEl && targetEl === swiper.navigation.prevEl)) return;
                const isHidden = $el.hasClass(swiper.params.pagination.hiddenClass);
                if (true === isHidden) emit("paginationShow"); else emit("paginationHide");
                $el.toggleClass(swiper.params.pagination.hiddenClass);
            }
        }));
        const enable = () => {
            swiper.$el.removeClass(swiper.params.pagination.paginationDisabledClass);
            if (swiper.pagination.$el) swiper.pagination.$el.removeClass(swiper.params.pagination.paginationDisabledClass);
            init();
            render();
            update();
        };
        const disable = () => {
            swiper.$el.addClass(swiper.params.pagination.paginationDisabledClass);
            if (swiper.pagination.$el) swiper.pagination.$el.addClass(swiper.params.pagination.paginationDisabledClass);
            destroy();
        };
        Object.assign(swiper.pagination, {
            enable,
            disable,
            render,
            update,
            init,
            destroy
        });
    }
    function Thumb(_ref) {
        let {swiper, extendParams, on} = _ref;
        extendParams({
            thumbs: {
                swiper: null,
                multipleActiveThumbs: true,
                autoScrollOffset: 0,
                slideThumbActiveClass: "swiper-slide-thumb-active",
                thumbsContainerClass: "swiper-thumbs"
            }
        });
        let initialized = false;
        let swiperCreated = false;
        swiper.thumbs = {
            swiper: null
        };
        function onThumbClick() {
            const thumbsSwiper = swiper.thumbs.swiper;
            if (!thumbsSwiper || thumbsSwiper.destroyed) return;
            const clickedIndex = thumbsSwiper.clickedIndex;
            const clickedSlide = thumbsSwiper.clickedSlide;
            if (clickedSlide && dom(clickedSlide).hasClass(swiper.params.thumbs.slideThumbActiveClass)) return;
            if ("undefined" === typeof clickedIndex || null === clickedIndex) return;
            let slideToIndex;
            if (thumbsSwiper.params.loop) slideToIndex = parseInt(dom(thumbsSwiper.clickedSlide).attr("data-swiper-slide-index"), 10); else slideToIndex = clickedIndex;
            if (swiper.params.loop) {
                let currentIndex = swiper.activeIndex;
                if (swiper.slides.eq(currentIndex).hasClass(swiper.params.slideDuplicateClass)) {
                    swiper.loopFix();
                    swiper._clientLeft = swiper.$wrapperEl[0].clientLeft;
                    currentIndex = swiper.activeIndex;
                }
                const prevIndex = swiper.slides.eq(currentIndex).prevAll(`[data-swiper-slide-index="${slideToIndex}"]`).eq(0).index();
                const nextIndex = swiper.slides.eq(currentIndex).nextAll(`[data-swiper-slide-index="${slideToIndex}"]`).eq(0).index();
                if ("undefined" === typeof prevIndex) slideToIndex = nextIndex; else if ("undefined" === typeof nextIndex) slideToIndex = prevIndex; else if (nextIndex - currentIndex < currentIndex - prevIndex) slideToIndex = nextIndex; else slideToIndex = prevIndex;
            }
            swiper.slideTo(slideToIndex);
        }
        function init() {
            const {thumbs: thumbsParams} = swiper.params;
            if (initialized) return false;
            initialized = true;
            const SwiperClass = swiper.constructor;
            if (thumbsParams.swiper instanceof SwiperClass) {
                swiper.thumbs.swiper = thumbsParams.swiper;
                Object.assign(swiper.thumbs.swiper.originalParams, {
                    watchSlidesProgress: true,
                    slideToClickedSlide: false
                });
                Object.assign(swiper.thumbs.swiper.params, {
                    watchSlidesProgress: true,
                    slideToClickedSlide: false
                });
            } else if (utils_isObject(thumbsParams.swiper)) {
                const thumbsSwiperParams = Object.assign({}, thumbsParams.swiper);
                Object.assign(thumbsSwiperParams, {
                    watchSlidesProgress: true,
                    slideToClickedSlide: false
                });
                swiper.thumbs.swiper = new SwiperClass(thumbsSwiperParams);
                swiperCreated = true;
            }
            swiper.thumbs.swiper.$el.addClass(swiper.params.thumbs.thumbsContainerClass);
            swiper.thumbs.swiper.on("tap", onThumbClick);
            return true;
        }
        function update(initial) {
            const thumbsSwiper = swiper.thumbs.swiper;
            if (!thumbsSwiper || thumbsSwiper.destroyed) return;
            const slidesPerView = "auto" === thumbsSwiper.params.slidesPerView ? thumbsSwiper.slidesPerViewDynamic() : thumbsSwiper.params.slidesPerView;
            let thumbsToActivate = 1;
            const thumbActiveClass = swiper.params.thumbs.slideThumbActiveClass;
            if (swiper.params.slidesPerView > 1 && !swiper.params.centeredSlides) thumbsToActivate = swiper.params.slidesPerView;
            if (!swiper.params.thumbs.multipleActiveThumbs) thumbsToActivate = 1;
            thumbsToActivate = Math.floor(thumbsToActivate);
            thumbsSwiper.slides.removeClass(thumbActiveClass);
            if (thumbsSwiper.params.loop || thumbsSwiper.params.virtual && thumbsSwiper.params.virtual.enabled) for (let i = 0; i < thumbsToActivate; i += 1) thumbsSwiper.$wrapperEl.children(`[data-swiper-slide-index="${swiper.realIndex + i}"]`).addClass(thumbActiveClass); else for (let i = 0; i < thumbsToActivate; i += 1) thumbsSwiper.slides.eq(swiper.realIndex + i).addClass(thumbActiveClass);
            const autoScrollOffset = swiper.params.thumbs.autoScrollOffset;
            const useOffset = autoScrollOffset && !thumbsSwiper.params.loop;
            if (swiper.realIndex !== thumbsSwiper.realIndex || useOffset) {
                let currentThumbsIndex = thumbsSwiper.activeIndex;
                let newThumbsIndex;
                let direction;
                if (thumbsSwiper.params.loop) {
                    if (thumbsSwiper.slides.eq(currentThumbsIndex).hasClass(thumbsSwiper.params.slideDuplicateClass)) {
                        thumbsSwiper.loopFix();
                        thumbsSwiper._clientLeft = thumbsSwiper.$wrapperEl[0].clientLeft;
                        currentThumbsIndex = thumbsSwiper.activeIndex;
                    }
                    const prevThumbsIndex = thumbsSwiper.slides.eq(currentThumbsIndex).prevAll(`[data-swiper-slide-index="${swiper.realIndex}"]`).eq(0).index();
                    const nextThumbsIndex = thumbsSwiper.slides.eq(currentThumbsIndex).nextAll(`[data-swiper-slide-index="${swiper.realIndex}"]`).eq(0).index();
                    if ("undefined" === typeof prevThumbsIndex) newThumbsIndex = nextThumbsIndex; else if ("undefined" === typeof nextThumbsIndex) newThumbsIndex = prevThumbsIndex; else if (nextThumbsIndex - currentThumbsIndex === currentThumbsIndex - prevThumbsIndex) newThumbsIndex = thumbsSwiper.params.slidesPerGroup > 1 ? nextThumbsIndex : currentThumbsIndex; else if (nextThumbsIndex - currentThumbsIndex < currentThumbsIndex - prevThumbsIndex) newThumbsIndex = nextThumbsIndex; else newThumbsIndex = prevThumbsIndex;
                    direction = swiper.activeIndex > swiper.previousIndex ? "next" : "prev";
                } else {
                    newThumbsIndex = swiper.realIndex;
                    direction = newThumbsIndex > swiper.previousIndex ? "next" : "prev";
                }
                if (useOffset) newThumbsIndex += "next" === direction ? autoScrollOffset : -1 * autoScrollOffset;
                if (thumbsSwiper.visibleSlidesIndexes && thumbsSwiper.visibleSlidesIndexes.indexOf(newThumbsIndex) < 0) {
                    if (thumbsSwiper.params.centeredSlides) if (newThumbsIndex > currentThumbsIndex) newThumbsIndex = newThumbsIndex - Math.floor(slidesPerView / 2) + 1; else newThumbsIndex = newThumbsIndex + Math.floor(slidesPerView / 2) - 1; else if (newThumbsIndex > currentThumbsIndex && 1 === thumbsSwiper.params.slidesPerGroup) ;
                    thumbsSwiper.slideTo(newThumbsIndex, initial ? 0 : void 0);
                }
            }
        }
        on("beforeInit", (() => {
            const {thumbs} = swiper.params;
            if (!thumbs || !thumbs.swiper) return;
            init();
            update(true);
        }));
        on("slideChange update resize observerUpdate", (() => {
            update();
        }));
        on("setTransition", ((_s, duration) => {
            const thumbsSwiper = swiper.thumbs.swiper;
            if (!thumbsSwiper || thumbsSwiper.destroyed) return;
            thumbsSwiper.setTransition(duration);
        }));
        on("beforeDestroy", (() => {
            const thumbsSwiper = swiper.thumbs.swiper;
            if (!thumbsSwiper || thumbsSwiper.destroyed) return;
            if (swiperCreated) thumbsSwiper.destroy();
        }));
        Object.assign(swiper.thumbs, {
            init,
            update
        });
    }
    function Grid(_ref) {
        let {swiper, extendParams} = _ref;
        extendParams({
            grid: {
                rows: 1,
                fill: "column"
            }
        });
        let slidesNumberEvenToRows;
        let slidesPerRow;
        let numFullColumns;
        const initSlides = slidesLength => {
            const {slidesPerView} = swiper.params;
            const {rows, fill} = swiper.params.grid;
            slidesPerRow = slidesNumberEvenToRows / rows;
            numFullColumns = Math.floor(slidesLength / rows);
            if (Math.floor(slidesLength / rows) === slidesLength / rows) slidesNumberEvenToRows = slidesLength; else slidesNumberEvenToRows = Math.ceil(slidesLength / rows) * rows;
            if ("auto" !== slidesPerView && "row" === fill) slidesNumberEvenToRows = Math.max(slidesNumberEvenToRows, slidesPerView * rows);
        };
        const updateSlide = (i, slide, slidesLength, getDirectionLabel) => {
            const {slidesPerGroup, spaceBetween} = swiper.params;
            const {rows, fill} = swiper.params.grid;
            let newSlideOrderIndex;
            let column;
            let row;
            if ("row" === fill && slidesPerGroup > 1) {
                const groupIndex = Math.floor(i / (slidesPerGroup * rows));
                const slideIndexInGroup = i - rows * slidesPerGroup * groupIndex;
                const columnsInGroup = 0 === groupIndex ? slidesPerGroup : Math.min(Math.ceil((slidesLength - groupIndex * rows * slidesPerGroup) / rows), slidesPerGroup);
                row = Math.floor(slideIndexInGroup / columnsInGroup);
                column = slideIndexInGroup - row * columnsInGroup + groupIndex * slidesPerGroup;
                newSlideOrderIndex = column + row * slidesNumberEvenToRows / rows;
                slide.css({
                    "-webkit-order": newSlideOrderIndex,
                    order: newSlideOrderIndex
                });
            } else if ("column" === fill) {
                column = Math.floor(i / rows);
                row = i - column * rows;
                if (column > numFullColumns || column === numFullColumns && row === rows - 1) {
                    row += 1;
                    if (row >= rows) {
                        row = 0;
                        column += 1;
                    }
                }
            } else {
                row = Math.floor(i / slidesPerRow);
                column = i - row * slidesPerRow;
            }
            slide.css(getDirectionLabel("margin-top"), 0 !== row ? spaceBetween && `${spaceBetween}px` : "");
        };
        const updateWrapperSize = (slideSize, snapGrid, getDirectionLabel) => {
            const {spaceBetween, centeredSlides, roundLengths} = swiper.params;
            const {rows} = swiper.params.grid;
            swiper.virtualSize = (slideSize + spaceBetween) * slidesNumberEvenToRows;
            swiper.virtualSize = Math.ceil(swiper.virtualSize / rows) - spaceBetween;
            swiper.$wrapperEl.css({
                [getDirectionLabel("width")]: `${swiper.virtualSize + spaceBetween}px`
            });
            if (centeredSlides) {
                snapGrid.splice(0, snapGrid.length);
                const newSlidesGrid = [];
                for (let i = 0; i < snapGrid.length; i += 1) {
                    let slidesGridItem = snapGrid[i];
                    if (roundLengths) slidesGridItem = Math.floor(slidesGridItem);
                    if (snapGrid[i] < swiper.virtualSize + snapGrid[0]) newSlidesGrid.push(slidesGridItem);
                }
                snapGrid.push(...newSlidesGrid);
            }
        };
        swiper.grid = {
            initSlides,
            updateSlide,
            updateWrapperSize
        };
    }
    function appendSlide(slides) {
        const swiper = this;
        const {$wrapperEl, params} = swiper;
        if (params.loop) swiper.loopDestroy();
        if ("object" === typeof slides && "length" in slides) {
            for (let i = 0; i < slides.length; i += 1) if (slides[i]) $wrapperEl.append(slides[i]);
        } else $wrapperEl.append(slides);
        if (params.loop) swiper.loopCreate();
        if (!params.observer) swiper.update();
    }
    function prependSlide(slides) {
        const swiper = this;
        const {params, $wrapperEl, activeIndex} = swiper;
        if (params.loop) swiper.loopDestroy();
        let newActiveIndex = activeIndex + 1;
        if ("object" === typeof slides && "length" in slides) {
            for (let i = 0; i < slides.length; i += 1) if (slides[i]) $wrapperEl.prepend(slides[i]);
            newActiveIndex = activeIndex + slides.length;
        } else $wrapperEl.prepend(slides);
        if (params.loop) swiper.loopCreate();
        if (!params.observer) swiper.update();
        swiper.slideTo(newActiveIndex, 0, false);
    }
    function addSlide(index, slides) {
        const swiper = this;
        const {$wrapperEl, params, activeIndex} = swiper;
        let activeIndexBuffer = activeIndex;
        if (params.loop) {
            activeIndexBuffer -= swiper.loopedSlides;
            swiper.loopDestroy();
            swiper.slides = $wrapperEl.children(`.${params.slideClass}`);
        }
        const baseLength = swiper.slides.length;
        if (index <= 0) {
            swiper.prependSlide(slides);
            return;
        }
        if (index >= baseLength) {
            swiper.appendSlide(slides);
            return;
        }
        let newActiveIndex = activeIndexBuffer > index ? activeIndexBuffer + 1 : activeIndexBuffer;
        const slidesBuffer = [];
        for (let i = baseLength - 1; i >= index; i -= 1) {
            const currentSlide = swiper.slides.eq(i);
            currentSlide.remove();
            slidesBuffer.unshift(currentSlide);
        }
        if ("object" === typeof slides && "length" in slides) {
            for (let i = 0; i < slides.length; i += 1) if (slides[i]) $wrapperEl.append(slides[i]);
            newActiveIndex = activeIndexBuffer > index ? activeIndexBuffer + slides.length : activeIndexBuffer;
        } else $wrapperEl.append(slides);
        for (let i = 0; i < slidesBuffer.length; i += 1) $wrapperEl.append(slidesBuffer[i]);
        if (params.loop) swiper.loopCreate();
        if (!params.observer) swiper.update();
        if (params.loop) swiper.slideTo(newActiveIndex + swiper.loopedSlides, 0, false); else swiper.slideTo(newActiveIndex, 0, false);
    }
    function removeSlide(slidesIndexes) {
        const swiper = this;
        const {params, $wrapperEl, activeIndex} = swiper;
        let activeIndexBuffer = activeIndex;
        if (params.loop) {
            activeIndexBuffer -= swiper.loopedSlides;
            swiper.loopDestroy();
            swiper.slides = $wrapperEl.children(`.${params.slideClass}`);
        }
        let newActiveIndex = activeIndexBuffer;
        let indexToRemove;
        if ("object" === typeof slidesIndexes && "length" in slidesIndexes) {
            for (let i = 0; i < slidesIndexes.length; i += 1) {
                indexToRemove = slidesIndexes[i];
                if (swiper.slides[indexToRemove]) swiper.slides.eq(indexToRemove).remove();
                if (indexToRemove < newActiveIndex) newActiveIndex -= 1;
            }
            newActiveIndex = Math.max(newActiveIndex, 0);
        } else {
            indexToRemove = slidesIndexes;
            if (swiper.slides[indexToRemove]) swiper.slides.eq(indexToRemove).remove();
            if (indexToRemove < newActiveIndex) newActiveIndex -= 1;
            newActiveIndex = Math.max(newActiveIndex, 0);
        }
        if (params.loop) swiper.loopCreate();
        if (!params.observer) swiper.update();
        if (params.loop) swiper.slideTo(newActiveIndex + swiper.loopedSlides, 0, false); else swiper.slideTo(newActiveIndex, 0, false);
    }
    function removeAllSlides() {
        const swiper = this;
        const slidesIndexes = [];
        for (let i = 0; i < swiper.slides.length; i += 1) slidesIndexes.push(i);
        swiper.removeSlide(slidesIndexes);
    }
    function Manipulation(_ref) {
        let {swiper} = _ref;
        Object.assign(swiper, {
            appendSlide: appendSlide.bind(swiper),
            prependSlide: prependSlide.bind(swiper),
            addSlide: addSlide.bind(swiper),
            removeSlide: removeSlide.bind(swiper),
            removeAllSlides: removeAllSlides.bind(swiper)
        });
    }
    function effect_init_effectInit(params) {
        const {effect, swiper, on, setTranslate, setTransition, overwriteParams, perspective, recreateShadows, getEffectParams} = params;
        on("beforeInit", (() => {
            if (swiper.params.effect !== effect) return;
            swiper.classNames.push(`${swiper.params.containerModifierClass}${effect}`);
            if (perspective && perspective()) swiper.classNames.push(`${swiper.params.containerModifierClass}3d`);
            const overwriteParamsResult = overwriteParams ? overwriteParams() : {};
            Object.assign(swiper.params, overwriteParamsResult);
            Object.assign(swiper.originalParams, overwriteParamsResult);
        }));
        on("setTranslate", (() => {
            if (swiper.params.effect !== effect) return;
            setTranslate();
        }));
        on("setTransition", ((_s, duration) => {
            if (swiper.params.effect !== effect) return;
            setTransition(duration);
        }));
        on("transitionEnd", (() => {
            if (swiper.params.effect !== effect) return;
            if (recreateShadows) {
                if (!getEffectParams || !getEffectParams().slideShadows) return;
                swiper.slides.each((slideEl => {
                    const $slideEl = swiper.$(slideEl);
                    $slideEl.find(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").remove();
                }));
                recreateShadows();
            }
        }));
        let requireUpdateOnVirtual;
        on("virtualUpdate", (() => {
            if (swiper.params.effect !== effect) return;
            if (!swiper.slides.length) requireUpdateOnVirtual = true;
            requestAnimationFrame((() => {
                if (requireUpdateOnVirtual && swiper.slides && swiper.slides.length) {
                    setTranslate();
                    requireUpdateOnVirtual = false;
                }
            }));
        }));
    }
    function effect_target_effectTarget(effectParams, $slideEl) {
        if (effectParams.transformEl) return $slideEl.find(effectParams.transformEl).css({
            "backface-visibility": "hidden",
            "-webkit-backface-visibility": "hidden"
        });
        return $slideEl;
    }
    function effect_virtual_transition_end_effectVirtualTransitionEnd(_ref) {
        let {swiper, duration, transformEl, allSlides} = _ref;
        const {slides, activeIndex, $wrapperEl} = swiper;
        if (swiper.params.virtualTranslate && 0 !== duration) {
            let eventTriggered = false;
            let $transitionEndTarget;
            if (allSlides) $transitionEndTarget = transformEl ? slides.find(transformEl) : slides; else $transitionEndTarget = transformEl ? slides.eq(activeIndex).find(transformEl) : slides.eq(activeIndex);
            $transitionEndTarget.transitionEnd((() => {
                if (eventTriggered) return;
                if (!swiper || swiper.destroyed) return;
                eventTriggered = true;
                swiper.animating = false;
                const triggerEvents = [ "webkitTransitionEnd", "transitionend" ];
                for (let i = 0; i < triggerEvents.length; i += 1) $wrapperEl.trigger(triggerEvents[i]);
            }));
        }
    }
    function EffectFade(_ref) {
        let {swiper, extendParams, on} = _ref;
        extendParams({
            fadeEffect: {
                crossFade: false,
                transformEl: null
            }
        });
        const setTranslate = () => {
            const {slides} = swiper;
            const params = swiper.params.fadeEffect;
            for (let i = 0; i < slides.length; i += 1) {
                const $slideEl = swiper.slides.eq(i);
                const offset = $slideEl[0].swiperSlideOffset;
                let tx = -offset;
                if (!swiper.params.virtualTranslate) tx -= swiper.translate;
                let ty = 0;
                if (!swiper.isHorizontal()) {
                    ty = tx;
                    tx = 0;
                }
                const slideOpacity = swiper.params.fadeEffect.crossFade ? Math.max(1 - Math.abs($slideEl[0].progress), 0) : 1 + Math.min(Math.max($slideEl[0].progress, -1), 0);
                const $targetEl = effect_target_effectTarget(params, $slideEl);
                $targetEl.css({
                    opacity: slideOpacity
                }).transform(`translate3d(${tx}px, ${ty}px, 0px)`);
            }
        };
        const setTransition = duration => {
            const {transformEl} = swiper.params.fadeEffect;
            const $transitionElements = transformEl ? swiper.slides.find(transformEl) : swiper.slides;
            $transitionElements.transition(duration);
            effect_virtual_transition_end_effectVirtualTransitionEnd({
                swiper,
                duration,
                transformEl,
                allSlides: true
            });
        };
        effect_init_effectInit({
            effect: "fade",
            swiper,
            on,
            setTranslate,
            setTransition,
            overwriteParams: () => ({
                slidesPerView: 1,
                slidesPerGroup: 1,
                watchSlidesProgress: true,
                spaceBetween: 0,
                virtualTranslate: !swiper.params.cssMode
            })
        });
    }
    function initSliders() {
        if (document.querySelector(".success__slider")) new core(".success__slider", {
            modules: [ Navigation ],
            observer: true,
            observeParents: true,
            slidesPerView: 3,
            spaceBetween: 40,
            autoHeight: true,
            speed: 800,
            navigation: {
                prevEl: ".success__slider-arrow-prev",
                nextEl: ".success__slider-arrow-next"
            },
            breakpoints: {
                320: {
                    slidesPerView: "auto",
                    spaceBetween: 30,
                    autoHeight: true
                },
                768: {
                    slidesPerView: 3,
                    spaceBetween: 20
                },
                992: {
                    slidesPerView: 3,
                    spaceBetween: 30
                }
            }
        });
        if (document.querySelector(".cooperate__slider")) new core(".cooperate__slider", {
            modules: [ Navigation, Pagination ],
            observer: true,
            observeParents: true,
            speed: 800,
            navigation: {
                prevEl: ".cooperate__slider-arrow-prev",
                nextEl: ".cooperate__slider-arrow-next"
            },
            pagination: {
                el: ".swiper-pagination",
                clickable: true
            },
            breakpoints: {
                320: {
                    slidesPerView: 1,
                    spaceBetween: 0
                },
                768: {
                    slidesPerView: 2,
                    spaceBetween: 30
                }
            }
        });
        if (document.querySelector(".career__slider")) new core(".career__slider", {
            modules: [ Navigation, Pagination ],
            observer: true,
            observeParents: true,
            speed: 800,
            slidesPerView: "auto"
        });
        if (document.querySelector(".work__slider")) new core(".work__slider", {
            modules: [ Navigation, Pagination, Grid ],
            observer: true,
            observeParents: true,
            speed: 800,
            slidesPerView: 3,
            spaceBetween: 32,
            navigation: {
                prevEl: ".work__slider-arrow-prev",
                nextEl: ".work__slider-arrow-next"
            },
            grid: {
                rows: 2
            },
            pagination: {
                el: ".swiper-pagination",
                clickable: true
            },
            breakpoints: {
                320: {
                    slidesPerView: 1,
                    spaceBetween: 24
                },
                768: {
                    slidesPerView: 3,
                    spaceBetween: 30
                }
            }
        });
        if (document.querySelector(".speakers-podcast__slider")) new core(".speakers-podcast__slider", {
            modules: [ Navigation, Pagination ],
            observer: true,
            observeParents: true,
            speed: 800,
            spaceBetween: 32,
            navigation: {
                prevEl: ".speakers-podcast__slider-arrow-prev",
                nextEl: ".speakers-podcast__slider-arrow-next"
            },
            pagination: {
                el: ".swiper-pagination",
                clickable: true
            },
            breakpoints: {
                320: {
                    slidesPerView: 1.4,
                    spaceBetween: 24,
                    autoHeight: true
                },
                768: {
                    slidesPerView: 3,
                    spaceBetween: 30,
                    autoHeight: false
                }
            }
        });
        if (document.querySelector(".program-podcast")) {
            const programThumbs = new core(".program-podcast__nav-slider", {
                modules: [ Navigation ],
                observer: true,
                observeParents: true,
                speed: 800,
                slidesPerView: "auto",
                freeMode: true,
                watchSlidesVisibility: true,
                watchSlidesProgress: true
            });
            new core(".program-podcast__slider", {
                modules: [ Navigation, Thumb, Manipulation, EffectFade ],
                observer: true,
                observeParents: true,
                speed: 800,
                slidesPerView: 1,
                autoHeight: true,
                effect: "fade",
                fadeEffect: {
                    crossFade: true
                },
                thumbs: {
                    swiper: programThumbs,
                    clickable: true
                },
                navigation: {
                    prevEl: ".program-podcast__slider-arrow-prev",
                    nextEl: ".program-podcast__slider-arrow-next"
                }
            });
        }
        if (document.querySelector(".qc-reviews__slider")) new core(".qc-reviews__slider", {
            modules: [ Navigation, Pagination ],
            observer: true,
            observeParents: true,
            speed: 800,
            spaceBetween: 32,
            navigation: {
                prevEl: ".qc-reviews__slider-arrow-prev",
                nextEl: ".qc-reviews__slider-arrow-next"
            },
            pagination: {
                el: ".swiper-pagination",
                clickable: true
            },
            breakpoints: {
                320: {
                    slidesPerView: 1
                },
                768: {
                    slidesPerView: 2,
                    spaceBetween: 32
                }
            }
        });
        if (document.querySelector(".qc-company__slider")) new core(".qc-company__slider", {
            modules: [ Navigation, Pagination ],
            observer: true,
            observeParents: true,
            speed: 800,
            spaceBetween: 32,
            navigation: {
                prevEl: ".qc-company__slider-arrow-prev",
                nextEl: ".qc-company__slider-arrow-next"
            },
            pagination: {
                el: ".swiper-pagination",
                clickable: true
            },
            breakpoints: {
                320: {
                    slidesPerView: 1
                },
                768: {
                    slidesPerView: 2,
                    spaceBetween: 32
                }
            }
        });
        if (document.querySelector(".qc-success__slider")) new core(".qc-success__slider", {
            modules: [ Navigation, Pagination ],
            observer: true,
            observeParents: true,
            speed: 800,
            spaceBetween: 32,
            navigation: {
                prevEl: ".qc-success__slider-arrow-prev",
                nextEl: ".qc-success__slider-arrow-next"
            },
            pagination: {
                el: ".swiper-pagination",
                clickable: true
            },
            breakpoints: {
                320: {
                    slidesPerView: 1.4,
                    spaceBetween: 16,
                    autoHeight: true
                },
                600: {
                    slidesPerView: 2.5,
                    spaceBetween: 30,
                    autoHeight: true
                },
                768: {
                    slidesPerView: 3.5,
                    spaceBetween: 30,
                    autoHeight: true
                },
                992: {
                    slidesPerView: 3,
                    spaceBetween: 30,
                    autoHeight: true
                }
            }
        });
    }
    window.addEventListener("load", (function(e) {
        initSliders();
    }));
    class FullPage {
        constructor(element, options) {
            let config = {
                noEventSelector: "[data-no-event]",
                сlassInit: "fp-init",
                wrapperAnimatedClass: "fp-switching",
                selectorSection: "[data-fp-section]",
                activeClass: "active-section",
                previousClass: "previous-section",
                nextClass: "next-section",
                idActiveSection: 0,
                mode: element.dataset.fpEffect ? element.dataset.fpEffect : "slider",
                bullets: element.hasAttribute("data-fp-bullets") ? true : false,
                bulletsClass: "fp-bullets",
                bulletClass: "fp-bullet",
                bulletActiveClass: "fp-bullet-active",
                onInit: function() {},
                onSwitching: function() {},
                onDestroy: function() {}
            };
            this.options = Object.assign(config, options);
            this.wrapper = element;
            this.sections = this.wrapper.querySelectorAll(this.options.selectorSection);
            this.activeSection = false;
            this.activeSectionId = false;
            this.previousSection = false;
            this.previousSectionId = false;
            this.nextSection = false;
            this.nextSectionId = false;
            this.bulletsWrapper = false;
            this.stopEvent = false;
            if (this.sections.length) this.init();
        }
        init() {
            if (this.options.idActiveSection > this.sections.length - 1) return;
            this.setId();
            this.activeSectionId = this.options.idActiveSection;
            this.setEffectsClasses();
            this.setClasses();
            this.setStyle();
            if (this.options.bullets) {
                this.setBullets();
                this.setActiveBullet(this.activeSectionId);
            }
            this.events();
            setTimeout((() => {
                document.documentElement.classList.add(this.options.сlassInit);
                this.options.onInit(this);
                document.dispatchEvent(new CustomEvent("fpinit", {
                    detail: {
                        fp: this
                    }
                }));
            }), 0);
        }
        destroy() {
            this.removeEvents();
            this.removeClasses();
            document.documentElement.classList.remove(this.options.сlassInit);
            this.wrapper.classList.remove(this.options.wrapperAnimatedClass);
            this.removeEffectsClasses();
            this.removeZIndex();
            this.removeStyle();
            this.removeId();
            this.options.onDestroy(this);
            document.dispatchEvent(new CustomEvent("fpdestroy", {
                detail: {
                    fp: this
                }
            }));
        }
        setId() {
            for (let index = 0; index < this.sections.length; index++) {
                const section = this.sections[index];
                section.setAttribute("data-fp-id", index);
            }
        }
        removeId() {
            for (let index = 0; index < this.sections.length; index++) {
                const section = this.sections[index];
                section.removeAttribute("data-fp-id");
            }
        }
        setClasses() {
            this.previousSectionId = this.activeSectionId - 1 >= 0 ? this.activeSectionId - 1 : false;
            this.nextSectionId = this.activeSectionId + 1 < this.sections.length ? this.activeSectionId + 1 : false;
            this.activeSection = this.sections[this.activeSectionId];
            this.activeSection.classList.add(this.options.activeClass);
            if (false !== this.previousSectionId) {
                this.previousSection = this.sections[this.previousSectionId];
                this.previousSection.classList.add(this.options.previousClass);
            } else this.previousSection = false;
            if (false !== this.nextSectionId) {
                this.nextSection = this.sections[this.nextSectionId];
                this.nextSection.classList.add(this.options.nextClass);
            } else this.nextSection = false;
        }
        removeEffectsClasses() {
            switch (this.options.mode) {
              case "slider":
                this.wrapper.classList.remove("slider-mode");
                break;

              case "cards":
                this.wrapper.classList.remove("cards-mode");
                this.setZIndex();
                break;

              case "fade":
                this.wrapper.classList.remove("fade-mode");
                this.setZIndex();
                break;

              default:
                break;
            }
        }
        setEffectsClasses() {
            switch (this.options.mode) {
              case "slider":
                this.wrapper.classList.add("slider-mode");
                break;

              case "cards":
                this.wrapper.classList.add("cards-mode");
                this.setZIndex();
                break;

              case "fade":
                this.wrapper.classList.add("fade-mode");
                this.setZIndex();
                break;

              default:
                break;
            }
        }
        setStyle() {
            switch (this.options.mode) {
              case "slider":
                this.styleSlider();
                break;

              case "cards":
                this.styleCards();
                break;

              case "fade":
                this.styleFade();
                break;

              default:
                break;
            }
        }
        styleSlider() {
            for (let index = 0; index < this.sections.length; index++) {
                const section = this.sections[index];
                if (index === this.activeSectionId) section.style.transform = "translate3D(0,0,0)"; else if (index < this.activeSectionId) section.style.transform = "translate3D(0,-100%,0)"; else if (index > this.activeSectionId) section.style.transform = "translate3D(0,100%,0)";
            }
        }
        styleCards() {
            for (let index = 0; index < this.sections.length; index++) {
                const section = this.sections[index];
                if (index >= this.activeSectionId) section.style.transform = "translate3D(0,0,0)"; else if (index < this.activeSectionId) section.style.transform = "translate3D(0,-100%,0)";
            }
        }
        styleFade() {
            for (let index = 0; index < this.sections.length; index++) {
                const section = this.sections[index];
                if (index === this.activeSectionId) {
                    section.style.opacity = "1";
                    section.style.visibility = "visible";
                } else {
                    section.style.opacity = "0";
                    section.style.visibility = "hidden";
                }
            }
        }
        removeStyle() {
            for (let index = 0; index < this.sections.length; index++) {
                const section = this.sections[index];
                section.style.opacity = "";
                section.style.visibility = "";
                section.style.transform = "";
            }
        }
        checkScroll(yCoord, element) {
            this.goScroll = false;
            if (!this.stopEvent && element) {
                this.goScroll = true;
                if (this.haveScroll(element)) {
                    this.goScroll = false;
                    const position = Math.round(element.scrollHeight - element.scrollTop);
                    if (Math.abs(position - element.scrollHeight) < 2 && yCoord <= 0 || Math.abs(position - element.clientHeight) < 2 && yCoord >= 0) this.goScroll = true;
                }
            }
        }
        haveScroll(element) {
            return element.scrollHeight !== window.innerHeight;
        }
        removeClasses() {
            for (let index = 0; index < this.sections.length; index++) {
                const section = this.sections[index];
                section.classList.remove(this.options.activeClass);
                section.classList.remove(this.options.previousClass);
                section.classList.remove(this.options.nextClass);
            }
        }
        events() {
            this.events = {
                wheel: this.wheel.bind(this),
                touchdown: this.touchDown.bind(this),
                touchup: this.touchUp.bind(this),
                touchmove: this.touchMove.bind(this),
                touchcancel: this.touchUp.bind(this),
                transitionEnd: this.transitionend.bind(this),
                click: this.clickBullets.bind(this)
            };
            if (isMobile.iOS()) document.addEventListener("touchmove", (e => {
                e.preventDefault();
            }));
            this.setEvents();
        }
        setEvents() {
            this.wrapper.addEventListener("wheel", this.events.wheel);
            this.wrapper.addEventListener("touchstart", this.events.touchdown);
            if (this.options.bullets && this.bulletsWrapper) this.bulletsWrapper.addEventListener("click", this.events.click);
        }
        removeEvents() {
            this.wrapper.removeEventListener("wheel", this.events.wheel);
            this.wrapper.removeEventListener("touchdown", this.events.touchdown);
            this.wrapper.removeEventListener("touchup", this.events.touchup);
            this.wrapper.removeEventListener("touchcancel", this.events.touchup);
            this.wrapper.removeEventListener("touchmove", this.events.touchmove);
            if (this.bulletsWrapper) this.bulletsWrapper.removeEventListener("click", this.events.click);
        }
        clickBullets(e) {
            const bullet = e.target.closest(`.${this.options.bulletClass}`);
            if (bullet) {
                const arrayChildren = Array.from(this.bulletsWrapper.children);
                const idClickBullet = arrayChildren.indexOf(bullet);
                this.switchingSection(idClickBullet);
            }
        }
        setActiveBullet(idButton) {
            if (!this.bulletsWrapper) return;
            const bullets = this.bulletsWrapper.children;
            for (let index = 0; index < bullets.length; index++) {
                const bullet = bullets[index];
                if (idButton === index) bullet.classList.add(this.options.bulletActiveClass); else bullet.classList.remove(this.options.bulletActiveClass);
            }
        }
        touchDown(e) {
            this._yP = e.changedTouches[0].pageY;
            this._eventElement = e.target.closest(`.${this.options.activeClass}`);
            if (this._eventElement) {
                this._eventElement.addEventListener("touchend", this.events.touchup);
                this._eventElement.addEventListener("touchcancel", this.events.touchup);
                this._eventElement.addEventListener("touchmove", this.events.touchmove);
                this.clickOrTouch = true;
                if (isMobile.iOS()) {
                    if (this._eventElement.scrollHeight !== this._eventElement.clientHeight) {
                        if (0 === this._eventElement.scrollTop) this._eventElement.scrollTop = 1;
                        if (this._eventElement.scrollTop === this._eventElement.scrollHeight - this._eventElement.clientHeight) this._eventElement.scrollTop = this._eventElement.scrollHeight - this._eventElement.clientHeight - 1;
                    }
                    this.allowUp = this._eventElement.scrollTop > 0;
                    this.allowDown = this._eventElement.scrollTop < this._eventElement.scrollHeight - this._eventElement.clientHeight;
                    this.lastY = e.changedTouches[0].pageY;
                }
            }
        }
        touchMove(e) {
            const targetElement = e.target.closest(`.${this.options.activeClass}`);
            if (isMobile.iOS()) {
                let up = e.changedTouches[0].pageY > this.lastY;
                let down = !up;
                this.lastY = e.changedTouches[0].pageY;
                if (targetElement) if (up && this.allowUp || down && this.allowDown) e.stopPropagation(); else if (e.cancelable) e.preventDefault();
            }
            if (!this.clickOrTouch || e.target.closest(this.options.noEventSelector)) return;
            let yCoord = this._yP - e.changedTouches[0].pageY;
            this.checkScroll(yCoord, targetElement);
            if (this.goScroll && Math.abs(yCoord) > 20) this.choiceOfDirection(yCoord);
        }
        touchUp(e) {
            this._eventElement.removeEventListener("touchend", this.events.touchup);
            this._eventElement.removeEventListener("touchcancel", this.events.touchup);
            this._eventElement.removeEventListener("touchmove", this.events.touchmove);
            return this.clickOrTouch = false;
        }
        transitionend(e) {
            if (e.target.closest(this.options.selectorSection)) {
                this.stopEvent = false;
                this.wrapper.classList.remove(this.options.wrapperAnimatedClass);
            }
        }
        wheel(e) {
            if (e.target.closest(this.options.noEventSelector)) return;
            const yCoord = e.deltaY;
            const targetElement = e.target.closest(`.${this.options.activeClass}`);
            this.checkScroll(yCoord, targetElement);
            if (this.goScroll) this.choiceOfDirection(yCoord);
        }
        choiceOfDirection(direction) {
            this.stopEvent = true;
            if (0 === this.activeSectionId && direction < 0 || this.activeSectionId === this.sections.length - 1 && direction > 0) this.stopEvent = false;
            if (direction > 0 && false !== this.nextSection) this.activeSectionId = this.activeSectionId + 1 < this.sections.length ? ++this.activeSectionId : this.activeSectionId; else if (direction < 0 && false !== this.previousSection) this.activeSectionId = this.activeSectionId - 1 >= 0 ? --this.activeSectionId : this.activeSectionId;
            if (this.stopEvent) this.switchingSection();
        }
        switchingSection(idSection = this.activeSectionId) {
            this.activeSectionId = idSection;
            this.wrapper.classList.add(this.options.wrapperAnimatedClass);
            this.wrapper.addEventListener("transitionend", this.events.transitionEnd);
            this.removeClasses();
            this.setClasses();
            this.setStyle();
            if (this.options.bullets) this.setActiveBullet(this.activeSectionId);
            this.options.onSwitching(this);
            document.dispatchEvent(new CustomEvent("fpswitching", {
                detail: {
                    fp: this
                }
            }));
        }
        setBullets() {
            this.bulletsWrapper = document.querySelector(`.${this.options.bulletsClass}`);
            if (!this.bulletsWrapper) {
                const bullets = document.createElement("div");
                bullets.classList.add(this.options.bulletsClass);
                this.wrapper.append(bullets);
                this.bulletsWrapper = bullets;
            }
            if (this.bulletsWrapper) for (let index = 0; index < this.sections.length; index++) {
                const span = document.createElement("span");
                span.classList.add(this.options.bulletClass);
                this.bulletsWrapper.append(span);
            }
        }
        setZIndex() {
            let zIndex = this.sections.length;
            for (let index = 0; index < this.sections.length; index++) {
                const section = this.sections[index];
                section.style.zIndex = zIndex;
                --zIndex;
            }
        }
        removeZIndex() {
            for (let index = 0; index < this.sections.length; index++) {
                const section = this.sections[index];
                section.style.zIndex = "";
            }
        }
    }
    if (document.querySelector("[data-fp]")) modules_flsModules.fullpage = new FullPage(document.querySelector("[data-fp]"), "");
    let addWindowScrollEvent = false;
    function pageNavigation() {
        document.addEventListener("click", pageNavigationAction);
        document.addEventListener("watcherCallback", pageNavigationAction);
        function pageNavigationAction(e) {
            if ("click" === e.type) {
                const targetElement = e.target;
                if (targetElement.closest("[data-goto]")) {
                    const gotoLink = targetElement.closest("[data-goto]");
                    const gotoLinkSelector = gotoLink.dataset.goto ? gotoLink.dataset.goto : "";
                    const noHeader = gotoLink.hasAttribute("data-goto-header") ? true : false;
                    const gotoSpeed = gotoLink.dataset.gotoSpeed ? gotoLink.dataset.gotoSpeed : 500;
                    const offsetTop = gotoLink.dataset.gotoTop ? parseInt(gotoLink.dataset.gotoTop) : 0;
                    gotoblock_gotoBlock(gotoLinkSelector, noHeader, gotoSpeed, offsetTop);
                    e.preventDefault();
                }
            } else if ("watcherCallback" === e.type && e.detail) {
                const entry = e.detail.entry;
                const targetElement = entry.target;
                if ("navigator" === targetElement.dataset.watch) {
                    document.querySelector(`[data-goto]._navigator-active`);
                    let navigatorCurrentItem;
                    if (targetElement.id && document.querySelector(`[data-goto="#${targetElement.id}"]`)) navigatorCurrentItem = document.querySelector(`[data-goto="#${targetElement.id}"]`); else if (targetElement.classList.length) for (let index = 0; index < targetElement.classList.length; index++) {
                        const element = targetElement.classList[index];
                        if (document.querySelector(`[data-goto=".${element}"]`)) {
                            navigatorCurrentItem = document.querySelector(`[data-goto=".${element}"]`);
                            break;
                        }
                    }
                    if (entry.isIntersecting) navigatorCurrentItem ? navigatorCurrentItem.classList.add("_navigator-active") : null; else navigatorCurrentItem ? navigatorCurrentItem.classList.remove("_navigator-active") : null;
                }
            }
        }
        if (getHash()) {
            let goToHash;
            if (document.querySelector(`#${getHash()}`)) goToHash = `#${getHash()}`; else if (document.querySelector(`.${getHash()}`)) goToHash = `.${getHash()}`;
            goToHash ? gotoblock_gotoBlock(goToHash, true, 500, 20) : null;
        }
    }
    function stickyBlock() {
        addWindowScrollEvent = true;
        function stickyBlockInit() {
            const stickyParents = document.querySelectorAll("[data-sticky]");
            if (stickyParents.length) stickyParents.forEach((stickyParent => {
                let stickyConfig = {
                    media: stickyParent.dataset.sticky ? parseInt(stickyParent.dataset.sticky) : null,
                    top: stickyParent.dataset.stickyTop ? parseInt(stickyParent.dataset.stickyTop) : 0,
                    bottom: stickyParent.dataset.stickyBottom ? parseInt(stickyParent.dataset.stickyBottom) : 0,
                    header: stickyParent.hasAttribute("data-sticky-header") ? document.querySelector("header.header").offsetHeight : 0
                };
                stickyBlockItem(stickyParent, stickyConfig);
            }));
        }
        function stickyBlockItem(stickyParent, stickyConfig) {
            const stickyBlockItem = stickyParent.querySelector("[data-sticky-item]");
            const headerHeight = stickyConfig.header;
            const offsetTop = headerHeight + stickyConfig.top;
            const startPoint = stickyBlockItem.getBoundingClientRect().top + scrollY - offsetTop;
            document.addEventListener("windowScroll", stickyBlockActions);
            function stickyBlockActions(e) {
                const endPoint = stickyParent.offsetHeight + stickyParent.getBoundingClientRect().top + scrollY - (offsetTop + stickyBlockItem.offsetHeight + stickyConfig.bottom);
                let stickyItemValues = {
                    position: "relative",
                    bottom: "auto",
                    top: "0px",
                    left: "0px",
                    width: "auto"
                };
                if (!stickyConfig.media || stickyConfig.media < window.innerWidth) if (offsetTop + stickyConfig.bottom + stickyBlockItem.offsetHeight < window.innerHeight) if (scrollY >= startPoint && scrollY <= endPoint) {
                    stickyItemValues.position = `fixed`;
                    stickyItemValues.bottom = `auto`;
                    stickyItemValues.top = `${offsetTop}px`;
                    stickyItemValues.left = `${stickyBlockItem.getBoundingClientRect().left}px`;
                    stickyItemValues.width = `${stickyBlockItem.offsetWidth}px`;
                } else if (scrollY >= endPoint) {
                    stickyItemValues.position = `absolute`;
                    stickyItemValues.bottom = `${stickyConfig.bottom}px`;
                    stickyItemValues.top = `auto`;
                    stickyItemValues.left = `0px`;
                    stickyItemValues.width = `${stickyBlockItem.offsetWidth}px`;
                }
                stickyBlockType(stickyBlockItem, stickyItemValues);
            }
        }
        function stickyBlockType(stickyBlockItem, stickyItemValues) {
            stickyBlockItem.style.cssText = `position:${stickyItemValues.position};bottom:${stickyItemValues.bottom};top:${stickyItemValues.top};left:${stickyItemValues.left};width:${stickyItemValues.width};`;
        }
        stickyBlockInit();
    }
    setTimeout((() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (function(e) {
                document.dispatchEvent(windowScroll);
            }));
        }
    }), 0);
    /*!
 * lightgallery | 2.5.0 | June 13th 2022
 * http://www.lightgalleryjs.com/
 * Copyright (c) 2020 Sachin Neravath;
 * @license GPLv3
 */
    /*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };
    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
        var r = Array(s), k = 0;
        for (i = 0; i < il; i++) for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, 
        k++) r[k] = a[j];
        return r;
    }
    var lGEvents = {
        afterAppendSlide: "lgAfterAppendSlide",
        init: "lgInit",
        hasVideo: "lgHasVideo",
        containerResize: "lgContainerResize",
        updateSlides: "lgUpdateSlides",
        afterAppendSubHtml: "lgAfterAppendSubHtml",
        beforeOpen: "lgBeforeOpen",
        afterOpen: "lgAfterOpen",
        slideItemLoad: "lgSlideItemLoad",
        beforeSlide: "lgBeforeSlide",
        afterSlide: "lgAfterSlide",
        posterClick: "lgPosterClick",
        dragStart: "lgDragStart",
        dragMove: "lgDragMove",
        dragEnd: "lgDragEnd",
        beforeNextSlide: "lgBeforeNextSlide",
        beforePrevSlide: "lgBeforePrevSlide",
        beforeClose: "lgBeforeClose",
        afterClose: "lgAfterClose",
        rotateLeft: "lgRotateLeft",
        rotateRight: "lgRotateRight",
        flipHorizontal: "lgFlipHorizontal",
        flipVertical: "lgFlipVertical",
        autoplay: "lgAutoplay",
        autoplayStart: "lgAutoplayStart",
        autoplayStop: "lgAutoplayStop"
    };
    var lightGalleryCoreSettings = {
        mode: "lg-slide",
        easing: "ease",
        speed: 400,
        licenseKey: "0000-0000-000-0000",
        height: "100%",
        width: "100%",
        addClass: "",
        startClass: "lg-start-zoom",
        backdropDuration: 300,
        container: "",
        startAnimationDuration: 400,
        zoomFromOrigin: true,
        hideBarsDelay: 0,
        showBarsAfter: 1e4,
        slideDelay: 0,
        supportLegacyBrowser: true,
        allowMediaOverlap: false,
        videoMaxSize: "1280-720",
        loadYouTubePoster: true,
        defaultCaptionHeight: 0,
        ariaLabelledby: "",
        ariaDescribedby: "",
        resetScrollPosition: true,
        hideScrollbar: false,
        closable: true,
        swipeToClose: true,
        closeOnTap: true,
        showCloseIcon: true,
        showMaximizeIcon: false,
        loop: true,
        escKey: true,
        keyPress: true,
        trapFocus: true,
        controls: true,
        slideEndAnimation: true,
        hideControlOnEnd: false,
        mousewheel: false,
        getCaptionFromTitleOrAlt: true,
        appendSubHtmlTo: ".lg-sub-html",
        subHtmlSelectorRelative: false,
        preload: 2,
        numberOfSlideItemsInDom: 10,
        selector: "",
        selectWithin: "",
        nextHtml: "",
        prevHtml: "",
        index: 0,
        iframeWidth: "100%",
        iframeHeight: "100%",
        iframeMaxWidth: "100%",
        iframeMaxHeight: "100%",
        download: true,
        counter: true,
        appendCounterTo: ".lg-toolbar",
        swipeThreshold: 50,
        enableSwipe: true,
        enableDrag: true,
        dynamic: false,
        dynamicEl: [],
        extraProps: [],
        exThumbImage: "",
        isMobile: void 0,
        mobileSettings: {
            controls: false,
            showCloseIcon: false,
            download: false
        },
        plugins: [],
        strings: {
            closeGallery: "Close gallery",
            toggleMaximize: "Toggle maximize",
            previousSlide: "Previous slide",
            nextSlide: "Next slide",
            download: "Download",
            playVideo: "Play video"
        }
    };
    function initLgPolyfills() {
        (function() {
            if ("function" === typeof window.CustomEvent) return false;
            function CustomEvent(event, params) {
                params = params || {
                    bubbles: false,
                    cancelable: false,
                    detail: null
                };
                var evt = document.createEvent("CustomEvent");
                evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
                return evt;
            }
            window.CustomEvent = CustomEvent;
        })();
        (function() {
            if (!Element.prototype.matches) Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
        })();
    }
    var lgQuery = function() {
        function lgQuery(selector) {
            this.cssVenderPrefixes = [ "TransitionDuration", "TransitionTimingFunction", "Transform", "Transition" ];
            this.selector = this._getSelector(selector);
            this.firstElement = this._getFirstEl();
            return this;
        }
        lgQuery.generateUUID = function() {
            return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (function(c) {
                var r = 16 * Math.random() | 0, v = "x" == c ? r : 3 & r | 8;
                return v.toString(16);
            }));
        };
        lgQuery.prototype._getSelector = function(selector, context) {
            if (void 0 === context) context = document;
            if ("string" !== typeof selector) return selector;
            context = context || document;
            var fl = selector.substring(0, 1);
            if ("#" === fl) return context.querySelector(selector); else return context.querySelectorAll(selector);
        };
        lgQuery.prototype._each = function(func) {
            if (!this.selector) return this;
            if (void 0 !== this.selector.length) [].forEach.call(this.selector, func); else func(this.selector, 0);
            return this;
        };
        lgQuery.prototype._setCssVendorPrefix = function(el, cssProperty, value) {
            var property = cssProperty.replace(/-([a-z])/gi, (function(s, group1) {
                return group1.toUpperCase();
            }));
            if (-1 !== this.cssVenderPrefixes.indexOf(property)) {
                el.style[property.charAt(0).toLowerCase() + property.slice(1)] = value;
                el.style["webkit" + property] = value;
                el.style["moz" + property] = value;
                el.style["ms" + property] = value;
                el.style["o" + property] = value;
            } else el.style[property] = value;
        };
        lgQuery.prototype._getFirstEl = function() {
            if (this.selector && void 0 !== this.selector.length) return this.selector[0]; else return this.selector;
        };
        lgQuery.prototype.isEventMatched = function(event, eventName) {
            var eventNamespace = eventName.split(".");
            return event.split(".").filter((function(e) {
                return e;
            })).every((function(e) {
                return -1 !== eventNamespace.indexOf(e);
            }));
        };
        lgQuery.prototype.attr = function(attr, value) {
            if (void 0 === value) {
                if (!this.firstElement) return "";
                return this.firstElement.getAttribute(attr);
            }
            this._each((function(el) {
                el.setAttribute(attr, value);
            }));
            return this;
        };
        lgQuery.prototype.find = function(selector) {
            return $LG(this._getSelector(selector, this.selector));
        };
        lgQuery.prototype.first = function() {
            if (this.selector && void 0 !== this.selector.length) return $LG(this.selector[0]); else return $LG(this.selector);
        };
        lgQuery.prototype.eq = function(index) {
            return $LG(this.selector[index]);
        };
        lgQuery.prototype.parent = function() {
            return $LG(this.selector.parentElement);
        };
        lgQuery.prototype.get = function() {
            return this._getFirstEl();
        };
        lgQuery.prototype.removeAttr = function(attributes) {
            var attrs = attributes.split(" ");
            this._each((function(el) {
                attrs.forEach((function(attr) {
                    return el.removeAttribute(attr);
                }));
            }));
            return this;
        };
        lgQuery.prototype.wrap = function(className) {
            if (!this.firstElement) return this;
            var wrapper = document.createElement("div");
            wrapper.className = className;
            this.firstElement.parentNode.insertBefore(wrapper, this.firstElement);
            this.firstElement.parentNode.removeChild(this.firstElement);
            wrapper.appendChild(this.firstElement);
            return this;
        };
        lgQuery.prototype.addClass = function(classNames) {
            if (void 0 === classNames) classNames = "";
            this._each((function(el) {
                classNames.split(" ").forEach((function(className) {
                    if (className) el.classList.add(className);
                }));
            }));
            return this;
        };
        lgQuery.prototype.removeClass = function(classNames) {
            this._each((function(el) {
                classNames.split(" ").forEach((function(className) {
                    if (className) el.classList.remove(className);
                }));
            }));
            return this;
        };
        lgQuery.prototype.hasClass = function(className) {
            if (!this.firstElement) return false;
            return this.firstElement.classList.contains(className);
        };
        lgQuery.prototype.hasAttribute = function(attribute) {
            if (!this.firstElement) return false;
            return this.firstElement.hasAttribute(attribute);
        };
        lgQuery.prototype.toggleClass = function(className) {
            if (!this.firstElement) return this;
            if (this.hasClass(className)) this.removeClass(className); else this.addClass(className);
            return this;
        };
        lgQuery.prototype.css = function(property, value) {
            var _this = this;
            this._each((function(el) {
                _this._setCssVendorPrefix(el, property, value);
            }));
            return this;
        };
        lgQuery.prototype.on = function(events, listener) {
            var _this = this;
            if (!this.selector) return this;
            events.split(" ").forEach((function(event) {
                if (!Array.isArray(lgQuery.eventListeners[event])) lgQuery.eventListeners[event] = [];
                lgQuery.eventListeners[event].push(listener);
                _this.selector.addEventListener(event.split(".")[0], listener);
            }));
            return this;
        };
        lgQuery.prototype.once = function(event, listener) {
            var _this = this;
            this.on(event, (function() {
                _this.off(event);
                listener(event);
            }));
            return this;
        };
        lgQuery.prototype.off = function(event) {
            var _this = this;
            if (!this.selector) return this;
            Object.keys(lgQuery.eventListeners).forEach((function(eventName) {
                if (_this.isEventMatched(event, eventName)) {
                    lgQuery.eventListeners[eventName].forEach((function(listener) {
                        _this.selector.removeEventListener(eventName.split(".")[0], listener);
                    }));
                    lgQuery.eventListeners[eventName] = [];
                }
            }));
            return this;
        };
        lgQuery.prototype.trigger = function(event, detail) {
            if (!this.firstElement) return this;
            var customEvent = new CustomEvent(event.split(".")[0], {
                detail: detail || null
            });
            this.firstElement.dispatchEvent(customEvent);
            return this;
        };
        lgQuery.prototype.load = function(url) {
            var _this = this;
            fetch(url).then((function(res) {
                return res.text();
            })).then((function(html) {
                _this.selector.innerHTML = html;
            }));
            return this;
        };
        lgQuery.prototype.html = function(html) {
            if (void 0 === html) {
                if (!this.firstElement) return "";
                return this.firstElement.innerHTML;
            }
            this._each((function(el) {
                el.innerHTML = html;
            }));
            return this;
        };
        lgQuery.prototype.append = function(html) {
            this._each((function(el) {
                if ("string" === typeof html) el.insertAdjacentHTML("beforeend", html); else el.appendChild(html);
            }));
            return this;
        };
        lgQuery.prototype.prepend = function(html) {
            this._each((function(el) {
                el.insertAdjacentHTML("afterbegin", html);
            }));
            return this;
        };
        lgQuery.prototype.remove = function() {
            this._each((function(el) {
                el.parentNode.removeChild(el);
            }));
            return this;
        };
        lgQuery.prototype.empty = function() {
            this._each((function(el) {
                el.innerHTML = "";
            }));
            return this;
        };
        lgQuery.prototype.scrollTop = function(scrollTop) {
            if (void 0 !== scrollTop) {
                document.body.scrollTop = scrollTop;
                document.documentElement.scrollTop = scrollTop;
                return this;
            } else return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        };
        lgQuery.prototype.scrollLeft = function(scrollLeft) {
            if (void 0 !== scrollLeft) {
                document.body.scrollLeft = scrollLeft;
                document.documentElement.scrollLeft = scrollLeft;
                return this;
            } else return window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0;
        };
        lgQuery.prototype.offset = function() {
            if (!this.firstElement) return {
                left: 0,
                top: 0
            };
            var rect = this.firstElement.getBoundingClientRect();
            var bodyMarginLeft = $LG("body").style().marginLeft;
            return {
                left: rect.left - parseFloat(bodyMarginLeft) + this.scrollLeft(),
                top: rect.top + this.scrollTop()
            };
        };
        lgQuery.prototype.style = function() {
            if (!this.firstElement) return {};
            return this.firstElement.currentStyle || window.getComputedStyle(this.firstElement);
        };
        lgQuery.prototype.width = function() {
            var style = this.style();
            return this.firstElement.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
        };
        lgQuery.prototype.height = function() {
            var style = this.style();
            return this.firstElement.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);
        };
        lgQuery.eventListeners = {};
        return lgQuery;
    }();
    function $LG(selector) {
        initLgPolyfills();
        return new lgQuery(selector);
    }
    var defaultDynamicOptions = [ "src", "sources", "subHtml", "subHtmlUrl", "html", "video", "poster", "slideName", "responsive", "srcset", "sizes", "iframe", "downloadUrl", "download", "width", "facebookShareUrl", "tweetText", "iframeTitle", "twitterShareUrl", "pinterestShareUrl", "pinterestText", "fbHtml", "disqusIdentifier", "disqusUrl" ];
    function convertToData(attr) {
        if ("href" === attr) return "src";
        attr = attr.replace("data-", "");
        attr = attr.charAt(0).toLowerCase() + attr.slice(1);
        attr = attr.replace(/-([a-z])/g, (function(g) {
            return g[1].toUpperCase();
        }));
        return attr;
    }
    var utils = {
        getSize: function(el, container, spacing, defaultLgSize) {
            if (void 0 === spacing) spacing = 0;
            var LGel = $LG(el);
            var lgSize = LGel.attr("data-lg-size") || defaultLgSize;
            if (!lgSize) return;
            var isResponsiveSizes = lgSize.split(",");
            if (isResponsiveSizes[1]) {
                var wWidth = window.innerWidth;
                for (var i = 0; i < isResponsiveSizes.length; i++) {
                    var size_1 = isResponsiveSizes[i];
                    var responsiveWidth = parseInt(size_1.split("-")[2], 10);
                    if (responsiveWidth > wWidth) {
                        lgSize = size_1;
                        break;
                    }
                    if (i === isResponsiveSizes.length - 1) lgSize = size_1;
                }
            }
            var size = lgSize.split("-");
            var width = parseInt(size[0], 10);
            var height = parseInt(size[1], 10);
            var cWidth = container.width();
            var cHeight = container.height() - spacing;
            var maxWidth = Math.min(cWidth, width);
            var maxHeight = Math.min(cHeight, height);
            var ratio = Math.min(maxWidth / width, maxHeight / height);
            return {
                width: width * ratio,
                height: height * ratio
            };
        },
        getTransform: function(el, container, top, bottom, imageSize) {
            if (!imageSize) return;
            var LGel = $LG(el).find("img").first();
            if (!LGel.get()) return;
            var containerRect = container.get().getBoundingClientRect();
            var wWidth = containerRect.width;
            var wHeight = container.height() - (top + bottom);
            var elWidth = LGel.width();
            var elHeight = LGel.height();
            var elStyle = LGel.style();
            var x = (wWidth - elWidth) / 2 - LGel.offset().left + (parseFloat(elStyle.paddingLeft) || 0) + (parseFloat(elStyle.borderLeft) || 0) + $LG(window).scrollLeft() + containerRect.left;
            var y = (wHeight - elHeight) / 2 - LGel.offset().top + (parseFloat(elStyle.paddingTop) || 0) + (parseFloat(elStyle.borderTop) || 0) + $LG(window).scrollTop() + top;
            var scX = elWidth / imageSize.width;
            var scY = elHeight / imageSize.height;
            var transform = "translate3d(" + (x *= -1) + "px, " + (y *= -1) + "px, 0) scale3d(" + scX + ", " + scY + ", 1)";
            return transform;
        },
        getIframeMarkup: function(iframeWidth, iframeHeight, iframeMaxWidth, iframeMaxHeight, src, iframeTitle) {
            var title = iframeTitle ? 'title="' + iframeTitle + '"' : "";
            return '<div class="lg-video-cont lg-has-iframe" style="width:' + iframeWidth + "; max-width:" + iframeMaxWidth + "; height: " + iframeHeight + "; max-height:" + iframeMaxHeight + '">\n                    <iframe class="lg-object" frameborder="0" ' + title + ' src="' + src + '"  allowfullscreen="true"></iframe>\n                </div>';
        },
        getImgMarkup: function(index, src, altAttr, srcset, sizes, sources) {
            var srcsetAttr = srcset ? 'srcset="' + srcset + '"' : "";
            var sizesAttr = sizes ? 'sizes="' + sizes + '"' : "";
            var imgMarkup = "<img " + altAttr + " " + srcsetAttr + "  " + sizesAttr + ' class="lg-object lg-image" data-index="' + index + '" src="' + src + '" />';
            var sourceTag = "";
            if (sources) {
                var sourceObj = "string" === typeof sources ? JSON.parse(sources) : sources;
                sourceTag = sourceObj.map((function(source) {
                    var attrs = "";
                    Object.keys(source).forEach((function(key) {
                        attrs += " " + key + '="' + source[key] + '"';
                    }));
                    return "<source " + attrs + "></source>";
                }));
            }
            return "" + sourceTag + imgMarkup;
        },
        getResponsiveSrc: function(srcItms) {
            var rsWidth = [];
            var rsSrc = [];
            var src = "";
            for (var i = 0; i < srcItms.length; i++) {
                var _src = srcItms[i].split(" ");
                if ("" === _src[0]) _src.splice(0, 1);
                rsSrc.push(_src[0]);
                rsWidth.push(_src[1]);
            }
            var wWidth = window.innerWidth;
            for (var j = 0; j < rsWidth.length; j++) if (parseInt(rsWidth[j], 10) > wWidth) {
                src = rsSrc[j];
                break;
            }
            return src;
        },
        isImageLoaded: function(img) {
            if (!img) return false;
            if (!img.complete) return false;
            if (0 === img.naturalWidth) return false;
            return true;
        },
        getVideoPosterMarkup: function(_poster, dummyImg, videoContStyle, playVideoString, _isVideo) {
            var videoClass = "";
            if (_isVideo && _isVideo.youtube) videoClass = "lg-has-youtube"; else if (_isVideo && _isVideo.vimeo) videoClass = "lg-has-vimeo"; else videoClass = "lg-has-html5";
            return '<div class="lg-video-cont ' + videoClass + '" style="' + videoContStyle + '">\n                <div class="lg-video-play-button">\n                <svg\n                    viewBox="0 0 20 20"\n                    preserveAspectRatio="xMidYMid"\n                    focusable="false"\n                    aria-labelledby="' + playVideoString + '"\n                    role="img"\n                    class="lg-video-play-icon"\n                >\n                    <title>' + playVideoString + '</title>\n                    <polygon class="lg-video-play-icon-inner" points="1,0 20,10 1,20"></polygon>\n                </svg>\n                <svg class="lg-video-play-icon-bg" viewBox="0 0 50 50" focusable="false">\n                    <circle cx="50%" cy="50%" r="20"></circle></svg>\n                <svg class="lg-video-play-icon-circle" viewBox="0 0 50 50" focusable="false">\n                    <circle cx="50%" cy="50%" r="20"></circle>\n                </svg>\n            </div>\n            ' + (dummyImg || "") + '\n            <img class="lg-object lg-video-poster" src="' + _poster + '" />\n        </div>';
        },
        getFocusableElements: function(container) {
            var elements = container.querySelectorAll('a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])');
            var visibleElements = [].filter.call(elements, (function(element) {
                var style = window.getComputedStyle(element);
                return "none" !== style.display && "hidden" !== style.visibility;
            }));
            return visibleElements;
        },
        getDynamicOptions: function(items, extraProps, getCaptionFromTitleOrAlt, exThumbImage) {
            var dynamicElements = [];
            var availableDynamicOptions = __spreadArrays(defaultDynamicOptions, extraProps);
            [].forEach.call(items, (function(item) {
                var dynamicEl = {};
                for (var i = 0; i < item.attributes.length; i++) {
                    var attr = item.attributes[i];
                    if (attr.specified) {
                        var dynamicAttr = convertToData(attr.name);
                        var label = "";
                        if (availableDynamicOptions.indexOf(dynamicAttr) > -1) label = dynamicAttr;
                        if (label) dynamicEl[label] = attr.value;
                    }
                }
                var currentItem = $LG(item);
                var alt = currentItem.find("img").first().attr("alt");
                var title = currentItem.attr("title");
                var thumb = exThumbImage ? currentItem.attr(exThumbImage) : currentItem.find("img").first().attr("src");
                dynamicEl.thumb = thumb;
                if (getCaptionFromTitleOrAlt && !dynamicEl.subHtml) dynamicEl.subHtml = title || alt || "";
                dynamicEl.alt = alt || title || "";
                dynamicElements.push(dynamicEl);
            }));
            return dynamicElements;
        },
        isMobile: function() {
            return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        },
        isVideo: function(src, isHTML5VIdeo, index) {
            if (!src) if (isHTML5VIdeo) return {
                html5: true
            }; else {
                console.error("lightGallery :- data-src is not provided on slide item " + (index + 1) + ". Please make sure the selector property is properly configured. More info - https://www.lightgalleryjs.com/demos/html-markup/");
                return;
            }
            var youtube = src.match(/\/\/(?:www\.)?youtu(?:\.be|be\.com|be-nocookie\.com)\/(?:watch\?v=|embed\/)?([a-z0-9\-\_\%]+)([\&|?][\S]*)*/i);
            var vimeo = src.match(/\/\/(?:www\.)?(?:player\.)?vimeo.com\/(?:video\/)?([0-9a-z\-_]+)(.*)?/i);
            var wistia = src.match(/https?:\/\/(.+)?(wistia\.com|wi\.st)\/(medias|embed)\/([0-9a-z\-_]+)(.*)/);
            if (youtube) return {
                youtube
            }; else if (vimeo) return {
                vimeo
            }; else if (wistia) return {
                wistia
            };
        }
    };
    var lgId = 0;
    var LightGallery = function() {
        function LightGallery(element, options) {
            this.lgOpened = false;
            this.index = 0;
            this.plugins = [];
            this.lGalleryOn = false;
            this.lgBusy = false;
            this.currentItemsInDom = [];
            this.prevScrollTop = 0;
            this.bodyPaddingRight = 0;
            this.isDummyImageRemoved = false;
            this.dragOrSwipeEnabled = false;
            this.mediaContainerPosition = {
                top: 0,
                bottom: 0
            };
            if (!element) return this;
            lgId++;
            this.lgId = lgId;
            this.el = element;
            this.LGel = $LG(element);
            this.generateSettings(options);
            this.buildModules();
            if (this.settings.dynamic && void 0 !== this.settings.dynamicEl && !Array.isArray(this.settings.dynamicEl)) throw "When using dynamic mode, you must also define dynamicEl as an Array.";
            this.galleryItems = this.getItems();
            this.normalizeSettings();
            this.init();
            this.validateLicense();
            return this;
        }
        LightGallery.prototype.generateSettings = function(options) {
            this.settings = __assign(__assign({}, lightGalleryCoreSettings), options);
            if (this.settings.isMobile && "function" === typeof this.settings.isMobile ? this.settings.isMobile() : utils.isMobile()) {
                var mobileSettings = __assign(__assign({}, this.settings.mobileSettings), this.settings.mobileSettings);
                this.settings = __assign(__assign({}, this.settings), mobileSettings);
            }
        };
        LightGallery.prototype.normalizeSettings = function() {
            if (this.settings.slideEndAnimation) this.settings.hideControlOnEnd = false;
            if (!this.settings.closable) this.settings.swipeToClose = false;
            this.zoomFromOrigin = this.settings.zoomFromOrigin;
            if (this.settings.dynamic) this.zoomFromOrigin = false;
            if (!this.settings.container) this.settings.container = document.body;
            this.settings.preload = Math.min(this.settings.preload, this.galleryItems.length);
        };
        LightGallery.prototype.init = function() {
            var _this = this;
            this.addSlideVideoInfo(this.galleryItems);
            this.buildStructure();
            this.LGel.trigger(lGEvents.init, {
                instance: this
            });
            if (this.settings.keyPress) this.keyPress();
            setTimeout((function() {
                _this.enableDrag();
                _this.enableSwipe();
                _this.triggerPosterClick();
            }), 50);
            this.arrow();
            if (this.settings.mousewheel) this.mousewheel();
            if (!this.settings.dynamic) this.openGalleryOnItemClick();
        };
        LightGallery.prototype.openGalleryOnItemClick = function() {
            var _this = this;
            var _loop_1 = function(index) {
                var element = this_1.items[index];
                var $element = $LG(element);
                var uuid = lgQuery.generateUUID();
                $element.attr("data-lg-id", uuid).on("click.lgcustom-item-" + uuid, (function(e) {
                    e.preventDefault();
                    var currentItemIndex = _this.settings.index || index;
                    _this.openGallery(currentItemIndex, element);
                }));
            };
            var this_1 = this;
            for (var index = 0; index < this.items.length; index++) _loop_1(index);
        };
        LightGallery.prototype.buildModules = function() {
            var _this = this;
            this.settings.plugins.forEach((function(plugin) {
                _this.plugins.push(new plugin(_this, $LG));
            }));
        };
        LightGallery.prototype.validateLicense = function() {
            if (!this.settings.licenseKey) console.error("Please provide a valid license key"); else if ("0000-0000-000-0000" === this.settings.licenseKey) console.warn("lightGallery: " + this.settings.licenseKey + " license key is not valid for production use");
        };
        LightGallery.prototype.getSlideItem = function(index) {
            return $LG(this.getSlideItemId(index));
        };
        LightGallery.prototype.getSlideItemId = function(index) {
            return "#lg-item-" + this.lgId + "-" + index;
        };
        LightGallery.prototype.getIdName = function(id) {
            return id + "-" + this.lgId;
        };
        LightGallery.prototype.getElementById = function(id) {
            return $LG("#" + this.getIdName(id));
        };
        LightGallery.prototype.manageSingleSlideClassName = function() {
            if (this.galleryItems.length < 2) this.outer.addClass("lg-single-item"); else this.outer.removeClass("lg-single-item");
        };
        LightGallery.prototype.buildStructure = function() {
            var _this = this;
            var container = this.$container && this.$container.get();
            if (container) return;
            var controls = "";
            var subHtmlCont = "";
            if (this.settings.controls) controls = '<button type="button" id="' + this.getIdName("lg-prev") + '" aria-label="' + this.settings.strings["previousSlide"] + '" class="lg-prev lg-icon"> ' + this.settings.prevHtml + ' </button>\n                <button type="button" id="' + this.getIdName("lg-next") + '" aria-label="' + this.settings.strings["nextSlide"] + '" class="lg-next lg-icon"> ' + this.settings.nextHtml + " </button>";
            if (".lg-item" !== this.settings.appendSubHtmlTo) subHtmlCont = '<div class="lg-sub-html" role="status" aria-live="polite"></div>';
            var addClasses = "";
            if (this.settings.allowMediaOverlap) addClasses += "lg-media-overlap ";
            var ariaLabelledby = this.settings.ariaLabelledby ? 'aria-labelledby="' + this.settings.ariaLabelledby + '"' : "";
            var ariaDescribedby = this.settings.ariaDescribedby ? 'aria-describedby="' + this.settings.ariaDescribedby + '"' : "";
            var containerClassName = "lg-container " + this.settings.addClass + " " + (document.body !== this.settings.container ? "lg-inline" : "");
            var closeIcon = this.settings.closable && this.settings.showCloseIcon ? '<button type="button" aria-label="' + this.settings.strings["closeGallery"] + '" id="' + this.getIdName("lg-close") + '" class="lg-close lg-icon"></button>' : "";
            var maximizeIcon = this.settings.showMaximizeIcon ? '<button type="button" aria-label="' + this.settings.strings["toggleMaximize"] + '" id="' + this.getIdName("lg-maximize") + '" class="lg-maximize lg-icon"></button>' : "";
            var template = '\n        <div class="' + containerClassName + '" id="' + this.getIdName("lg-container") + '" tabindex="-1" aria-modal="true" ' + ariaLabelledby + " " + ariaDescribedby + ' role="dialog"\n        >\n            <div id="' + this.getIdName("lg-backdrop") + '" class="lg-backdrop"></div>\n\n            <div id="' + this.getIdName("lg-outer") + '" class="lg-outer lg-use-css3 lg-css3 lg-hide-items ' + addClasses + ' ">\n\n              <div id="' + this.getIdName("lg-content") + '" class="lg-content">\n                <div id="' + this.getIdName("lg-inner") + '" class="lg-inner">\n                </div>\n                ' + controls + '\n              </div>\n                <div id="' + this.getIdName("lg-toolbar") + '" class="lg-toolbar lg-group">\n                    ' + maximizeIcon + "\n                    " + closeIcon + "\n                    </div>\n                    " + (".lg-outer" === this.settings.appendSubHtmlTo ? subHtmlCont : "") + '\n                <div id="' + this.getIdName("lg-components") + '" class="lg-components">\n                    ' + (".lg-sub-html" === this.settings.appendSubHtmlTo ? subHtmlCont : "") + "\n                </div>\n            </div>\n        </div>\n        ";
            $LG(this.settings.container).append(template);
            if (document.body !== this.settings.container) $LG(this.settings.container).css("position", "relative");
            this.outer = this.getElementById("lg-outer");
            this.$lgComponents = this.getElementById("lg-components");
            this.$backdrop = this.getElementById("lg-backdrop");
            this.$container = this.getElementById("lg-container");
            this.$inner = this.getElementById("lg-inner");
            this.$content = this.getElementById("lg-content");
            this.$toolbar = this.getElementById("lg-toolbar");
            this.$backdrop.css("transition-duration", this.settings.backdropDuration + "ms");
            var outerClassNames = this.settings.mode + " ";
            this.manageSingleSlideClassName();
            if (this.settings.enableDrag) outerClassNames += "lg-grab ";
            this.outer.addClass(outerClassNames);
            this.$inner.css("transition-timing-function", this.settings.easing);
            this.$inner.css("transition-duration", this.settings.speed + "ms");
            if (this.settings.download) this.$toolbar.append('<a id="' + this.getIdName("lg-download") + '" target="_blank" rel="noopener" aria-label="' + this.settings.strings["download"] + '" download class="lg-download lg-icon"></a>');
            this.counter();
            $LG(window).on("resize.lg.global" + this.lgId + " orientationchange.lg.global" + this.lgId, (function() {
                _this.refreshOnResize();
            }));
            this.hideBars();
            this.manageCloseGallery();
            this.toggleMaximize();
            this.initModules();
        };
        LightGallery.prototype.refreshOnResize = function() {
            if (this.lgOpened) {
                var currentGalleryItem = this.galleryItems[this.index];
                var __slideVideoInfo = currentGalleryItem.__slideVideoInfo;
                this.mediaContainerPosition = this.getMediaContainerPosition();
                var _a = this.mediaContainerPosition, top_1 = _a.top, bottom = _a.bottom;
                this.currentImageSize = utils.getSize(this.items[this.index], this.outer, top_1 + bottom, __slideVideoInfo && this.settings.videoMaxSize);
                if (__slideVideoInfo) this.resizeVideoSlide(this.index, this.currentImageSize);
                if (this.zoomFromOrigin && !this.isDummyImageRemoved) {
                    var imgStyle = this.getDummyImgStyles(this.currentImageSize);
                    this.outer.find(".lg-current .lg-dummy-img").first().attr("style", imgStyle);
                }
                this.LGel.trigger(lGEvents.containerResize);
            }
        };
        LightGallery.prototype.resizeVideoSlide = function(index, imageSize) {
            var lgVideoStyle = this.getVideoContStyle(imageSize);
            var currentSlide = this.getSlideItem(index);
            currentSlide.find(".lg-video-cont").attr("style", lgVideoStyle);
        };
        LightGallery.prototype.updateSlides = function(items, index) {
            if (this.index > items.length - 1) this.index = items.length - 1;
            if (1 === items.length) this.index = 0;
            if (!items.length) {
                this.closeGallery();
                return;
            }
            var currentSrc = this.galleryItems[index].src;
            this.galleryItems = items;
            this.updateControls();
            this.$inner.empty();
            this.currentItemsInDom = [];
            var _index = 0;
            this.galleryItems.some((function(galleryItem, itemIndex) {
                if (galleryItem.src === currentSrc) {
                    _index = itemIndex;
                    return true;
                }
                return false;
            }));
            this.currentItemsInDom = this.organizeSlideItems(_index, -1);
            this.loadContent(_index, true);
            this.getSlideItem(_index).addClass("lg-current");
            this.index = _index;
            this.updateCurrentCounter(_index);
            this.LGel.trigger(lGEvents.updateSlides);
        };
        LightGallery.prototype.getItems = function() {
            this.items = [];
            if (!this.settings.dynamic) {
                if ("this" === this.settings.selector) this.items.push(this.el); else if (this.settings.selector) if ("string" === typeof this.settings.selector) if (this.settings.selectWithin) {
                    var selectWithin = $LG(this.settings.selectWithin);
                    this.items = selectWithin.find(this.settings.selector).get();
                } else this.items = this.el.querySelectorAll(this.settings.selector); else this.items = this.settings.selector; else this.items = this.el.children;
                return utils.getDynamicOptions(this.items, this.settings.extraProps, this.settings.getCaptionFromTitleOrAlt, this.settings.exThumbImage);
            } else return this.settings.dynamicEl || [];
        };
        LightGallery.prototype.shouldHideScrollbar = function() {
            return this.settings.hideScrollbar && document.body === this.settings.container;
        };
        LightGallery.prototype.hideScrollbar = function() {
            if (!this.shouldHideScrollbar()) return;
            this.bodyPaddingRight = parseFloat($LG("body").style().paddingRight);
            var bodyRect = document.documentElement.getBoundingClientRect();
            var scrollbarWidth = window.innerWidth - bodyRect.width;
            $LG(document.body).css("padding-right", scrollbarWidth + this.bodyPaddingRight + "px");
            $LG(document.body).addClass("lg-overlay-open");
        };
        LightGallery.prototype.resetScrollBar = function() {
            if (!this.shouldHideScrollbar()) return;
            $LG(document.body).css("padding-right", this.bodyPaddingRight + "px");
            $LG(document.body).removeClass("lg-overlay-open");
        };
        LightGallery.prototype.openGallery = function(index, element) {
            var _this = this;
            if (void 0 === index) index = this.settings.index;
            if (this.lgOpened) return;
            this.lgOpened = true;
            this.outer.removeClass("lg-hide-items");
            this.hideScrollbar();
            this.$container.addClass("lg-show");
            var itemsToBeInsertedToDom = this.getItemsToBeInsertedToDom(index, index);
            this.currentItemsInDom = itemsToBeInsertedToDom;
            var items = "";
            itemsToBeInsertedToDom.forEach((function(item) {
                items = items + '<div id="' + item + '" class="lg-item"></div>';
            }));
            this.$inner.append(items);
            this.addHtml(index);
            var transform = "";
            this.mediaContainerPosition = this.getMediaContainerPosition();
            var _a = this.mediaContainerPosition, top = _a.top, bottom = _a.bottom;
            if (!this.settings.allowMediaOverlap) this.setMediaContainerPosition(top, bottom);
            var __slideVideoInfo = this.galleryItems[index].__slideVideoInfo;
            if (this.zoomFromOrigin && element) {
                this.currentImageSize = utils.getSize(element, this.outer, top + bottom, __slideVideoInfo && this.settings.videoMaxSize);
                transform = utils.getTransform(element, this.outer, top, bottom, this.currentImageSize);
            }
            if (!this.zoomFromOrigin || !transform) {
                this.outer.addClass(this.settings.startClass);
                this.getSlideItem(index).removeClass("lg-complete");
            }
            var timeout = this.settings.zoomFromOrigin ? 100 : this.settings.backdropDuration;
            setTimeout((function() {
                _this.outer.addClass("lg-components-open");
            }), timeout);
            this.index = index;
            this.LGel.trigger(lGEvents.beforeOpen);
            this.getSlideItem(index).addClass("lg-current");
            this.lGalleryOn = false;
            this.prevScrollTop = $LG(window).scrollTop();
            setTimeout((function() {
                if (_this.zoomFromOrigin && transform) {
                    var currentSlide_1 = _this.getSlideItem(index);
                    currentSlide_1.css("transform", transform);
                    setTimeout((function() {
                        currentSlide_1.addClass("lg-start-progress lg-start-end-progress").css("transition-duration", _this.settings.startAnimationDuration + "ms");
                        _this.outer.addClass("lg-zoom-from-image");
                    }));
                    setTimeout((function() {
                        currentSlide_1.css("transform", "translate3d(0, 0, 0)");
                    }), 100);
                }
                setTimeout((function() {
                    _this.$backdrop.addClass("in");
                    _this.$container.addClass("lg-show-in");
                }), 10);
                setTimeout((function() {
                    if (_this.settings.trapFocus && document.body === _this.settings.container) _this.trapFocus();
                }), _this.settings.backdropDuration + 50);
                if (!_this.zoomFromOrigin || !transform) setTimeout((function() {
                    _this.outer.addClass("lg-visible");
                }), _this.settings.backdropDuration);
                _this.slide(index, false, false, false);
                _this.LGel.trigger(lGEvents.afterOpen);
            }));
            if (document.body === this.settings.container) $LG("html").addClass("lg-on");
        };
        LightGallery.prototype.getMediaContainerPosition = function() {
            if (this.settings.allowMediaOverlap) return {
                top: 0,
                bottom: 0
            };
            var top = this.$toolbar.get().clientHeight || 0;
            var subHtml = this.outer.find(".lg-components .lg-sub-html").get();
            var captionHeight = this.settings.defaultCaptionHeight || subHtml && subHtml.clientHeight || 0;
            var thumbContainer = this.outer.find(".lg-thumb-outer").get();
            var thumbHeight = thumbContainer ? thumbContainer.clientHeight : 0;
            var bottom = thumbHeight + captionHeight;
            return {
                top,
                bottom
            };
        };
        LightGallery.prototype.setMediaContainerPosition = function(top, bottom) {
            if (void 0 === top) top = 0;
            if (void 0 === bottom) bottom = 0;
            this.$content.css("top", top + "px").css("bottom", bottom + "px");
        };
        LightGallery.prototype.hideBars = function() {
            var _this = this;
            setTimeout((function() {
                _this.outer.removeClass("lg-hide-items");
                if (_this.settings.hideBarsDelay > 0) {
                    _this.outer.on("mousemove.lg click.lg touchstart.lg", (function() {
                        _this.outer.removeClass("lg-hide-items");
                        clearTimeout(_this.hideBarTimeout);
                        _this.hideBarTimeout = setTimeout((function() {
                            _this.outer.addClass("lg-hide-items");
                        }), _this.settings.hideBarsDelay);
                    }));
                    _this.outer.trigger("mousemove.lg");
                }
            }), this.settings.showBarsAfter);
        };
        LightGallery.prototype.initPictureFill = function($img) {
            if (this.settings.supportLegacyBrowser) try {
                picturefill({
                    elements: [ $img.get() ]
                });
            } catch (e) {
                console.warn("lightGallery :- If you want srcset or picture tag to be supported for older browser please include picturefil javascript library in your document.");
            }
        };
        LightGallery.prototype.counter = function() {
            if (this.settings.counter) {
                var counterHtml = '<div class="lg-counter" role="status" aria-live="polite">\n                <span id="' + this.getIdName("lg-counter-current") + '" class="lg-counter-current">' + (this.index + 1) + ' </span> /\n                <span id="' + this.getIdName("lg-counter-all") + '" class="lg-counter-all">' + this.galleryItems.length + " </span></div>";
                this.outer.find(this.settings.appendCounterTo).append(counterHtml);
            }
        };
        LightGallery.prototype.addHtml = function(index) {
            var subHtml;
            var subHtmlUrl;
            if (this.galleryItems[index].subHtmlUrl) subHtmlUrl = this.galleryItems[index].subHtmlUrl; else subHtml = this.galleryItems[index].subHtml;
            if (!subHtmlUrl) if (subHtml) {
                var fL = subHtml.substring(0, 1);
                if ("." === fL || "#" === fL) if (this.settings.subHtmlSelectorRelative && !this.settings.dynamic) subHtml = $LG(this.items).eq(index).find(subHtml).first().html(); else subHtml = $LG(subHtml).first().html();
            } else subHtml = "";
            if (".lg-item" !== this.settings.appendSubHtmlTo) if (subHtmlUrl) this.outer.find(".lg-sub-html").load(subHtmlUrl); else this.outer.find(".lg-sub-html").html(subHtml); else {
                var currentSlide = $LG(this.getSlideItemId(index));
                if (subHtmlUrl) currentSlide.load(subHtmlUrl); else currentSlide.append('<div class="lg-sub-html">' + subHtml + "</div>");
            }
            if ("undefined" !== typeof subHtml && null !== subHtml) if ("" === subHtml) this.outer.find(this.settings.appendSubHtmlTo).addClass("lg-empty-html"); else this.outer.find(this.settings.appendSubHtmlTo).removeClass("lg-empty-html");
            this.LGel.trigger(lGEvents.afterAppendSubHtml, {
                index
            });
        };
        LightGallery.prototype.preload = function(index) {
            for (var i = 1; i <= this.settings.preload; i++) {
                if (i >= this.galleryItems.length - index) break;
                this.loadContent(index + i, false);
            }
            for (var j = 1; j <= this.settings.preload; j++) {
                if (index - j < 0) break;
                this.loadContent(index - j, false);
            }
        };
        LightGallery.prototype.getDummyImgStyles = function(imageSize) {
            if (!imageSize) return "";
            return "width:" + imageSize.width + "px;\n                margin-left: -" + imageSize.width / 2 + "px;\n                margin-top: -" + imageSize.height / 2 + "px;\n                height:" + imageSize.height + "px";
        };
        LightGallery.prototype.getVideoContStyle = function(imageSize) {
            if (!imageSize) return "";
            return "width:" + imageSize.width + "px;\n                height:" + imageSize.height + "px";
        };
        LightGallery.prototype.getDummyImageContent = function($currentSlide, index, alt) {
            var $currentItem;
            if (!this.settings.dynamic) $currentItem = $LG(this.items).eq(index);
            if ($currentItem) {
                var _dummyImgSrc = void 0;
                if (!this.settings.exThumbImage) _dummyImgSrc = $currentItem.find("img").first().attr("src"); else _dummyImgSrc = $currentItem.attr(this.settings.exThumbImage);
                if (!_dummyImgSrc) return "";
                var imgStyle = this.getDummyImgStyles(this.currentImageSize);
                var dummyImgContent = "<img " + alt + ' style="' + imgStyle + '" class="lg-dummy-img" src="' + _dummyImgSrc + '" />';
                $currentSlide.addClass("lg-first-slide");
                this.outer.addClass("lg-first-slide-loading");
                return dummyImgContent;
            }
            return "";
        };
        LightGallery.prototype.setImgMarkup = function(src, $currentSlide, index) {
            var currentGalleryItem = this.galleryItems[index];
            var alt = currentGalleryItem.alt, srcset = currentGalleryItem.srcset, sizes = currentGalleryItem.sizes, sources = currentGalleryItem.sources;
            var imgContent = "";
            var altAttr = alt ? 'alt="' + alt + '"' : "";
            if (this.isFirstSlideWithZoomAnimation()) imgContent = this.getDummyImageContent($currentSlide, index, altAttr); else imgContent = utils.getImgMarkup(index, src, altAttr, srcset, sizes, sources);
            var imgMarkup = '<picture class="lg-img-wrap"> ' + imgContent + "</picture>";
            $currentSlide.prepend(imgMarkup);
        };
        LightGallery.prototype.onSlideObjectLoad = function($slide, isHTML5VideoWithoutPoster, onLoad, onError) {
            var mediaObject = $slide.find(".lg-object").first();
            if (utils.isImageLoaded(mediaObject.get()) || isHTML5VideoWithoutPoster) onLoad(); else {
                mediaObject.on("load.lg error.lg", (function() {
                    onLoad && onLoad();
                }));
                mediaObject.on("error.lg", (function() {
                    onError && onError();
                }));
            }
        };
        LightGallery.prototype.onLgObjectLoad = function(currentSlide, index, delay, speed, isFirstSlide, isHTML5VideoWithoutPoster) {
            var _this = this;
            this.onSlideObjectLoad(currentSlide, isHTML5VideoWithoutPoster, (function() {
                _this.triggerSlideItemLoad(currentSlide, index, delay, speed, isFirstSlide);
            }), (function() {
                currentSlide.addClass("lg-complete lg-complete_");
                currentSlide.html('<span class="lg-error-msg">Oops... Failed to load content...</span>');
            }));
        };
        LightGallery.prototype.triggerSlideItemLoad = function($currentSlide, index, delay, speed, isFirstSlide) {
            var _this = this;
            var currentGalleryItem = this.galleryItems[index];
            var _speed = isFirstSlide && "video" === this.getSlideType(currentGalleryItem) && !currentGalleryItem.poster ? speed : 0;
            setTimeout((function() {
                $currentSlide.addClass("lg-complete lg-complete_");
                _this.LGel.trigger(lGEvents.slideItemLoad, {
                    index,
                    delay: delay || 0,
                    isFirstSlide
                });
            }), _speed);
        };
        LightGallery.prototype.isFirstSlideWithZoomAnimation = function() {
            return !!(!this.lGalleryOn && this.zoomFromOrigin && this.currentImageSize);
        };
        LightGallery.prototype.addSlideVideoInfo = function(items) {
            var _this = this;
            items.forEach((function(element, index) {
                element.__slideVideoInfo = utils.isVideo(element.src, !!element.video, index);
                if (element.__slideVideoInfo && _this.settings.loadYouTubePoster && !element.poster && element.__slideVideoInfo.youtube) element.poster = "//img.youtube.com/vi/" + element.__slideVideoInfo.youtube[1] + "/maxresdefault.jpg";
            }));
        };
        LightGallery.prototype.loadContent = function(index, rec) {
            var _this = this;
            var currentGalleryItem = this.galleryItems[index];
            var $currentSlide = $LG(this.getSlideItemId(index));
            var poster = currentGalleryItem.poster, srcset = currentGalleryItem.srcset, sizes = currentGalleryItem.sizes, sources = currentGalleryItem.sources;
            var src = currentGalleryItem.src;
            var video = currentGalleryItem.video;
            var _html5Video = video && "string" === typeof video ? JSON.parse(video) : video;
            if (currentGalleryItem.responsive) {
                var srcDyItms = currentGalleryItem.responsive.split(",");
                src = utils.getResponsiveSrc(srcDyItms) || src;
            }
            var videoInfo = currentGalleryItem.__slideVideoInfo;
            var lgVideoStyle = "";
            var iframe = !!currentGalleryItem.iframe;
            var isFirstSlide = !this.lGalleryOn;
            var delay = 0;
            if (isFirstSlide) if (this.zoomFromOrigin && this.currentImageSize) delay = this.settings.startAnimationDuration + 10; else delay = this.settings.backdropDuration + 10;
            if (!$currentSlide.hasClass("lg-loaded")) {
                if (videoInfo) {
                    var _a = this.mediaContainerPosition, top_2 = _a.top, bottom = _a.bottom;
                    var videoSize = utils.getSize(this.items[index], this.outer, top_2 + bottom, videoInfo && this.settings.videoMaxSize);
                    lgVideoStyle = this.getVideoContStyle(videoSize);
                }
                if (iframe) {
                    var markup = utils.getIframeMarkup(this.settings.iframeWidth, this.settings.iframeHeight, this.settings.iframeMaxWidth, this.settings.iframeMaxHeight, src, currentGalleryItem.iframeTitle);
                    $currentSlide.prepend(markup);
                } else if (poster) {
                    var dummyImg = "";
                    var hasStartAnimation = isFirstSlide && this.zoomFromOrigin && this.currentImageSize;
                    if (hasStartAnimation) dummyImg = this.getDummyImageContent($currentSlide, index, "");
                    markup = utils.getVideoPosterMarkup(poster, dummyImg || "", lgVideoStyle, this.settings.strings["playVideo"], videoInfo);
                    $currentSlide.prepend(markup);
                } else if (videoInfo) {
                    markup = '<div class="lg-video-cont " style="' + lgVideoStyle + '"></div>';
                    $currentSlide.prepend(markup);
                } else {
                    this.setImgMarkup(src, $currentSlide, index);
                    if (srcset || sources) {
                        var $img = $currentSlide.find(".lg-object");
                        this.initPictureFill($img);
                    }
                }
                if (poster || videoInfo) this.LGel.trigger(lGEvents.hasVideo, {
                    index,
                    src,
                    html5Video: _html5Video,
                    hasPoster: !!poster
                });
                this.LGel.trigger(lGEvents.afterAppendSlide, {
                    index
                });
                if (this.lGalleryOn && ".lg-item" === this.settings.appendSubHtmlTo) this.addHtml(index);
            }
            var _speed = 0;
            if (delay && !$LG(document.body).hasClass("lg-from-hash")) _speed = delay;
            if (this.isFirstSlideWithZoomAnimation()) {
                setTimeout((function() {
                    $currentSlide.removeClass("lg-start-end-progress lg-start-progress").removeAttr("style");
                }), this.settings.startAnimationDuration + 100);
                if (!$currentSlide.hasClass("lg-loaded")) setTimeout((function() {
                    if ("image" === _this.getSlideType(currentGalleryItem)) {
                        var alt = currentGalleryItem.alt;
                        var altAttr = alt ? 'alt="' + alt + '"' : "";
                        $currentSlide.find(".lg-img-wrap").append(utils.getImgMarkup(index, src, altAttr, srcset, sizes, currentGalleryItem.sources));
                        if (srcset || sources) {
                            var $img = $currentSlide.find(".lg-object");
                            _this.initPictureFill($img);
                        }
                    }
                    if ("image" === _this.getSlideType(currentGalleryItem) || "video" === _this.getSlideType(currentGalleryItem) && poster) {
                        _this.onLgObjectLoad($currentSlide, index, delay, _speed, true, false);
                        _this.onSlideObjectLoad($currentSlide, !!(videoInfo && videoInfo.html5 && !poster), (function() {
                            _this.loadContentOnFirstSlideLoad(index, $currentSlide, _speed);
                        }), (function() {
                            _this.loadContentOnFirstSlideLoad(index, $currentSlide, _speed);
                        }));
                    }
                }), this.settings.startAnimationDuration + 100);
            }
            $currentSlide.addClass("lg-loaded");
            if (!this.isFirstSlideWithZoomAnimation() || "video" === this.getSlideType(currentGalleryItem) && !poster) this.onLgObjectLoad($currentSlide, index, delay, _speed, isFirstSlide, !!(videoInfo && videoInfo.html5 && !poster));
            if ((!this.zoomFromOrigin || !this.currentImageSize) && $currentSlide.hasClass("lg-complete_") && !this.lGalleryOn) setTimeout((function() {
                $currentSlide.addClass("lg-complete");
            }), this.settings.backdropDuration);
            this.lGalleryOn = true;
            if (true === rec) if (!$currentSlide.hasClass("lg-complete_")) $currentSlide.find(".lg-object").first().on("load.lg error.lg", (function() {
                _this.preload(index);
            })); else this.preload(index);
        };
        LightGallery.prototype.loadContentOnFirstSlideLoad = function(index, $currentSlide, speed) {
            var _this = this;
            setTimeout((function() {
                $currentSlide.find(".lg-dummy-img").remove();
                $currentSlide.removeClass("lg-first-slide");
                _this.outer.removeClass("lg-first-slide-loading");
                _this.isDummyImageRemoved = true;
                _this.preload(index);
            }), speed + 300);
        };
        LightGallery.prototype.getItemsToBeInsertedToDom = function(index, prevIndex, numberOfItems) {
            var _this = this;
            if (void 0 === numberOfItems) numberOfItems = 0;
            var itemsToBeInsertedToDom = [];
            var possibleNumberOfItems = Math.max(numberOfItems, 3);
            possibleNumberOfItems = Math.min(possibleNumberOfItems, this.galleryItems.length);
            var prevIndexItem = "lg-item-" + this.lgId + "-" + prevIndex;
            if (this.galleryItems.length <= 3) {
                this.galleryItems.forEach((function(_element, index) {
                    itemsToBeInsertedToDom.push("lg-item-" + _this.lgId + "-" + index);
                }));
                return itemsToBeInsertedToDom;
            }
            if (index < (this.galleryItems.length - 1) / 2) {
                for (var idx = index; idx > index - possibleNumberOfItems / 2 && idx >= 0; idx--) itemsToBeInsertedToDom.push("lg-item-" + this.lgId + "-" + idx);
                var numberOfExistingItems = itemsToBeInsertedToDom.length;
                for (idx = 0; idx < possibleNumberOfItems - numberOfExistingItems; idx++) itemsToBeInsertedToDom.push("lg-item-" + this.lgId + "-" + (index + idx + 1));
            } else {
                for (idx = index; idx <= this.galleryItems.length - 1 && idx < index + possibleNumberOfItems / 2; idx++) itemsToBeInsertedToDom.push("lg-item-" + this.lgId + "-" + idx);
                numberOfExistingItems = itemsToBeInsertedToDom.length;
                for (idx = 0; idx < possibleNumberOfItems - numberOfExistingItems; idx++) itemsToBeInsertedToDom.push("lg-item-" + this.lgId + "-" + (index - idx - 1));
            }
            if (this.settings.loop) if (index === this.galleryItems.length - 1) itemsToBeInsertedToDom.push("lg-item-" + this.lgId + "-" + 0); else if (0 === index) itemsToBeInsertedToDom.push("lg-item-" + this.lgId + "-" + (this.galleryItems.length - 1));
            if (-1 === itemsToBeInsertedToDom.indexOf(prevIndexItem)) itemsToBeInsertedToDom.push("lg-item-" + this.lgId + "-" + prevIndex);
            return itemsToBeInsertedToDom;
        };
        LightGallery.prototype.organizeSlideItems = function(index, prevIndex) {
            var _this = this;
            var itemsToBeInsertedToDom = this.getItemsToBeInsertedToDom(index, prevIndex, this.settings.numberOfSlideItemsInDom);
            itemsToBeInsertedToDom.forEach((function(item) {
                if (-1 === _this.currentItemsInDom.indexOf(item)) _this.$inner.append('<div id="' + item + '" class="lg-item"></div>');
            }));
            this.currentItemsInDom.forEach((function(item) {
                if (-1 === itemsToBeInsertedToDom.indexOf(item)) $LG("#" + item).remove();
            }));
            return itemsToBeInsertedToDom;
        };
        LightGallery.prototype.getPreviousSlideIndex = function() {
            var prevIndex = 0;
            try {
                var currentItemId = this.outer.find(".lg-current").first().attr("id");
                prevIndex = parseInt(currentItemId.split("-")[3]) || 0;
            } catch (error) {
                prevIndex = 0;
            }
            return prevIndex;
        };
        LightGallery.prototype.setDownloadValue = function(index) {
            if (this.settings.download) {
                var currentGalleryItem = this.galleryItems[index];
                var hideDownloadBtn = false === currentGalleryItem.downloadUrl || "false" === currentGalleryItem.downloadUrl;
                if (hideDownloadBtn) this.outer.addClass("lg-hide-download"); else {
                    var $download = this.getElementById("lg-download");
                    this.outer.removeClass("lg-hide-download");
                    $download.attr("href", currentGalleryItem.downloadUrl || currentGalleryItem.src);
                    if (currentGalleryItem.download) $download.attr("download", currentGalleryItem.download);
                }
            }
        };
        LightGallery.prototype.makeSlideAnimation = function(direction, currentSlideItem, previousSlideItem) {
            var _this = this;
            if (this.lGalleryOn) previousSlideItem.addClass("lg-slide-progress");
            setTimeout((function() {
                _this.outer.addClass("lg-no-trans");
                _this.outer.find(".lg-item").removeClass("lg-prev-slide lg-next-slide");
                if ("prev" === direction) {
                    currentSlideItem.addClass("lg-prev-slide");
                    previousSlideItem.addClass("lg-next-slide");
                } else {
                    currentSlideItem.addClass("lg-next-slide");
                    previousSlideItem.addClass("lg-prev-slide");
                }
                setTimeout((function() {
                    _this.outer.find(".lg-item").removeClass("lg-current");
                    currentSlideItem.addClass("lg-current");
                    _this.outer.removeClass("lg-no-trans");
                }), 50);
            }), this.lGalleryOn ? this.settings.slideDelay : 0);
        };
        LightGallery.prototype.slide = function(index, fromTouch, fromThumb, direction) {
            var _this = this;
            var prevIndex = this.getPreviousSlideIndex();
            this.currentItemsInDom = this.organizeSlideItems(index, prevIndex);
            if (this.lGalleryOn && prevIndex === index) return;
            var numberOfGalleryItems = this.galleryItems.length;
            if (!this.lgBusy) {
                if (this.settings.counter) this.updateCurrentCounter(index);
                var currentSlideItem = this.getSlideItem(index);
                var previousSlideItem_1 = this.getSlideItem(prevIndex);
                var currentGalleryItem = this.galleryItems[index];
                var videoInfo = currentGalleryItem.__slideVideoInfo;
                this.outer.attr("data-lg-slide-type", this.getSlideType(currentGalleryItem));
                this.setDownloadValue(index);
                if (videoInfo) {
                    var _a = this.mediaContainerPosition, top_3 = _a.top, bottom = _a.bottom;
                    var videoSize = utils.getSize(this.items[index], this.outer, top_3 + bottom, videoInfo && this.settings.videoMaxSize);
                    this.resizeVideoSlide(index, videoSize);
                }
                this.LGel.trigger(lGEvents.beforeSlide, {
                    prevIndex,
                    index,
                    fromTouch: !!fromTouch,
                    fromThumb: !!fromThumb
                });
                this.lgBusy = true;
                clearTimeout(this.hideBarTimeout);
                this.arrowDisable(index);
                if (!direction) if (index < prevIndex) direction = "prev"; else if (index > prevIndex) direction = "next";
                if (!fromTouch) this.makeSlideAnimation(direction, currentSlideItem, previousSlideItem_1); else {
                    this.outer.find(".lg-item").removeClass("lg-prev-slide lg-current lg-next-slide");
                    var touchPrev = void 0;
                    var touchNext = void 0;
                    if (numberOfGalleryItems > 2) {
                        touchPrev = index - 1;
                        touchNext = index + 1;
                        if (0 === index && prevIndex === numberOfGalleryItems - 1) {
                            touchNext = 0;
                            touchPrev = numberOfGalleryItems - 1;
                        } else if (index === numberOfGalleryItems - 1 && 0 === prevIndex) {
                            touchNext = 0;
                            touchPrev = numberOfGalleryItems - 1;
                        }
                    } else {
                        touchPrev = 0;
                        touchNext = 1;
                    }
                    if ("prev" === direction) this.getSlideItem(touchNext).addClass("lg-next-slide"); else this.getSlideItem(touchPrev).addClass("lg-prev-slide");
                    currentSlideItem.addClass("lg-current");
                }
                if (!this.lGalleryOn) this.loadContent(index, true); else setTimeout((function() {
                    _this.loadContent(index, true);
                    if (".lg-item" !== _this.settings.appendSubHtmlTo) _this.addHtml(index);
                }), this.settings.speed + 50 + (fromTouch ? 0 : this.settings.slideDelay));
                setTimeout((function() {
                    _this.lgBusy = false;
                    previousSlideItem_1.removeClass("lg-slide-progress");
                    _this.LGel.trigger(lGEvents.afterSlide, {
                        prevIndex,
                        index,
                        fromTouch,
                        fromThumb
                    });
                }), (this.lGalleryOn ? this.settings.speed + 100 : 100) + (fromTouch ? 0 : this.settings.slideDelay));
            }
            this.index = index;
        };
        LightGallery.prototype.updateCurrentCounter = function(index) {
            this.getElementById("lg-counter-current").html(index + 1 + "");
        };
        LightGallery.prototype.updateCounterTotal = function() {
            this.getElementById("lg-counter-all").html(this.galleryItems.length + "");
        };
        LightGallery.prototype.getSlideType = function(item) {
            if (item.__slideVideoInfo) return "video"; else if (item.iframe) return "iframe"; else return "image";
        };
        LightGallery.prototype.touchMove = function(startCoords, endCoords, e) {
            var distanceX = endCoords.pageX - startCoords.pageX;
            var distanceY = endCoords.pageY - startCoords.pageY;
            var allowSwipe = false;
            if (this.swipeDirection) allowSwipe = true; else if (Math.abs(distanceX) > 15) {
                this.swipeDirection = "horizontal";
                allowSwipe = true;
            } else if (Math.abs(distanceY) > 15) {
                this.swipeDirection = "vertical";
                allowSwipe = true;
            }
            if (!allowSwipe) return;
            var $currentSlide = this.getSlideItem(this.index);
            if ("horizontal" === this.swipeDirection) {
                null === e || void 0 === e ? void 0 : e.preventDefault();
                this.outer.addClass("lg-dragging");
                this.setTranslate($currentSlide, distanceX, 0);
                var width = $currentSlide.get().offsetWidth;
                var slideWidthAmount = 15 * width / 100;
                var gutter = slideWidthAmount - Math.abs(10 * distanceX / 100);
                this.setTranslate(this.outer.find(".lg-prev-slide").first(), -width + distanceX - gutter, 0);
                this.setTranslate(this.outer.find(".lg-next-slide").first(), width + distanceX + gutter, 0);
            } else if ("vertical" === this.swipeDirection) if (this.settings.swipeToClose) {
                null === e || void 0 === e ? void 0 : e.preventDefault();
                this.$container.addClass("lg-dragging-vertical");
                var opacity = 1 - Math.abs(distanceY) / window.innerHeight;
                this.$backdrop.css("opacity", opacity);
                var scale = 1 - Math.abs(distanceY) / (2 * window.innerWidth);
                this.setTranslate($currentSlide, 0, distanceY, scale, scale);
                if (Math.abs(distanceY) > 100) this.outer.addClass("lg-hide-items").removeClass("lg-components-open");
            }
        };
        LightGallery.prototype.touchEnd = function(endCoords, startCoords, event) {
            var _this = this;
            var distance;
            if ("lg-slide" !== this.settings.mode) this.outer.addClass("lg-slide");
            setTimeout((function() {
                _this.$container.removeClass("lg-dragging-vertical");
                _this.outer.removeClass("lg-dragging lg-hide-items").addClass("lg-components-open");
                var triggerClick = true;
                if ("horizontal" === _this.swipeDirection) {
                    distance = endCoords.pageX - startCoords.pageX;
                    var distanceAbs = Math.abs(endCoords.pageX - startCoords.pageX);
                    if (distance < 0 && distanceAbs > _this.settings.swipeThreshold) {
                        _this.goToNextSlide(true);
                        triggerClick = false;
                    } else if (distance > 0 && distanceAbs > _this.settings.swipeThreshold) {
                        _this.goToPrevSlide(true);
                        triggerClick = false;
                    }
                } else if ("vertical" === _this.swipeDirection) {
                    distance = Math.abs(endCoords.pageY - startCoords.pageY);
                    if (_this.settings.closable && _this.settings.swipeToClose && distance > 100) {
                        _this.closeGallery();
                        return;
                    } else _this.$backdrop.css("opacity", 1);
                }
                _this.outer.find(".lg-item").removeAttr("style");
                if (triggerClick && Math.abs(endCoords.pageX - startCoords.pageX) < 5) {
                    var target = $LG(event.target);
                    if (_this.isPosterElement(target)) _this.LGel.trigger(lGEvents.posterClick);
                }
                _this.swipeDirection = void 0;
            }));
            setTimeout((function() {
                if (!_this.outer.hasClass("lg-dragging") && "lg-slide" !== _this.settings.mode) _this.outer.removeClass("lg-slide");
            }), this.settings.speed + 100);
        };
        LightGallery.prototype.enableSwipe = function() {
            var _this = this;
            var startCoords = {};
            var endCoords = {};
            var isMoved = false;
            var isSwiping = false;
            if (this.settings.enableSwipe) {
                this.$inner.on("touchstart.lg", (function(e) {
                    _this.dragOrSwipeEnabled = true;
                    var $item = _this.getSlideItem(_this.index);
                    if (($LG(e.target).hasClass("lg-item") || $item.get().contains(e.target)) && !_this.outer.hasClass("lg-zoomed") && !_this.lgBusy && 1 === e.targetTouches.length) {
                        isSwiping = true;
                        _this.touchAction = "swipe";
                        _this.manageSwipeClass();
                        startCoords = {
                            pageX: e.targetTouches[0].pageX,
                            pageY: e.targetTouches[0].pageY
                        };
                    }
                }));
                this.$inner.on("touchmove.lg", (function(e) {
                    if (isSwiping && "swipe" === _this.touchAction && 1 === e.targetTouches.length) {
                        endCoords = {
                            pageX: e.targetTouches[0].pageX,
                            pageY: e.targetTouches[0].pageY
                        };
                        _this.touchMove(startCoords, endCoords, e);
                        isMoved = true;
                    }
                }));
                this.$inner.on("touchend.lg", (function(event) {
                    if ("swipe" === _this.touchAction) {
                        if (isMoved) {
                            isMoved = false;
                            _this.touchEnd(endCoords, startCoords, event);
                        } else if (isSwiping) {
                            var target = $LG(event.target);
                            if (_this.isPosterElement(target)) _this.LGel.trigger(lGEvents.posterClick);
                        }
                        _this.touchAction = void 0;
                        isSwiping = false;
                    }
                }));
            }
        };
        LightGallery.prototype.enableDrag = function() {
            var _this = this;
            var startCoords = {};
            var endCoords = {};
            var isDraging = false;
            var isMoved = false;
            if (this.settings.enableDrag) {
                this.outer.on("mousedown.lg", (function(e) {
                    _this.dragOrSwipeEnabled = true;
                    var $item = _this.getSlideItem(_this.index);
                    if ($LG(e.target).hasClass("lg-item") || $item.get().contains(e.target)) if (!_this.outer.hasClass("lg-zoomed") && !_this.lgBusy) {
                        e.preventDefault();
                        if (!_this.lgBusy) {
                            _this.manageSwipeClass();
                            startCoords = {
                                pageX: e.pageX,
                                pageY: e.pageY
                            };
                            isDraging = true;
                            _this.outer.get().scrollLeft += 1;
                            _this.outer.get().scrollLeft -= 1;
                            _this.outer.removeClass("lg-grab").addClass("lg-grabbing");
                            _this.LGel.trigger(lGEvents.dragStart);
                        }
                    }
                }));
                $LG(window).on("mousemove.lg.global" + this.lgId, (function(e) {
                    if (isDraging && _this.lgOpened) {
                        isMoved = true;
                        endCoords = {
                            pageX: e.pageX,
                            pageY: e.pageY
                        };
                        _this.touchMove(startCoords, endCoords);
                        _this.LGel.trigger(lGEvents.dragMove);
                    }
                }));
                $LG(window).on("mouseup.lg.global" + this.lgId, (function(event) {
                    if (!_this.lgOpened) return;
                    var target = $LG(event.target);
                    if (isMoved) {
                        isMoved = false;
                        _this.touchEnd(endCoords, startCoords, event);
                        _this.LGel.trigger(lGEvents.dragEnd);
                    } else if (_this.isPosterElement(target)) _this.LGel.trigger(lGEvents.posterClick);
                    if (isDraging) {
                        isDraging = false;
                        _this.outer.removeClass("lg-grabbing").addClass("lg-grab");
                    }
                }));
            }
        };
        LightGallery.prototype.triggerPosterClick = function() {
            var _this = this;
            this.$inner.on("click.lg", (function(event) {
                if (!_this.dragOrSwipeEnabled && _this.isPosterElement($LG(event.target))) _this.LGel.trigger(lGEvents.posterClick);
            }));
        };
        LightGallery.prototype.manageSwipeClass = function() {
            var _touchNext = this.index + 1;
            var _touchPrev = this.index - 1;
            if (this.settings.loop && this.galleryItems.length > 2) if (0 === this.index) _touchPrev = this.galleryItems.length - 1; else if (this.index === this.galleryItems.length - 1) _touchNext = 0;
            this.outer.find(".lg-item").removeClass("lg-next-slide lg-prev-slide");
            if (_touchPrev > -1) this.getSlideItem(_touchPrev).addClass("lg-prev-slide");
            this.getSlideItem(_touchNext).addClass("lg-next-slide");
        };
        LightGallery.prototype.goToNextSlide = function(fromTouch) {
            var _this = this;
            var _loop = this.settings.loop;
            if (fromTouch && this.galleryItems.length < 3) _loop = false;
            if (!this.lgBusy) if (this.index + 1 < this.galleryItems.length) {
                this.index++;
                this.LGel.trigger(lGEvents.beforeNextSlide, {
                    index: this.index
                });
                this.slide(this.index, !!fromTouch, false, "next");
            } else if (_loop) {
                this.index = 0;
                this.LGel.trigger(lGEvents.beforeNextSlide, {
                    index: this.index
                });
                this.slide(this.index, !!fromTouch, false, "next");
            } else if (this.settings.slideEndAnimation && !fromTouch) {
                this.outer.addClass("lg-right-end");
                setTimeout((function() {
                    _this.outer.removeClass("lg-right-end");
                }), 400);
            }
        };
        LightGallery.prototype.goToPrevSlide = function(fromTouch) {
            var _this = this;
            var _loop = this.settings.loop;
            if (fromTouch && this.galleryItems.length < 3) _loop = false;
            if (!this.lgBusy) if (this.index > 0) {
                this.index--;
                this.LGel.trigger(lGEvents.beforePrevSlide, {
                    index: this.index,
                    fromTouch
                });
                this.slide(this.index, !!fromTouch, false, "prev");
            } else if (_loop) {
                this.index = this.galleryItems.length - 1;
                this.LGel.trigger(lGEvents.beforePrevSlide, {
                    index: this.index,
                    fromTouch
                });
                this.slide(this.index, !!fromTouch, false, "prev");
            } else if (this.settings.slideEndAnimation && !fromTouch) {
                this.outer.addClass("lg-left-end");
                setTimeout((function() {
                    _this.outer.removeClass("lg-left-end");
                }), 400);
            }
        };
        LightGallery.prototype.keyPress = function() {
            var _this = this;
            $LG(window).on("keydown.lg.global" + this.lgId, (function(e) {
                if (_this.lgOpened && true === _this.settings.escKey && 27 === e.keyCode) {
                    e.preventDefault();
                    if (_this.settings.allowMediaOverlap && _this.outer.hasClass("lg-can-toggle") && _this.outer.hasClass("lg-components-open")) _this.outer.removeClass("lg-components-open"); else _this.closeGallery();
                }
                if (_this.lgOpened && _this.galleryItems.length > 1) {
                    if (37 === e.keyCode) {
                        e.preventDefault();
                        _this.goToPrevSlide();
                    }
                    if (39 === e.keyCode) {
                        e.preventDefault();
                        _this.goToNextSlide();
                    }
                }
            }));
        };
        LightGallery.prototype.arrow = function() {
            var _this = this;
            this.getElementById("lg-prev").on("click.lg", (function() {
                _this.goToPrevSlide();
            }));
            this.getElementById("lg-next").on("click.lg", (function() {
                _this.goToNextSlide();
            }));
        };
        LightGallery.prototype.arrowDisable = function(index) {
            if (!this.settings.loop && this.settings.hideControlOnEnd) {
                var $prev = this.getElementById("lg-prev");
                var $next = this.getElementById("lg-next");
                if (index + 1 === this.galleryItems.length) $next.attr("disabled", "disabled").addClass("disabled"); else $next.removeAttr("disabled").removeClass("disabled");
                if (0 === index) $prev.attr("disabled", "disabled").addClass("disabled"); else $prev.removeAttr("disabled").removeClass("disabled");
            }
        };
        LightGallery.prototype.setTranslate = function($el, xValue, yValue, scaleX, scaleY) {
            if (void 0 === scaleX) scaleX = 1;
            if (void 0 === scaleY) scaleY = 1;
            $el.css("transform", "translate3d(" + xValue + "px, " + yValue + "px, 0px) scale3d(" + scaleX + ", " + scaleY + ", 1)");
        };
        LightGallery.prototype.mousewheel = function() {
            var _this = this;
            var lastCall = 0;
            this.outer.on("wheel.lg", (function(e) {
                if (!e.deltaY || _this.galleryItems.length < 2) return;
                e.preventDefault();
                var now = (new Date).getTime();
                if (now - lastCall < 1e3) return;
                lastCall = now;
                if (e.deltaY > 0) _this.goToNextSlide(); else if (e.deltaY < 0) _this.goToPrevSlide();
            }));
        };
        LightGallery.prototype.isSlideElement = function(target) {
            return target.hasClass("lg-outer") || target.hasClass("lg-item") || target.hasClass("lg-img-wrap");
        };
        LightGallery.prototype.isPosterElement = function(target) {
            var playButton = this.getSlideItem(this.index).find(".lg-video-play-button").get();
            return target.hasClass("lg-video-poster") || target.hasClass("lg-video-play-button") || playButton && playButton.contains(target.get());
        };
        LightGallery.prototype.toggleMaximize = function() {
            var _this = this;
            this.getElementById("lg-maximize").on("click.lg", (function() {
                _this.$container.toggleClass("lg-inline");
                _this.refreshOnResize();
            }));
        };
        LightGallery.prototype.invalidateItems = function() {
            for (var index = 0; index < this.items.length; index++) {
                var element = this.items[index];
                var $element = $LG(element);
                $element.off("click.lgcustom-item-" + $element.attr("data-lg-id"));
            }
        };
        LightGallery.prototype.trapFocus = function() {
            var _this = this;
            this.$container.get().focus({
                preventScroll: true
            });
            $LG(window).on("keydown.lg.global" + this.lgId, (function(e) {
                if (!_this.lgOpened) return;
                var isTabPressed = "Tab" === e.key || 9 === e.keyCode;
                if (!isTabPressed) return;
                var focusableEls = utils.getFocusableElements(_this.$container.get());
                var firstFocusableEl = focusableEls[0];
                var lastFocusableEl = focusableEls[focusableEls.length - 1];
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusableEl) {
                        lastFocusableEl.focus();
                        e.preventDefault();
                    }
                } else if (document.activeElement === lastFocusableEl) {
                    firstFocusableEl.focus();
                    e.preventDefault();
                }
            }));
        };
        LightGallery.prototype.manageCloseGallery = function() {
            var _this = this;
            if (!this.settings.closable) return;
            var mousedown = false;
            this.getElementById("lg-close").on("click.lg", (function() {
                _this.closeGallery();
            }));
            if (this.settings.closeOnTap) {
                this.outer.on("mousedown.lg", (function(e) {
                    var target = $LG(e.target);
                    if (_this.isSlideElement(target)) mousedown = true; else mousedown = false;
                }));
                this.outer.on("mousemove.lg", (function() {
                    mousedown = false;
                }));
                this.outer.on("mouseup.lg", (function(e) {
                    var target = $LG(e.target);
                    if (_this.isSlideElement(target) && mousedown) if (!_this.outer.hasClass("lg-dragging")) _this.closeGallery();
                }));
            }
        };
        LightGallery.prototype.closeGallery = function(force) {
            var _this = this;
            if (!this.lgOpened || !this.settings.closable && !force) return 0;
            this.LGel.trigger(lGEvents.beforeClose);
            if (this.settings.resetScrollPosition && !this.settings.hideScrollbar) $LG(window).scrollTop(this.prevScrollTop);
            var currentItem = this.items[this.index];
            var transform;
            if (this.zoomFromOrigin && currentItem) {
                var _a = this.mediaContainerPosition, top_4 = _a.top, bottom = _a.bottom;
                var _b = this.galleryItems[this.index], __slideVideoInfo = _b.__slideVideoInfo, poster = _b.poster;
                var imageSize = utils.getSize(currentItem, this.outer, top_4 + bottom, __slideVideoInfo && poster && this.settings.videoMaxSize);
                transform = utils.getTransform(currentItem, this.outer, top_4, bottom, imageSize);
            }
            if (this.zoomFromOrigin && transform) {
                this.outer.addClass("lg-closing lg-zoom-from-image");
                this.getSlideItem(this.index).addClass("lg-start-end-progress").css("transition-duration", this.settings.startAnimationDuration + "ms").css("transform", transform);
            } else {
                this.outer.addClass("lg-hide-items");
                this.outer.removeClass("lg-zoom-from-image");
            }
            this.destroyModules();
            this.lGalleryOn = false;
            this.isDummyImageRemoved = false;
            this.zoomFromOrigin = this.settings.zoomFromOrigin;
            clearTimeout(this.hideBarTimeout);
            this.hideBarTimeout = false;
            $LG("html").removeClass("lg-on");
            this.outer.removeClass("lg-visible lg-components-open");
            this.$backdrop.removeClass("in").css("opacity", 0);
            var removeTimeout = this.zoomFromOrigin && transform ? Math.max(this.settings.startAnimationDuration, this.settings.backdropDuration) : this.settings.backdropDuration;
            this.$container.removeClass("lg-show-in");
            setTimeout((function() {
                if (_this.zoomFromOrigin && transform) _this.outer.removeClass("lg-zoom-from-image");
                _this.$container.removeClass("lg-show");
                _this.resetScrollBar();
                _this.$backdrop.removeAttr("style").css("transition-duration", _this.settings.backdropDuration + "ms");
                _this.outer.removeClass("lg-closing " + _this.settings.startClass);
                _this.getSlideItem(_this.index).removeClass("lg-start-end-progress");
                _this.$inner.empty();
                if (_this.lgOpened) _this.LGel.trigger(lGEvents.afterClose, {
                    instance: _this
                });
                if (_this.$container.get()) _this.$container.get().blur();
                _this.lgOpened = false;
            }), removeTimeout + 100);
            return removeTimeout + 100;
        };
        LightGallery.prototype.initModules = function() {
            this.plugins.forEach((function(module) {
                try {
                    module.init();
                } catch (err) {
                    console.warn("lightGallery:- make sure lightGallery module is properly initiated");
                }
            }));
        };
        LightGallery.prototype.destroyModules = function(destroy) {
            this.plugins.forEach((function(module) {
                try {
                    if (destroy) module.destroy(); else module.closeGallery && module.closeGallery();
                } catch (err) {
                    console.warn("lightGallery:- make sure lightGallery module is properly destroyed");
                }
            }));
        };
        LightGallery.prototype.refresh = function(galleryItems) {
            if (!this.settings.dynamic) this.invalidateItems();
            if (galleryItems) this.galleryItems = galleryItems; else this.galleryItems = this.getItems();
            this.updateControls();
            this.openGalleryOnItemClick();
            this.LGel.trigger(lGEvents.updateSlides);
        };
        LightGallery.prototype.updateControls = function() {
            this.addSlideVideoInfo(this.galleryItems);
            this.updateCounterTotal();
            this.manageSingleSlideClassName();
        };
        LightGallery.prototype.destroy = function() {
            var _this = this;
            var closeTimeout = this.closeGallery(true);
            setTimeout((function() {
                _this.destroyModules(true);
                if (!_this.settings.dynamic) _this.invalidateItems();
                $LG(window).off(".lg.global" + _this.lgId);
                _this.LGel.off(".lg");
                _this.$container.remove();
            }), closeTimeout);
            return closeTimeout;
        };
        return LightGallery;
    }();
    function lightGallery(el, options) {
        return new LightGallery(el, options);
    }
    const lightgallery_es5 = lightGallery;
    const galleries = document.querySelectorAll("[data-gallery]");
    if (galleries.length) {
        let galleyItems = [];
        galleries.forEach((gallery => {
            galleyItems.push({
                gallery,
                galleryClass: lightgallery_es5(gallery, {
                    licenseKey: "7EC452A9-0CFD441C-BD984C7C-17C8456E",
                    speed: 500
                })
            });
        }));
        modules_flsModules.gallery = galleyItems;
    }
    function DynamicAdapt(type) {
        this.type = type;
    }
    DynamicAdapt.prototype.init = function() {
        const _this = this;
        this.оbjects = [];
        this.daClassname = "_dynamic_adapt_";
        this.nodes = document.querySelectorAll("[data-da]");
        for (let i = 0; i < this.nodes.length; i++) {
            const node = this.nodes[i];
            const data = node.dataset.da.trim();
            const dataArray = data.split(",");
            const оbject = {};
            оbject.element = node;
            оbject.parent = node.parentNode;
            оbject.destination = document.querySelector(dataArray[0].trim());
            оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
            оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
            оbject.index = this.indexInParent(оbject.parent, оbject.element);
            this.оbjects.push(оbject);
        }
        this.arraySort(this.оbjects);
        this.mediaQueries = Array.prototype.map.call(this.оbjects, (function(item) {
            return "(" + this.type + "-width: " + item.breakpoint + "px)," + item.breakpoint;
        }), this);
        this.mediaQueries = Array.prototype.filter.call(this.mediaQueries, (function(item, index, self) {
            return Array.prototype.indexOf.call(self, item) === index;
        }));
        for (let i = 0; i < this.mediaQueries.length; i++) {
            const media = this.mediaQueries[i];
            const mediaSplit = String.prototype.split.call(media, ",");
            const matchMedia = window.matchMedia(mediaSplit[0]);
            const mediaBreakpoint = mediaSplit[1];
            const оbjectsFilter = Array.prototype.filter.call(this.оbjects, (function(item) {
                return item.breakpoint === mediaBreakpoint;
            }));
            matchMedia.addListener((function() {
                _this.mediaHandler(matchMedia, оbjectsFilter);
            }));
            this.mediaHandler(matchMedia, оbjectsFilter);
        }
    };
    DynamicAdapt.prototype.mediaHandler = function(matchMedia, оbjects) {
        if (matchMedia.matches) for (let i = 0; i < оbjects.length; i++) {
            const оbject = оbjects[i];
            оbject.index = this.indexInParent(оbject.parent, оbject.element);
            this.moveTo(оbject.place, оbject.element, оbject.destination);
        } else for (let i = оbjects.length - 1; i >= 0; i--) {
            const оbject = оbjects[i];
            if (оbject.element.classList.contains(this.daClassname)) this.moveBack(оbject.parent, оbject.element, оbject.index);
        }
    };
    DynamicAdapt.prototype.moveTo = function(place, element, destination) {
        element.classList.add(this.daClassname);
        if ("last" === place || place >= destination.children.length) {
            destination.insertAdjacentElement("beforeend", element);
            return;
        }
        if ("first" === place) {
            destination.insertAdjacentElement("afterbegin", element);
            return;
        }
        destination.children[place].insertAdjacentElement("beforebegin", element);
    };
    DynamicAdapt.prototype.moveBack = function(parent, element, index) {
        element.classList.remove(this.daClassname);
        if (void 0 !== parent.children[index]) parent.children[index].insertAdjacentElement("beforebegin", element); else parent.insertAdjacentElement("beforeend", element);
    };
    DynamicAdapt.prototype.indexInParent = function(parent, element) {
        const array = Array.prototype.slice.call(parent.children);
        return Array.prototype.indexOf.call(array, element);
    };
    DynamicAdapt.prototype.arraySort = function(arr) {
        if ("min" === this.type) Array.prototype.sort.call(arr, (function(a, b) {
            if (a.breakpoint === b.breakpoint) {
                if (a.place === b.place) return 0;
                if ("first" === a.place || "last" === b.place) return -1;
                if ("last" === a.place || "first" === b.place) return 1;
                return a.place - b.place;
            }
            return a.breakpoint - b.breakpoint;
        })); else {
            Array.prototype.sort.call(arr, (function(a, b) {
                if (a.breakpoint === b.breakpoint) {
                    if (a.place === b.place) return 0;
                    if ("first" === a.place || "last" === b.place) return 1;
                    if ("last" === a.place || "first" === b.place) return -1;
                    return b.place - a.place;
                }
                return b.breakpoint - a.breakpoint;
            }));
            return;
        }
    };
    const da = new DynamicAdapt("min");
    da.init();
    !function(a) {
        "object" == typeof module && module.exports ? module.exports = a() : window.intlTelInput = a();
    }((function(a) {
        "use strict";
        return function() {
            function b(a, b) {
                if (!(a instanceof b)) throw new TypeError("Cannot call a class as a function");
            }
            function c(a, b) {
                for (var c = 0; c < b.length; c++) {
                    var d = b[c];
                    d.enumerable = d.enumerable || !1, d.configurable = !0, "value" in d && (d.writable = !0), 
                    Object.defineProperty(a, d.key, d);
                }
            }
            function d(a, b, d) {
                return b && c(a.prototype, b), d && c(a, d), a;
            }
            for (var e = [ [ "Afghanistan (‫افغانستان‬‎)", "af", "93" ], [ "Albania (Shqipëri)", "al", "355" ], [ "Algeria (‫الجزائر‬‎)", "dz", "213" ], [ "American Samoa", "as", "1", 5, [ "684" ] ], [ "Andorra", "ad", "376" ], [ "Angola", "ao", "244" ], [ "Anguilla", "ai", "1", 6, [ "264" ] ], [ "Antigua and Barbuda", "ag", "1", 7, [ "268" ] ], [ "Argentina", "ar", "54" ], [ "Armenia (Հայաստան)", "am", "374" ], [ "Aruba", "aw", "297" ], [ "Ascension Island", "ac", "247" ], [ "Australia", "au", "61", 0 ], [ "Austria (Österreich)", "at", "43" ], [ "Azerbaijan (Azərbaycan)", "az", "994" ], [ "Bahamas", "bs", "1", 8, [ "242" ] ], [ "Bahrain (‫البحرين‬‎)", "bh", "973" ], [ "Bangladesh (বাংলাদেশ)", "bd", "880" ], [ "Barbados", "bb", "1", 9, [ "246" ] ], [ "Belarus (Беларусь)", "by", "375" ], [ "Belgium (België)", "be", "32" ], [ "Belize", "bz", "501" ], [ "Benin (Bénin)", "bj", "229" ], [ "Bermuda", "bm", "1", 10, [ "441" ] ], [ "Bhutan (འབྲུག)", "bt", "975" ], [ "Bolivia", "bo", "591" ], [ "Bosnia and Herzegovina (Босна и Херцеговина)", "ba", "387" ], [ "Botswana", "bw", "267" ], [ "Brazil (Brasil)", "br", "55" ], [ "British Indian Ocean Territory", "io", "246" ], [ "British Virgin Islands", "vg", "1", 11, [ "284" ] ], [ "Brunei", "bn", "673" ], [ "Bulgaria (България)", "bg", "359" ], [ "Burkina Faso", "bf", "226" ], [ "Burundi (Uburundi)", "bi", "257" ], [ "Cambodia (កម្ពុជា)", "kh", "855" ], [ "Cameroon (Cameroun)", "cm", "237" ], [ "Canada", "ca", "1", 1, [ "204", "226", "236", "249", "250", "289", "306", "343", "365", "387", "403", "416", "418", "431", "437", "438", "450", "506", "514", "519", "548", "579", "581", "587", "604", "613", "639", "647", "672", "705", "709", "742", "778", "780", "782", "807", "819", "825", "867", "873", "902", "905" ] ], [ "Cape Verde (Kabu Verdi)", "cv", "238" ], [ "Caribbean Netherlands", "bq", "599", 1, [ "3", "4", "7" ] ], [ "Cayman Islands", "ky", "1", 12, [ "345" ] ], [ "Central African Republic (République centrafricaine)", "cf", "236" ], [ "Chad (Tchad)", "td", "235" ], [ "Chile", "cl", "56" ], [ "China (中国)", "cn", "86" ], [ "Christmas Island", "cx", "61", 2, [ "89164" ] ], [ "Cocos (Keeling) Islands", "cc", "61", 1, [ "89162" ] ], [ "Colombia", "co", "57" ], [ "Comoros (‫جزر القمر‬‎)", "km", "269" ], [ "Congo (DRC) (Jamhuri ya Kidemokrasia ya Kongo)", "cd", "243" ], [ "Congo (Republic) (Congo-Brazzaville)", "cg", "242" ], [ "Cook Islands", "ck", "682" ], [ "Costa Rica", "cr", "506" ], [ "Côte d’Ivoire", "ci", "225" ], [ "Croatia (Hrvatska)", "hr", "385" ], [ "Cuba", "cu", "53" ], [ "Curaçao", "cw", "599", 0 ], [ "Cyprus (Κύπρος)", "cy", "357" ], [ "Czech Republic (Česká republika)", "cz", "420" ], [ "Denmark (Danmark)", "dk", "45" ], [ "Djibouti", "dj", "253" ], [ "Dominica", "dm", "1", 13, [ "767" ] ], [ "Dominican Republic (República Dominicana)", "do", "1", 2, [ "809", "829", "849" ] ], [ "Ecuador", "ec", "593" ], [ "Egypt (‫مصر‬‎)", "eg", "20" ], [ "El Salvador", "sv", "503" ], [ "Equatorial Guinea (Guinea Ecuatorial)", "gq", "240" ], [ "Eritrea", "er", "291" ], [ "Estonia (Eesti)", "ee", "372" ], [ "Eswatini", "sz", "268" ], [ "Ethiopia", "et", "251" ], [ "Falkland Islands (Islas Malvinas)", "fk", "500" ], [ "Faroe Islands (Føroyar)", "fo", "298" ], [ "Fiji", "fj", "679" ], [ "Finland (Suomi)", "fi", "358", 0 ], [ "France", "fr", "33" ], [ "French Guiana (Guyane française)", "gf", "594" ], [ "French Polynesia (Polynésie française)", "pf", "689" ], [ "Gabon", "ga", "241" ], [ "Gambia", "gm", "220" ], [ "Georgia (საქართველო)", "ge", "995" ], [ "Germany (Deutschland)", "de", "49" ], [ "Ghana (Gaana)", "gh", "233" ], [ "Gibraltar", "gi", "350" ], [ "Greece (Ελλάδα)", "gr", "30" ], [ "Greenland (Kalaallit Nunaat)", "gl", "299" ], [ "Grenada", "gd", "1", 14, [ "473" ] ], [ "Guadeloupe", "gp", "590", 0 ], [ "Guam", "gu", "1", 15, [ "671" ] ], [ "Guatemala", "gt", "502" ], [ "Guernsey", "gg", "44", 1, [ "1481", "7781", "7839", "7911" ] ], [ "Guinea (Guinée)", "gn", "224" ], [ "Guinea-Bissau (Guiné Bissau)", "gw", "245" ], [ "Guyana", "gy", "592" ], [ "Haiti", "ht", "509" ], [ "Honduras", "hn", "504" ], [ "Hong Kong (香港)", "hk", "852" ], [ "Hungary (Magyarország)", "hu", "36" ], [ "Iceland (Ísland)", "is", "354" ], [ "India (भारत)", "in", "91" ], [ "Indonesia", "id", "62" ], [ "Iran (‫ایران‬‎)", "ir", "98" ], [ "Iraq (‫العراق‬‎)", "iq", "964" ], [ "Ireland", "ie", "353" ], [ "Isle of Man", "im", "44", 2, [ "1624", "74576", "7524", "7924", "7624" ] ], [ "Israel (‫ישראל‬‎)", "il", "972" ], [ "Italy (Italia)", "it", "39", 0 ], [ "Jamaica", "jm", "1", 4, [ "876", "658" ] ], [ "Japan (日本)", "jp", "81" ], [ "Jersey", "je", "44", 3, [ "1534", "7509", "7700", "7797", "7829", "7937" ] ], [ "Jordan (‫الأردن‬‎)", "jo", "962" ], [ "Kazakhstan (Казахстан)", "kz", "7", 1, [ "33", "7" ] ], [ "Kenya", "ke", "254" ], [ "Kiribati", "ki", "686" ], [ "Kosovo", "xk", "383" ], [ "Kuwait (‫الكويت‬‎)", "kw", "965" ], [ "Kyrgyzstan (Кыргызстан)", "kg", "996" ], [ "Laos (ລາວ)", "la", "856" ], [ "Latvia (Latvija)", "lv", "371" ], [ "Lebanon (‫لبنان‬‎)", "lb", "961" ], [ "Lesotho", "ls", "266" ], [ "Liberia", "lr", "231" ], [ "Libya (‫ليبيا‬‎)", "ly", "218" ], [ "Liechtenstein", "li", "423" ], [ "Lithuania (Lietuva)", "lt", "370" ], [ "Luxembourg", "lu", "352" ], [ "Macau (澳門)", "mo", "853" ], [ "North Macedonia (Македонија)", "mk", "389" ], [ "Madagascar (Madagasikara)", "mg", "261" ], [ "Malawi", "mw", "265" ], [ "Malaysia", "my", "60" ], [ "Maldives", "mv", "960" ], [ "Mali", "ml", "223" ], [ "Malta", "mt", "356" ], [ "Marshall Islands", "mh", "692" ], [ "Martinique", "mq", "596" ], [ "Mauritania (‫موريتانيا‬‎)", "mr", "222" ], [ "Mauritius (Moris)", "mu", "230" ], [ "Mayotte", "yt", "262", 1, [ "269", "639" ] ], [ "Mexico (México)", "mx", "52" ], [ "Micronesia", "fm", "691" ], [ "Moldova (Republica Moldova)", "md", "373" ], [ "Monaco", "mc", "377" ], [ "Mongolia (Монгол)", "mn", "976" ], [ "Montenegro (Crna Gora)", "me", "382" ], [ "Montserrat", "ms", "1", 16, [ "664" ] ], [ "Morocco (‫المغرب‬‎)", "ma", "212", 0 ], [ "Mozambique (Moçambique)", "mz", "258" ], [ "Myanmar (Burma) (မြန်မာ)", "mm", "95" ], [ "Namibia (Namibië)", "na", "264" ], [ "Nauru", "nr", "674" ], [ "Nepal (नेपाल)", "np", "977" ], [ "Netherlands (Nederland)", "nl", "31" ], [ "New Caledonia (Nouvelle-Calédonie)", "nc", "687" ], [ "New Zealand", "nz", "64" ], [ "Nicaragua", "ni", "505" ], [ "Niger (Nijar)", "ne", "227" ], [ "Nigeria", "ng", "234" ], [ "Niue", "nu", "683" ], [ "Norfolk Island", "nf", "672" ], [ "North Korea (조선 민주주의 인민 공화국)", "kp", "850" ], [ "Northern Mariana Islands", "mp", "1", 17, [ "670" ] ], [ "Norway (Norge)", "no", "47", 0 ], [ "Oman (‫عُمان‬‎)", "om", "968" ], [ "Pakistan (‫پاکستان‬‎)", "pk", "92" ], [ "Palau", "pw", "680" ], [ "Palestine (‫فلسطين‬‎)", "ps", "970" ], [ "Panama (Panamá)", "pa", "507" ], [ "Papua New Guinea", "pg", "675" ], [ "Paraguay", "py", "595" ], [ "Peru (Perú)", "pe", "51" ], [ "Philippines", "ph", "63" ], [ "Poland (Polska)", "pl", "48" ], [ "Portugal", "pt", "351" ], [ "Puerto Rico", "pr", "1", 3, [ "787", "939" ] ], [ "Qatar (‫قطر‬‎)", "qa", "974" ], [ "Réunion (La Réunion)", "re", "262", 0 ], [ "Romania (România)", "ro", "40" ], [ "Russia (Россия)", "ru", "7", 0 ], [ "Rwanda", "rw", "250" ], [ "Saint Barthélemy", "bl", "590", 1 ], [ "Saint Helena", "sh", "290" ], [ "Saint Kitts and Nevis", "kn", "1", 18, [ "869" ] ], [ "Saint Lucia", "lc", "1", 19, [ "758" ] ], [ "Saint Martin (Saint-Martin (partie française))", "mf", "590", 2 ], [ "Saint Pierre and Miquelon (Saint-Pierre-et-Miquelon)", "pm", "508" ], [ "Saint Vincent and the Grenadines", "vc", "1", 20, [ "784" ] ], [ "Samoa", "ws", "685" ], [ "San Marino", "sm", "378" ], [ "São Tomé and Príncipe (São Tomé e Príncipe)", "st", "239" ], [ "Saudi Arabia (‫المملكة العربية السعودية‬‎)", "sa", "966" ], [ "Senegal (Sénégal)", "sn", "221" ], [ "Serbia (Србија)", "rs", "381" ], [ "Seychelles", "sc", "248" ], [ "Sierra Leone", "sl", "232" ], [ "Singapore", "sg", "65" ], [ "Sint Maarten", "sx", "1", 21, [ "721" ] ], [ "Slovakia (Slovensko)", "sk", "421" ], [ "Slovenia (Slovenija)", "si", "386" ], [ "Solomon Islands", "sb", "677" ], [ "Somalia (Soomaaliya)", "so", "252" ], [ "South Africa", "za", "27" ], [ "South Korea (대한민국)", "kr", "82" ], [ "South Sudan (‫جنوب السودان‬‎)", "ss", "211" ], [ "Spain (España)", "es", "34" ], [ "Sri Lanka (ශ්‍රී ලංකාව)", "lk", "94" ], [ "Sudan (‫السودان‬‎)", "sd", "249" ], [ "Suriname", "sr", "597" ], [ "Svalbard and Jan Mayen", "sj", "47", 1, [ "79" ] ], [ "Sweden (Sverige)", "se", "46" ], [ "Switzerland (Schweiz)", "ch", "41" ], [ "Syria (‫سوريا‬‎)", "sy", "963" ], [ "Taiwan (台灣)", "tw", "886" ], [ "Tajikistan", "tj", "992" ], [ "Tanzania", "tz", "255" ], [ "Thailand (ไทย)", "th", "66" ], [ "Timor-Leste", "tl", "670" ], [ "Togo", "tg", "228" ], [ "Tokelau", "tk", "690" ], [ "Tonga", "to", "676" ], [ "Trinidad and Tobago", "tt", "1", 22, [ "868" ] ], [ "Tunisia (‫تونس‬‎)", "tn", "216" ], [ "Turkey (Türkiye)", "tr", "90" ], [ "Turkmenistan", "tm", "993" ], [ "Turks and Caicos Islands", "tc", "1", 23, [ "649" ] ], [ "Tuvalu", "tv", "688" ], [ "U.S. Virgin Islands", "vi", "1", 24, [ "340" ] ], [ "Uganda", "ug", "256" ], [ "Ukraine (Україна)", "ua", "380" ], [ "United Arab Emirates (‫الإمارات العربية المتحدة‬‎)", "ae", "971" ], [ "United Kingdom", "gb", "44", 0 ], [ "United States", "us", "1", 0 ], [ "Uruguay", "uy", "598" ], [ "Uzbekistan (Oʻzbekiston)", "uz", "998" ], [ "Vanuatu", "vu", "678" ], [ "Vatican City (Città del Vaticano)", "va", "39", 1, [ "06698" ] ], [ "Venezuela", "ve", "58" ], [ "Vietnam (Việt Nam)", "vn", "84" ], [ "Wallis and Futuna (Wallis-et-Futuna)", "wf", "681" ], [ "Western Sahara (‫الصحراء الغربية‬‎)", "eh", "212", 1, [ "5288", "5289" ] ], [ "Yemen (‫اليمن‬‎)", "ye", "967" ], [ "Zambia", "zm", "260" ], [ "Zimbabwe", "zw", "263" ], [ "Åland Islands", "ax", "358", 1, [ "18" ] ] ], f = 0; f < e.length; f++) {
                var g = e[f];
                e[f] = {
                    name: g[0],
                    iso2: g[1],
                    dialCode: g[2],
                    priority: g[3] || 0,
                    areaCodes: g[4] || null
                };
            }
            var h = {
                getInstance: function(a) {
                    var b = a.getAttribute("data-intl-tel-input-id");
                    return window.intlTelInputGlobals.instances[b];
                },
                instances: {},
                documentReady: function() {
                    return "complete" === document.readyState;
                }
            };
            "object" == typeof window && (window.intlTelInputGlobals = h);
            var i = 0, j = {
                allowDropdown: !0,
                autoHideDialCode: !0,
                autoPlaceholder: "polite",
                customContainer: "",
                customPlaceholder: null,
                dropdownContainer: null,
                excludeCountries: [],
                formatOnDisplay: !0,
                geoIpLookup: null,
                hiddenInput: "",
                initialCountry: "",
                localizedCountries: null,
                nationalMode: !0,
                onlyCountries: [],
                placeholderNumberType: "MOBILE",
                preferredCountries: [ "us", "gb" ],
                separateDialCode: !1,
                utilsScript: ""
            }, k = [ "800", "822", "833", "844", "855", "866", "877", "880", "881", "882", "883", "884", "885", "886", "887", "888", "889" ], l = function(a, b) {
                for (var c = Object.keys(a), d = 0; d < c.length; d++) b(c[d], a[c[d]]);
            }, m = function(a) {
                l(window.intlTelInputGlobals.instances, (function(b) {
                    window.intlTelInputGlobals.instances[b][a]();
                }));
            }, n = function() {
                function c(a, d) {
                    var e = this;
                    b(this, c), this.id = i++, this.a = a, this.b = null, this.c = null;
                    var f = d || {};
                    this.d = {}, l(j, (function(a, b) {
                        e.d[a] = f.hasOwnProperty(a) ? f[a] : b;
                    })), this.e = Boolean(a.getAttribute("placeholder"));
                }
                return d(c, [ {
                    key: "_init",
                    value: function() {
                        var a = this;
                        if (this.d.nationalMode && (this.d.autoHideDialCode = !1), this.d.separateDialCode && (this.d.autoHideDialCode = this.d.nationalMode = !1), 
                        this.g = /Android.+Mobile|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent), 
                        this.g && (document.body.classList.add("iti-mobile"), this.d.dropdownContainer || (this.d.dropdownContainer = document.body)), 
                        "undefined" != typeof Promise) {
                            var b = new Promise((function(b, c) {
                                a.h = b, a.i = c;
                            })), c = new Promise((function(b, c) {
                                a.i0 = b, a.i1 = c;
                            }));
                            this.promise = Promise.all([ b, c ]);
                        } else this.h = this.i = function() {}, this.i0 = this.i1 = function() {};
                        this.s = {}, this._b(), this._f(), this._h(), this._i(), this._i3();
                    }
                }, {
                    key: "_b",
                    value: function() {
                        this._d(), this._d2(), this._e(), this.d.localizedCountries && this._d0(), (this.d.onlyCountries.length || this.d.localizedCountries) && this.p.sort(this._d1);
                    }
                }, {
                    key: "_c",
                    value: function(b, c, d) {
                        c.length > this.countryCodeMaxLen && (this.countryCodeMaxLen = c.length), this.q.hasOwnProperty(c) || (this.q[c] = []);
                        for (var e = 0; e < this.q[c].length; e++) if (this.q[c][e] === b) return;
                        var f = d !== a ? d : this.q[c].length;
                        this.q[c][f] = b;
                    }
                }, {
                    key: "_d",
                    value: function() {
                        if (this.d.onlyCountries.length) {
                            var a = this.d.onlyCountries.map((function(a) {
                                return a.toLowerCase();
                            }));
                            this.p = e.filter((function(b) {
                                return a.indexOf(b.iso2) > -1;
                            }));
                        } else if (this.d.excludeCountries.length) {
                            var b = this.d.excludeCountries.map((function(a) {
                                return a.toLowerCase();
                            }));
                            this.p = e.filter((function(a) {
                                return -1 === b.indexOf(a.iso2);
                            }));
                        } else this.p = e;
                    }
                }, {
                    key: "_d0",
                    value: function() {
                        for (var a = 0; a < this.p.length; a++) {
                            var b = this.p[a].iso2.toLowerCase();
                            this.d.localizedCountries.hasOwnProperty(b) && (this.p[a].name = this.d.localizedCountries[b]);
                        }
                    }
                }, {
                    key: "_d1",
                    value: function(a, b) {
                        return a.name.localeCompare(b.name);
                    }
                }, {
                    key: "_d2",
                    value: function() {
                        this.countryCodeMaxLen = 0, this.dialCodes = {}, this.q = {};
                        for (var a = 0; a < this.p.length; a++) {
                            var b = this.p[a];
                            this.dialCodes[b.dialCode] || (this.dialCodes[b.dialCode] = !0), this._c(b.iso2, b.dialCode, b.priority);
                        }
                        for (var c = 0; c < this.p.length; c++) {
                            var d = this.p[c];
                            if (d.areaCodes) for (var e = this.q[d.dialCode][0], f = 0; f < d.areaCodes.length; f++) {
                                for (var g = d.areaCodes[f], h = 1; h < g.length; h++) {
                                    var i = d.dialCode + g.substr(0, h);
                                    this._c(e, i), this._c(d.iso2, i);
                                }
                                this._c(d.iso2, d.dialCode + g);
                            }
                        }
                    }
                }, {
                    key: "_e",
                    value: function() {
                        this.preferredCountries = [];
                        for (var a = 0; a < this.d.preferredCountries.length; a++) {
                            var b = this.d.preferredCountries[a].toLowerCase(), c = this._y(b, !1, !0);
                            c && this.preferredCountries.push(c);
                        }
                    }
                }, {
                    key: "_e2",
                    value: function(a, b, c) {
                        var d = document.createElement(a);
                        return b && l(b, (function(a, b) {
                            return d.setAttribute(a, b);
                        })), c && c.appendChild(d), d;
                    }
                }, {
                    key: "_f",
                    value: function() {
                        this.a.hasAttribute("autocomplete") || this.a.form && this.a.form.hasAttribute("autocomplete") || this.a.setAttribute("autocomplete", "off");
                        var a = "iti";
                        this.d.allowDropdown && (a += " iti--allow-dropdown"), this.d.separateDialCode && (a += " iti--separate-dial-code"), 
                        this.d.customContainer && (a += " ", a += this.d.customContainer);
                        var b = this._e2("div", {
                            class: a
                        });
                        if (this.a.parentNode.insertBefore(b, this.a), this.k = this._e2("div", {
                            class: "iti__flag-container"
                        }, b), b.appendChild(this.a), this.selectedFlag = this._e2("div", {
                            class: "iti__selected-flag",
                            role: "combobox",
                            "aria-controls": "iti-".concat(this.id, "__country-listbox"),
                            "aria-owns": "iti-".concat(this.id, "__country-listbox"),
                            "aria-expanded": "false"
                        }, this.k), this.l = this._e2("div", {
                            class: "iti__flag"
                        }, this.selectedFlag), this.d.separateDialCode && (this.t = this._e2("div", {
                            class: "iti__selected-dial-code"
                        }, this.selectedFlag)), this.d.allowDropdown && (this.selectedFlag.setAttribute("tabindex", "0"), 
                        this.u = this._e2("div", {
                            class: "iti__arrow"
                        }, this.selectedFlag), this.m = this._e2("ul", {
                            class: "iti__country-list iti__hide",
                            id: "iti-".concat(this.id, "__country-listbox"),
                            role: "listbox",
                            "aria-label": "List of countries"
                        }), this.preferredCountries.length && (this._g(this.preferredCountries, "iti__preferred", !0), 
                        this._e2("li", {
                            class: "iti__divider",
                            role: "separator",
                            "aria-disabled": "true"
                        }, this.m)), this._g(this.p, "iti__standard"), this.d.dropdownContainer ? (this.dropdown = this._e2("div", {
                            class: "iti iti--container"
                        }), this.dropdown.appendChild(this.m)) : this.k.appendChild(this.m)), this.d.hiddenInput) {
                            var c = this.d.hiddenInput, d = this.a.getAttribute("name");
                            if (d) {
                                var e = d.lastIndexOf("[");
                                -1 !== e && (c = "".concat(d.substr(0, e), "[").concat(c, "]"));
                            }
                            this.hiddenInput = this._e2("input", {
                                type: "hidden",
                                name: c
                            }), b.appendChild(this.hiddenInput);
                        }
                    }
                }, {
                    key: "_g",
                    value: function(a, b, c) {
                        for (var d = "", e = 0; e < a.length; e++) {
                            var f = a[e], g = c ? "-preferred" : "";
                            d += "<li class='iti__country ".concat(b, "' tabIndex='-1' id='iti-").concat(this.id, "__item-").concat(f.iso2).concat(g, "' role='option' data-dial-code='").concat(f.dialCode, "' data-country-code='").concat(f.iso2, "' aria-selected='false'>"), 
                            d += "<div class='iti__flag-box'><div class='iti__flag iti__".concat(f.iso2, "'></div></div>"), 
                            d += "<span class='iti__country-name'>".concat(f.name, "</span>"), d += "<span class='iti__dial-code'>+".concat(f.dialCode, "</span>"), 
                            d += "</li>";
                        }
                        this.m.insertAdjacentHTML("beforeend", d);
                    }
                }, {
                    key: "_h",
                    value: function() {
                        var a = this.a.getAttribute("value"), b = this.a.value, c = a && "+" === a.charAt(0) && (!b || "+" !== b.charAt(0)), d = c ? a : b, e = this._5(d), f = this._w(d), g = this.d, h = g.initialCountry, i = g.nationalMode, j = g.autoHideDialCode, k = g.separateDialCode;
                        e && !f ? this._v(d) : "auto" !== h && (h ? this._z(h.toLowerCase()) : e && f ? this._z("us") : (this.j = this.preferredCountries.length ? this.preferredCountries[0].iso2 : this.p[0].iso2, 
                        d || this._z(this.j)), d || i || j || k || (this.a.value = "+".concat(this.s.dialCode))), 
                        d && this._u(d);
                    }
                }, {
                    key: "_i",
                    value: function() {
                        this._j(), this.d.autoHideDialCode && this._l(), this.d.allowDropdown && this._i2(), 
                        this.hiddenInput && this._i0();
                    }
                }, {
                    key: "_i0",
                    value: function() {
                        var a = this;
                        this._a14 = function() {
                            a.hiddenInput.value = a.getNumber();
                        }, this.a.form && this.a.form.addEventListener("submit", this._a14);
                    }
                }, {
                    key: "_i1",
                    value: function() {
                        for (var a = this.a; a && "LABEL" !== a.tagName; ) a = a.parentNode;
                        return a;
                    }
                }, {
                    key: "_i2",
                    value: function() {
                        var a = this;
                        this._a9 = function(b) {
                            a.m.classList.contains("iti__hide") ? a.a.focus() : b.preventDefault();
                        };
                        var b = this._i1();
                        b && b.addEventListener("click", this._a9), this._a10 = function() {
                            !a.m.classList.contains("iti__hide") || a.a.disabled || a.a.readOnly || a._n();
                        }, this.selectedFlag.addEventListener("click", this._a10), this._a11 = function(b) {
                            a.m.classList.contains("iti__hide") && -1 !== [ "ArrowUp", "Up", "ArrowDown", "Down", " ", "Enter" ].indexOf(b.key) && (b.preventDefault(), 
                            b.stopPropagation(), a._n()), "Tab" === b.key && a._2();
                        }, this.k.addEventListener("keydown", this._a11);
                    }
                }, {
                    key: "_i3",
                    value: function() {
                        var a = this;
                        this.d.utilsScript && !window.intlTelInputUtils ? window.intlTelInputGlobals.documentReady() ? window.intlTelInputGlobals.loadUtils(this.d.utilsScript) : window.addEventListener("load", (function() {
                            window.intlTelInputGlobals.loadUtils(a.d.utilsScript);
                        })) : this.i0(), "auto" === this.d.initialCountry ? this._i4() : this.h();
                    }
                }, {
                    key: "_i4",
                    value: function() {
                        window.intlTelInputGlobals.autoCountry ? this.handleAutoCountry() : window.intlTelInputGlobals.startedLoadingAutoCountry || (window.intlTelInputGlobals.startedLoadingAutoCountry = !0, 
                        "function" == typeof this.d.geoIpLookup && this.d.geoIpLookup((function(a) {
                            window.intlTelInputGlobals.autoCountry = a.toLowerCase(), setTimeout((function() {
                                return m("handleAutoCountry");
                            }));
                        }), (function() {
                            return m("rejectAutoCountryPromise");
                        })));
                    }
                }, {
                    key: "_j",
                    value: function() {
                        var a = this;
                        this._a12 = function() {
                            a._v(a.a.value) && a._m2CountryChange();
                        }, this.a.addEventListener("keyup", this._a12), this._a13 = function() {
                            setTimeout(a._a12);
                        }, this.a.addEventListener("cut", this._a13), this.a.addEventListener("paste", this._a13);
                    }
                }, {
                    key: "_j2",
                    value: function(a) {
                        var b = this.a.getAttribute("maxlength");
                        return b && a.length > b ? a.substr(0, b) : a;
                    }
                }, {
                    key: "_l",
                    value: function() {
                        var a = this;
                        this._a8 = function() {
                            a._l2();
                        }, this.a.form && this.a.form.addEventListener("submit", this._a8), this.a.addEventListener("blur", this._a8);
                    }
                }, {
                    key: "_l2",
                    value: function() {
                        if ("+" === this.a.value.charAt(0)) {
                            var a = this._m(this.a.value);
                            a && this.s.dialCode !== a || (this.a.value = "");
                        }
                    }
                }, {
                    key: "_m",
                    value: function(a) {
                        return a.replace(/\D/g, "");
                    }
                }, {
                    key: "_m2",
                    value: function(a) {
                        var b = document.createEvent("Event");
                        b.initEvent(a, !0, !0), this.a.dispatchEvent(b);
                    }
                }, {
                    key: "_n",
                    value: function() {
                        this.m.classList.remove("iti__hide"), this.selectedFlag.setAttribute("aria-expanded", "true"), 
                        this._o(), this.b && (this._x(this.b, !1), this._3(this.b, !0)), this._p(), this.u.classList.add("iti__arrow--up"), 
                        this._m2("open:countrydropdown");
                    }
                }, {
                    key: "_n2",
                    value: function(a, b, c) {
                        c && !a.classList.contains(b) ? a.classList.add(b) : !c && a.classList.contains(b) && a.classList.remove(b);
                    }
                }, {
                    key: "_o",
                    value: function() {
                        var a = this;
                        if (this.d.dropdownContainer && this.d.dropdownContainer.appendChild(this.dropdown), 
                        !this.g) {
                            var b = this.a.getBoundingClientRect(), c = window.pageYOffset || document.documentElement.scrollTop, d = b.top + c, e = this.m.offsetHeight, f = d + this.a.offsetHeight + e < c + window.innerHeight, g = d - e > c;
                            if (this._n2(this.m, "iti__country-list--dropup", !f && g), this.d.dropdownContainer) {
                                var h = !f && g ? 0 : this.a.offsetHeight;
                                this.dropdown.style.top = "".concat(d + h, "px"), this.dropdown.style.left = "".concat(b.left + document.body.scrollLeft, "px"), 
                                this._a4 = function() {
                                    return a._2();
                                }, window.addEventListener("scroll", this._a4);
                            }
                        }
                    }
                }, {
                    key: "_o2",
                    value: function(a) {
                        for (var b = a; b && b !== this.m && !b.classList.contains("iti__country"); ) b = b.parentNode;
                        return b === this.m ? null : b;
                    }
                }, {
                    key: "_p",
                    value: function() {
                        var a = this;
                        this._a0 = function(b) {
                            var c = a._o2(b.target);
                            c && a._x(c, !1);
                        }, this.m.addEventListener("mouseover", this._a0), this._a1 = function(b) {
                            var c = a._o2(b.target);
                            c && a._1(c);
                        }, this.m.addEventListener("click", this._a1);
                        var b = !0;
                        this._a2 = function() {
                            b || a._2(), b = !1;
                        }, document.documentElement.addEventListener("click", this._a2);
                        var c = "", d = null;
                        this._a3 = function(b) {
                            b.preventDefault(), "ArrowUp" === b.key || "Up" === b.key || "ArrowDown" === b.key || "Down" === b.key ? a._q(b.key) : "Enter" === b.key ? a._r() : "Escape" === b.key ? a._2() : /^[a-zA-ZÀ-ÿа-яА-Я ]$/.test(b.key) && (d && clearTimeout(d), 
                            c += b.key.toLowerCase(), a._s(c), d = setTimeout((function() {
                                c = "";
                            }), 1e3));
                        }, document.addEventListener("keydown", this._a3);
                    }
                }, {
                    key: "_q",
                    value: function(a) {
                        var b = "ArrowUp" === a || "Up" === a ? this.c.previousElementSibling : this.c.nextElementSibling;
                        b && (b.classList.contains("iti__divider") && (b = "ArrowUp" === a || "Up" === a ? b.previousElementSibling : b.nextElementSibling), 
                        this._x(b, !0));
                    }
                }, {
                    key: "_r",
                    value: function() {
                        this.c && this._1(this.c);
                    }
                }, {
                    key: "_s",
                    value: function(a) {
                        for (var b = 0; b < this.p.length; b++) if (this._t(this.p[b].name, a)) {
                            var c = this.m.querySelector("#iti-".concat(this.id, "__item-").concat(this.p[b].iso2));
                            this._x(c, !1), this._3(c, !0);
                            break;
                        }
                    }
                }, {
                    key: "_t",
                    value: function(a, b) {
                        return a.substr(0, b.length).toLowerCase() === b;
                    }
                }, {
                    key: "_u",
                    value: function(a) {
                        var b = a;
                        if (this.d.formatOnDisplay && window.intlTelInputUtils && this.s) {
                            var c = !this.d.separateDialCode && (this.d.nationalMode || "+" !== b.charAt(0)), d = intlTelInputUtils.numberFormat, e = d.NATIONAL, f = d.INTERNATIONAL, g = c ? e : f;
                            b = intlTelInputUtils.formatNumber(b, this.s.iso2, g);
                        }
                        b = this._7(b), this.a.value = b;
                    }
                }, {
                    key: "_v",
                    value: function(a) {
                        var b = a, c = this.s.dialCode, d = "1" === c;
                        b && this.d.nationalMode && d && "+" !== b.charAt(0) && ("1" !== b.charAt(0) && (b = "1".concat(b)), 
                        b = "+".concat(b)), this.d.separateDialCode && c && "+" !== b.charAt(0) && (b = "+".concat(c).concat(b));
                        var e = this._5(b, !0), f = this._m(b), g = null;
                        if (e) {
                            var h = this.q[this._m(e)], i = -1 !== h.indexOf(this.s.iso2) && f.length <= e.length - 1;
                            if (!("1" === c && this._w(f)) && !i) for (var j = 0; j < h.length; j++) if (h[j]) {
                                g = h[j];
                                break;
                            }
                        } else "+" === b.charAt(0) && f.length ? g = "" : b && "+" !== b || (g = this.j);
                        return null !== g && this._z(g);
                    }
                }, {
                    key: "_w",
                    value: function(a) {
                        var b = this._m(a);
                        if ("1" === b.charAt(0)) {
                            var c = b.substr(1, 3);
                            return -1 !== k.indexOf(c);
                        }
                        return !1;
                    }
                }, {
                    key: "_x",
                    value: function(a, b) {
                        var c = this.c;
                        c && c.classList.remove("iti__highlight"), this.c = a, this.c.classList.add("iti__highlight"), 
                        b && this.c.focus();
                    }
                }, {
                    key: "_y",
                    value: function(a, b, c) {
                        for (var d = b ? e : this.p, f = 0; f < d.length; f++) if (d[f].iso2 === a) return d[f];
                        if (c) return null;
                        throw new Error("No country data for '".concat(a, "'"));
                    }
                }, {
                    key: "_z",
                    value: function(a) {
                        var b = this.s.iso2 ? this.s : {};
                        this.s = a ? this._y(a, !1, !1) : {}, this.s.iso2 && (this.j = this.s.iso2), this.l.setAttribute("class", "iti__flag iti__".concat(a));
                        var c = a ? "".concat(this.s.name, ": +").concat(this.s.dialCode) : "Unknown";
                        if (this.selectedFlag.setAttribute("title", c), this.d.separateDialCode) {
                            var d = this.s.dialCode ? "+".concat(this.s.dialCode) : "";
                            this.t.innerHTML = d;
                            var e = this.selectedFlag.offsetWidth || this._z2();
                            this.a.style.paddingLeft = "".concat(e + 6, "px");
                        }
                        if (this._0(), this.d.allowDropdown) {
                            var f = this.b;
                            if (f && (f.classList.remove("iti__active"), f.setAttribute("aria-selected", "false")), 
                            a) {
                                var g = this.m.querySelector("#iti-".concat(this.id, "__item-").concat(a, "-preferred")) || this.m.querySelector("#iti-".concat(this.id, "__item-").concat(a));
                                g.setAttribute("aria-selected", "true"), g.classList.add("iti__active"), this.b = g, 
                                this.selectedFlag.setAttribute("aria-activedescendant", g.getAttribute("id"));
                            }
                        }
                        return b.iso2 !== a;
                    }
                }, {
                    key: "_z2",
                    value: function() {
                        var a = this.a.parentNode.cloneNode();
                        a.style.visibility = "hidden", document.body.appendChild(a);
                        var b = this.k.cloneNode();
                        a.appendChild(b);
                        var c = this.selectedFlag.cloneNode(!0);
                        b.appendChild(c);
                        var d = c.offsetWidth;
                        return a.parentNode.removeChild(a), d;
                    }
                }, {
                    key: "_0",
                    value: function() {
                        var a = "aggressive" === this.d.autoPlaceholder || !this.e && "polite" === this.d.autoPlaceholder;
                        if (window.intlTelInputUtils && a) {
                            var b = intlTelInputUtils.numberType[this.d.placeholderNumberType], c = this.s.iso2 ? intlTelInputUtils.getExampleNumber(this.s.iso2, this.d.nationalMode, b) : "";
                            c = this._7(c), "function" == typeof this.d.customPlaceholder && (c = this.d.customPlaceholder(c, this.s)), 
                            this.a.setAttribute("placeholder", c);
                        }
                    }
                }, {
                    key: "_1",
                    value: function(a) {
                        var b = this._z(a.getAttribute("data-country-code"));
                        this._2(), this._4(a.getAttribute("data-dial-code"), !0), this.a.focus();
                        var c = this.a.value.length;
                        this.a.setSelectionRange(c, c), b && this._m2CountryChange();
                    }
                }, {
                    key: "_2",
                    value: function() {
                        this.m.classList.add("iti__hide"), this.selectedFlag.setAttribute("aria-expanded", "false"), 
                        this.u.classList.remove("iti__arrow--up"), document.removeEventListener("keydown", this._a3), 
                        document.documentElement.removeEventListener("click", this._a2), this.m.removeEventListener("mouseover", this._a0), 
                        this.m.removeEventListener("click", this._a1), this.d.dropdownContainer && (this.g || window.removeEventListener("scroll", this._a4), 
                        this.dropdown.parentNode && this.dropdown.parentNode.removeChild(this.dropdown)), 
                        this._m2("close:countrydropdown");
                    }
                }, {
                    key: "_3",
                    value: function(a, b) {
                        var c = this.m, d = window.pageYOffset || document.documentElement.scrollTop, e = c.offsetHeight, f = c.getBoundingClientRect().top + d, g = f + e, h = a.offsetHeight, i = a.getBoundingClientRect().top + d, j = i + h, k = i - f + c.scrollTop, l = e / 2 - h / 2;
                        if (i < f) b && (k -= l), c.scrollTop = k; else if (j > g) {
                            b && (k += l);
                            var m = e - h;
                            c.scrollTop = k - m;
                        }
                    }
                }, {
                    key: "_4",
                    value: function(a, b) {
                        var c, d = this.a.value, e = "+".concat(a);
                        if ("+" === d.charAt(0)) {
                            var f = this._5(d);
                            c = f ? d.replace(f, e) : e;
                        } else {
                            if (this.d.nationalMode || this.d.separateDialCode) return;
                            if (d) c = e + d; else {
                                if (!b && this.d.autoHideDialCode) return;
                                c = e;
                            }
                        }
                        this.a.value = c;
                    }
                }, {
                    key: "_5",
                    value: function(a, b) {
                        var c = "";
                        if ("+" === a.charAt(0)) for (var d = "", e = 0; e < a.length; e++) {
                            var f = a.charAt(e);
                            if (!isNaN(parseInt(f, 10))) {
                                if (d += f, b) this.q[d] && (c = a.substr(0, e + 1)); else if (this.dialCodes[d]) {
                                    c = a.substr(0, e + 1);
                                    break;
                                }
                                if (d.length === this.countryCodeMaxLen) break;
                            }
                        }
                        return c;
                    }
                }, {
                    key: "_6",
                    value: function() {
                        var a = this.a.value.trim(), b = this.s.dialCode, c = this._m(a);
                        return (this.d.separateDialCode && "+" !== a.charAt(0) && b && c ? "+".concat(b) : "") + a;
                    }
                }, {
                    key: "_7",
                    value: function(a) {
                        var b = a;
                        if (this.d.separateDialCode) {
                            var c = this._5(b);
                            if (c) {
                                c = "+".concat(this.s.dialCode);
                                var d = " " === b[c.length] || "-" === b[c.length] ? c.length + 1 : c.length;
                                b = b.substr(d);
                            }
                        }
                        return this._j2(b);
                    }
                }, {
                    key: "_m2CountryChange",
                    value: function() {
                        this._m2("countrychange");
                    }
                }, {
                    key: "handleAutoCountry",
                    value: function() {
                        "auto" === this.d.initialCountry && (this.j = window.intlTelInputGlobals.autoCountry, 
                        this.a.value || this.setCountry(this.j), this.h());
                    }
                }, {
                    key: "handleUtils",
                    value: function() {
                        window.intlTelInputUtils && (this.a.value && this._u(this.a.value), this._0()), 
                        this.i0();
                    }
                }, {
                    key: "destroy",
                    value: function() {
                        var a = this.a.form;
                        if (this.d.allowDropdown) {
                            this._2(), this.selectedFlag.removeEventListener("click", this._a10), this.k.removeEventListener("keydown", this._a11);
                            var b = this._i1();
                            b && b.removeEventListener("click", this._a9);
                        }
                        this.hiddenInput && a && a.removeEventListener("submit", this._a14), this.d.autoHideDialCode && (a && a.removeEventListener("submit", this._a8), 
                        this.a.removeEventListener("blur", this._a8)), this.a.removeEventListener("keyup", this._a12), 
                        this.a.removeEventListener("cut", this._a13), this.a.removeEventListener("paste", this._a13), 
                        this.a.removeAttribute("data-intl-tel-input-id");
                        var c = this.a.parentNode;
                        c.parentNode.insertBefore(this.a, c), c.parentNode.removeChild(c), delete window.intlTelInputGlobals.instances[this.id];
                    }
                }, {
                    key: "getExtension",
                    value: function() {
                        return window.intlTelInputUtils ? intlTelInputUtils.getExtension(this._6(), this.s.iso2) : "";
                    }
                }, {
                    key: "getNumber",
                    value: function(a) {
                        if (window.intlTelInputUtils) {
                            var b = this.s.iso2;
                            return intlTelInputUtils.formatNumber(this._6(), b, a);
                        }
                        return "";
                    }
                }, {
                    key: "getNumberType",
                    value: function() {
                        return window.intlTelInputUtils ? intlTelInputUtils.getNumberType(this._6(), this.s.iso2) : -99;
                    }
                }, {
                    key: "getSelectedCountryData",
                    value: function() {
                        return this.s;
                    }
                }, {
                    key: "getValidationError",
                    value: function() {
                        if (window.intlTelInputUtils) {
                            var a = this.s.iso2;
                            return intlTelInputUtils.getValidationError(this._6(), a);
                        }
                        return -99;
                    }
                }, {
                    key: "isValidNumber",
                    value: function() {
                        var a = this._6().trim(), b = this.d.nationalMode ? this.s.iso2 : "";
                        return window.intlTelInputUtils ? intlTelInputUtils.isValidNumber(a, b) : null;
                    }
                }, {
                    key: "setCountry",
                    value: function(a) {
                        var b = a.toLowerCase();
                        this.l.classList.contains("iti__".concat(b)) || (this._z(b), this._4(this.s.dialCode, !1), 
                        this._m2CountryChange());
                    }
                }, {
                    key: "setNumber",
                    value: function(a) {
                        var b = this._v(a);
                        this._u(a), b && this._m2CountryChange();
                    }
                }, {
                    key: "setPlaceholderNumberType",
                    value: function(a) {
                        this.d.placeholderNumberType = a, this._0();
                    }
                } ]), c;
            }();
            h.getCountryData = function() {
                return e;
            };
            var o = function(a, b, c) {
                var d = document.createElement("script");
                d.onload = function() {
                    m("handleUtils"), b && b();
                }, d.onerror = function() {
                    m("rejectUtilsScriptPromise"), c && c();
                }, d.className = "iti-load-utils", d.async = !0, d.src = a, document.body.appendChild(d);
            };
            return h.loadUtils = function(a) {
                if (!window.intlTelInputUtils && !window.intlTelInputGlobals.startedLoadingUtilsScript) {
                    if (window.intlTelInputGlobals.startedLoadingUtilsScript = !0, "undefined" != typeof Promise) return new Promise((function(b, c) {
                        return o(a, b, c);
                    }));
                    o(a);
                }
                return null;
            }, h.defaults = j, h.version = "17.0.15", function(a, b) {
                var c = new n(a, b);
                return c._init(), a.setAttribute("data-intl-tel-input-id", c.id), window.intlTelInputGlobals.instances[c.id] = c, 
                c;
            };
        }();
    }));
    (function() {
        var aa = this || self;
        function k(a, b) {
            a = a.split(".");
            var c = aa;
            a[0] in c || "undefined" == typeof c.execScript || c.execScript("var " + a[0]);
            for (var d; a.length && (d = a.shift()); ) a.length || void 0 === b ? c[d] && c[d] !== Object.prototype[d] ? c = c[d] : c = c[d] = {} : c[d] = b;
        }
        function m(a, b) {
            function c() {}
            c.prototype = b.prototype;
            a.$ = b.prototype;
            a.prototype = new c;
            a.prototype.constructor = a;
            a.fa = function(d, e, g) {
                for (var f = Array(arguments.length - 2), h = 2; h < arguments.length; h++) f[h - 2] = arguments[h];
                return b.prototype[e].apply(d, f);
            };
        }
        function ba(a) {
            var d, b = [], c = 0;
            for (d in a) b[c++] = a[d];
            return b;
        }
        function ca(a, b) {
            a.sort(b || da);
        }
        function da(a, b) {
            return a > b ? 1 : a < b ? -1 : 0;
        }
        function ea(a, b) {
            this.g = a;
            this.m = !!b.o;
            this.i = b.h;
            this.v = b.type;
            this.u = !1;
            switch (this.i) {
              case fa:
              case ha:
              case ia:
              case ja:
              case ka:
              case la:
              case ma:
                this.u = !0;
            }
            this.l = b.defaultValue;
        }
        var ma = 1, la = 2, fa = 3, ha = 4, ia = 6, ja = 16, ka = 18;
        function na(a, b) {
            this.i = a;
            this.g = {};
            for (a = 0; a < b.length; a++) {
                var c = b[a];
                this.g[c.g] = c;
            }
        }
        function oa(a) {
            a = ba(a.g);
            ca(a, (function(b, c) {
                return b.g - c.g;
            }));
            return a;
        }
        function n() {
            this.g = {};
            this.l = this.j().g;
            this.i = this.m = null;
        }
        n.prototype.has = function(a) {
            return null != this.g[a.g];
        };
        n.prototype.get = function(a, b) {
            return p(this, a.g, b);
        };
        n.prototype.set = function(a, b) {
            q(this, a.g, b);
        };
        n.prototype.add = function(a, b) {
            r(this, a.g, b);
        };
        function t(a, b) {
            for (var c = oa(a.j()), d = 0; d < c.length; d++) {
                var e = c[d], g = e.g;
                if (null != b.g[g]) {
                    a.i && delete a.i[e.g];
                    var f = 11 == e.i || 10 == e.i;
                    if (e.m) {
                        e = u(b, g);
                        for (var h = 0; h < e.length; h++) r(a, g, f ? e[h].clone() : e[h]);
                    } else e = v(b, g), f ? (f = v(a, g)) ? t(f, e) : q(a, g, e.clone()) : q(a, g, e);
                }
            }
        }
        n.prototype.clone = function() {
            var a = new this.constructor;
            a != this && (a.g = {}, a.i && (a.i = {}), t(a, this));
            return a;
        };
        function v(a, b) {
            var c = a.g[b];
            if (null == c) return null;
            if (a.m) {
                if (!(b in a.i)) {
                    var d = a.m, e = a.l[b];
                    if (null != c) if (e.m) {
                        for (var g = [], f = 0; f < c.length; f++) g[f] = d.i(e, c[f]);
                        c = g;
                    } else c = d.i(e, c);
                    return a.i[b] = c;
                }
                return a.i[b];
            }
            return c;
        }
        function p(a, b, c) {
            var d = v(a, b);
            return a.l[b].m ? d[c || 0] : d;
        }
        function w(a, b) {
            if (null != a.g[b]) a = p(a, b, void 0); else a: {
                a = a.l[b];
                if (void 0 === a.l) if (b = a.v, b === Boolean) a.l = !1; else if (b === Number) a.l = 0; else if (b === String) a.l = a.u ? "0" : ""; else {
                    a = new b;
                    break a;
                }
                a = a.l;
            }
            return a;
        }
        function u(a, b) {
            return v(a, b) || [];
        }
        function x(a, b) {
            return a.l[b].m ? null != a.g[b] ? a.g[b].length : 0 : null != a.g[b] ? 1 : 0;
        }
        function q(a, b, c) {
            a.g[b] = c;
            a.i && (a.i[b] = c);
        }
        function r(a, b, c) {
            a.g[b] || (a.g[b] = []);
            a.g[b].push(c);
            a.i && delete a.i[b];
        }
        function y(a, b) {
            var d, c = [];
            for (d in b) 0 != d && c.push(new ea(d, b[d]));
            return new na(a, c);
        }
        function A() {}
        A.prototype.g = function(a) {
            new a.i;
            throw Error("Unimplemented");
        };
        A.prototype.i = function(a, b) {
            if (11 == a.i || 10 == a.i) return b instanceof n ? b : this.g(a.v.prototype.j(), b);
            if (14 == a.i) return "string" === typeof b && B.test(b) && (a = Number(b), 0 < a) ? a : b;
            if (!a.u) return b;
            a = a.v;
            if (a === String) {
                if ("number" === typeof b) return String(b);
            } else if (a === Number && "string" === typeof b && ("Infinity" === b || "-Infinity" === b || "NaN" === b || B.test(b))) return Number(b);
            return b;
        };
        var B = /^-?[0-9]+$/;
        function C() {}
        m(C, A);
        C.prototype.g = function(a, b) {
            a = new a.i;
            a.m = this;
            a.g = b;
            a.i = {};
            return a;
        };
        function D() {}
        m(D, C);
        D.prototype.i = function(a, b) {
            return 8 == a.i ? !!b : A.prototype.i.apply(this, arguments);
        };
        D.prototype.g = function(a, b) {
            return D.$.g.call(this, a, b);
        };
        function E(a, b) {
            null != a && this.g.apply(this, arguments);
        }
        E.prototype.i = "";
        E.prototype.set = function(a) {
            this.i = "" + a;
        };
        E.prototype.g = function(a, b, c) {
            this.i += String(a);
            if (null != b) for (var d = 1; d < arguments.length; d++) this.i += arguments[d];
            return this;
        };
        E.prototype.toString = function() {
            return this.i;
        };
        function F() {
            n.call(this);
        }
        m(F, n);
        var pa = null;
        function G() {
            n.call(this);
        }
        m(G, n);
        var qa = null;
        function H() {
            n.call(this);
        }
        m(H, n);
        var ra = null;
        F.prototype.j = function() {
            var a = pa;
            a || (pa = a = y(F, {
                0: {
                    name: "NumberFormat",
                    s: "i18n.phonenumbers.NumberFormat"
                },
                1: {
                    name: "pattern",
                    required: !0,
                    h: 9,
                    type: String
                },
                2: {
                    name: "format",
                    required: !0,
                    h: 9,
                    type: String
                },
                3: {
                    name: "leading_digits_pattern",
                    o: !0,
                    h: 9,
                    type: String
                },
                4: {
                    name: "national_prefix_formatting_rule",
                    h: 9,
                    type: String
                },
                6: {
                    name: "national_prefix_optional_when_formatting",
                    h: 8,
                    defaultValue: !1,
                    type: Boolean
                },
                5: {
                    name: "domestic_carrier_code_formatting_rule",
                    h: 9,
                    type: String
                }
            }));
            return a;
        };
        F.j = F.prototype.j;
        G.prototype.j = function() {
            var a = qa;
            a || (qa = a = y(G, {
                0: {
                    name: "PhoneNumberDesc",
                    s: "i18n.phonenumbers.PhoneNumberDesc"
                },
                2: {
                    name: "national_number_pattern",
                    h: 9,
                    type: String
                },
                9: {
                    name: "possible_length",
                    o: !0,
                    h: 5,
                    type: Number
                },
                10: {
                    name: "possible_length_local_only",
                    o: !0,
                    h: 5,
                    type: Number
                },
                6: {
                    name: "example_number",
                    h: 9,
                    type: String
                }
            }));
            return a;
        };
        G.j = G.prototype.j;
        H.prototype.j = function() {
            var a = ra;
            a || (ra = a = y(H, {
                0: {
                    name: "PhoneMetadata",
                    s: "i18n.phonenumbers.PhoneMetadata"
                },
                1: {
                    name: "general_desc",
                    h: 11,
                    type: G
                },
                2: {
                    name: "fixed_line",
                    h: 11,
                    type: G
                },
                3: {
                    name: "mobile",
                    h: 11,
                    type: G
                },
                4: {
                    name: "toll_free",
                    h: 11,
                    type: G
                },
                5: {
                    name: "premium_rate",
                    h: 11,
                    type: G
                },
                6: {
                    name: "shared_cost",
                    h: 11,
                    type: G
                },
                7: {
                    name: "personal_number",
                    h: 11,
                    type: G
                },
                8: {
                    name: "voip",
                    h: 11,
                    type: G
                },
                21: {
                    name: "pager",
                    h: 11,
                    type: G
                },
                25: {
                    name: "uan",
                    h: 11,
                    type: G
                },
                27: {
                    name: "emergency",
                    h: 11,
                    type: G
                },
                28: {
                    name: "voicemail",
                    h: 11,
                    type: G
                },
                29: {
                    name: "short_code",
                    h: 11,
                    type: G
                },
                30: {
                    name: "standard_rate",
                    h: 11,
                    type: G
                },
                31: {
                    name: "carrier_specific",
                    h: 11,
                    type: G
                },
                33: {
                    name: "sms_services",
                    h: 11,
                    type: G
                },
                24: {
                    name: "no_international_dialling",
                    h: 11,
                    type: G
                },
                9: {
                    name: "id",
                    required: !0,
                    h: 9,
                    type: String
                },
                10: {
                    name: "country_code",
                    h: 5,
                    type: Number
                },
                11: {
                    name: "international_prefix",
                    h: 9,
                    type: String
                },
                17: {
                    name: "preferred_international_prefix",
                    h: 9,
                    type: String
                },
                12: {
                    name: "national_prefix",
                    h: 9,
                    type: String
                },
                13: {
                    name: "preferred_extn_prefix",
                    h: 9,
                    type: String
                },
                15: {
                    name: "national_prefix_for_parsing",
                    h: 9,
                    type: String
                },
                16: {
                    name: "national_prefix_transform_rule",
                    h: 9,
                    type: String
                },
                18: {
                    name: "same_mobile_and_fixed_line_pattern",
                    h: 8,
                    defaultValue: !1,
                    type: Boolean
                },
                19: {
                    name: "number_format",
                    o: !0,
                    h: 11,
                    type: F
                },
                20: {
                    name: "intl_number_format",
                    o: !0,
                    h: 11,
                    type: F
                },
                22: {
                    name: "main_country_for_code",
                    h: 8,
                    defaultValue: !1,
                    type: Boolean
                },
                23: {
                    name: "leading_digits",
                    h: 9,
                    type: String
                },
                26: {
                    name: "leading_zero_possible",
                    h: 8,
                    defaultValue: !1,
                    type: Boolean
                }
            }));
            return a;
        };
        H.j = H.prototype.j;
        function I() {
            n.call(this);
        }
        m(I, n);
        var sa = null, ta = {
            ea: 0,
            da: 1,
            ca: 5,
            ba: 10,
            aa: 20
        };
        I.prototype.j = function() {
            var a = sa;
            a || (sa = a = y(I, {
                0: {
                    name: "PhoneNumber",
                    s: "i18n.phonenumbers.PhoneNumber"
                },
                1: {
                    name: "country_code",
                    required: !0,
                    h: 5,
                    type: Number
                },
                2: {
                    name: "national_number",
                    required: !0,
                    h: 4,
                    type: Number
                },
                3: {
                    name: "extension",
                    h: 9,
                    type: String
                },
                4: {
                    name: "italian_leading_zero",
                    h: 8,
                    type: Boolean
                },
                8: {
                    name: "number_of_leading_zeros",
                    h: 5,
                    defaultValue: 1,
                    type: Number
                },
                5: {
                    name: "raw_input",
                    h: 9,
                    type: String
                },
                6: {
                    name: "country_code_source",
                    h: 14,
                    defaultValue: 0,
                    type: ta
                },
                7: {
                    name: "preferred_domestic_carrier_code",
                    h: 9,
                    type: String
                }
            }));
            return a;
        };
        I.ctor = I;
        I.ctor.j = I.prototype.j;
        var J = {
            1: "US AG AI AS BB BM BS CA DM DO GD GU JM KN KY LC MP MS PR SX TC TT VC VG VI".split(" "),
            7: [ "RU", "KZ" ],
            20: [ "EG" ],
            27: [ "ZA" ],
            30: [ "GR" ],
            31: [ "NL" ],
            32: [ "BE" ],
            33: [ "FR" ],
            34: [ "ES" ],
            36: [ "HU" ],
            39: [ "IT", "VA" ],
            40: [ "RO" ],
            41: [ "CH" ],
            43: [ "AT" ],
            44: [ "GB", "GG", "IM", "JE" ],
            45: [ "DK" ],
            46: [ "SE" ],
            47: [ "NO", "SJ" ],
            48: [ "PL" ],
            49: [ "DE" ],
            51: [ "PE" ],
            52: [ "MX" ],
            53: [ "CU" ],
            54: [ "AR" ],
            55: [ "BR" ],
            56: [ "CL" ],
            57: [ "CO" ],
            58: [ "VE" ],
            60: [ "MY" ],
            61: [ "AU", "CC", "CX" ],
            62: [ "ID" ],
            63: [ "PH" ],
            64: [ "NZ" ],
            65: [ "SG" ],
            66: [ "TH" ],
            81: [ "JP" ],
            82: [ "KR" ],
            84: [ "VN" ],
            86: [ "CN" ],
            90: [ "TR" ],
            91: [ "IN" ],
            92: [ "PK" ],
            93: [ "AF" ],
            94: [ "LK" ],
            95: [ "MM" ],
            98: [ "IR" ],
            211: [ "SS" ],
            212: [ "MA", "EH" ],
            213: [ "DZ" ],
            216: [ "TN" ],
            218: [ "LY" ],
            220: [ "GM" ],
            221: [ "SN" ],
            222: [ "MR" ],
            223: [ "ML" ],
            224: [ "GN" ],
            225: [ "CI" ],
            226: [ "BF" ],
            227: [ "NE" ],
            228: [ "TG" ],
            229: [ "BJ" ],
            230: [ "MU" ],
            231: [ "LR" ],
            232: [ "SL" ],
            233: [ "GH" ],
            234: [ "NG" ],
            235: [ "TD" ],
            236: [ "CF" ],
            237: [ "CM" ],
            238: [ "CV" ],
            239: [ "ST" ],
            240: [ "GQ" ],
            241: [ "GA" ],
            242: [ "CG" ],
            243: [ "CD" ],
            244: [ "AO" ],
            245: [ "GW" ],
            246: [ "IO" ],
            247: [ "AC" ],
            248: [ "SC" ],
            249: [ "SD" ],
            250: [ "RW" ],
            251: [ "ET" ],
            252: [ "SO" ],
            253: [ "DJ" ],
            254: [ "KE" ],
            255: [ "TZ" ],
            256: [ "UG" ],
            257: [ "BI" ],
            258: [ "MZ" ],
            260: [ "ZM" ],
            261: [ "MG" ],
            262: [ "RE", "YT" ],
            263: [ "ZW" ],
            264: [ "NA" ],
            265: [ "MW" ],
            266: [ "LS" ],
            267: [ "BW" ],
            268: [ "SZ" ],
            269: [ "KM" ],
            290: [ "SH", "TA" ],
            291: [ "ER" ],
            297: [ "AW" ],
            298: [ "FO" ],
            299: [ "GL" ],
            350: [ "GI" ],
            351: [ "PT" ],
            352: [ "LU" ],
            353: [ "IE" ],
            354: [ "IS" ],
            355: [ "AL" ],
            356: [ "MT" ],
            357: [ "CY" ],
            358: [ "FI", "AX" ],
            359: [ "BG" ],
            370: [ "LT" ],
            371: [ "LV" ],
            372: [ "EE" ],
            373: [ "MD" ],
            374: [ "AM" ],
            375: [ "BY" ],
            376: [ "AD" ],
            377: [ "MC" ],
            378: [ "SM" ],
            380: [ "UA" ],
            381: [ "RS" ],
            382: [ "ME" ],
            383: [ "XK" ],
            385: [ "HR" ],
            386: [ "SI" ],
            387: [ "BA" ],
            389: [ "MK" ],
            420: [ "CZ" ],
            421: [ "SK" ],
            423: [ "LI" ],
            500: [ "FK" ],
            501: [ "BZ" ],
            502: [ "GT" ],
            503: [ "SV" ],
            504: [ "HN" ],
            505: [ "NI" ],
            506: [ "CR" ],
            507: [ "PA" ],
            508: [ "PM" ],
            509: [ "HT" ],
            590: [ "GP", "BL", "MF" ],
            591: [ "BO" ],
            592: [ "GY" ],
            593: [ "EC" ],
            594: [ "GF" ],
            595: [ "PY" ],
            596: [ "MQ" ],
            597: [ "SR" ],
            598: [ "UY" ],
            599: [ "CW", "BQ" ],
            670: [ "TL" ],
            672: [ "NF" ],
            673: [ "BN" ],
            674: [ "NR" ],
            675: [ "PG" ],
            676: [ "TO" ],
            677: [ "SB" ],
            678: [ "VU" ],
            679: [ "FJ" ],
            680: [ "PW" ],
            681: [ "WF" ],
            682: [ "CK" ],
            683: [ "NU" ],
            685: [ "WS" ],
            686: [ "KI" ],
            687: [ "NC" ],
            688: [ "TV" ],
            689: [ "PF" ],
            690: [ "TK" ],
            691: [ "FM" ],
            692: [ "MH" ],
            800: [ "001" ],
            808: [ "001" ],
            850: [ "KP" ],
            852: [ "HK" ],
            853: [ "MO" ],
            855: [ "KH" ],
            856: [ "LA" ],
            870: [ "001" ],
            878: [ "001" ],
            880: [ "BD" ],
            881: [ "001" ],
            882: [ "001" ],
            883: [ "001" ],
            886: [ "TW" ],
            888: [ "001" ],
            960: [ "MV" ],
            961: [ "LB" ],
            962: [ "JO" ],
            963: [ "SY" ],
            964: [ "IQ" ],
            965: [ "KW" ],
            966: [ "SA" ],
            967: [ "YE" ],
            968: [ "OM" ],
            970: [ "PS" ],
            971: [ "AE" ],
            972: [ "IL" ],
            973: [ "BH" ],
            974: [ "QA" ],
            975: [ "BT" ],
            976: [ "MN" ],
            977: [ "NP" ],
            979: [ "001" ],
            992: [ "TJ" ],
            993: [ "TM" ],
            994: [ "AZ" ],
            995: [ "GE" ],
            996: [ "KG" ],
            998: [ "UZ" ]
        }, va = {
            AC: [ , [ , , "(?:[01589]\\d|[46])\\d{4}", , , , , , , [ 5, 6 ] ], [ , , "6[2-467]\\d{3}", , , , "62889", , , [ 5 ] ], [ , , "4\\d{4}", , , , "40123", , , [ 5 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "AC", 247, "00", , , , , , , , , , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , "(?:0[1-9]|[1589]\\d)\\d{4}", , , , "542011", , , [ 6 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            AD: [ , [ , , "(?:1|6\\d)\\d{7}|[135-9]\\d{5}", , , , , , , [ 6, 8, 9 ] ], [ , , "[78]\\d{5}", , , , "712345", , , [ 6 ] ], [ , , "690\\d{6}|[356]\\d{5}", , , , "312345", , , [ 6, 9 ] ], [ , , "180[02]\\d{4}", , , , "18001234", , , [ 8 ] ], [ , , "[19]\\d{5}", , , , "912345", , , [ 6 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "AD", 376, "00", , , , , , , , [ [ , "(\\d{3})(\\d{3})", "$1 $2", [ "[135-9]" ] ], [ , "(\\d{4})(\\d{4})", "$1 $2", [ "1" ] ], [ , "(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", [ "6" ] ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , "1800\\d{4}", , , , , , , [ 8 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            AE: [ , [ , , "(?:[4-7]\\d|9[0-689])\\d{7}|800\\d{2,9}|[2-4679]\\d{7}", , , , , , , [ 5, 6, 7, 8, 9, 10, 11, 12 ] ], [ , , "[2-4679][2-8]\\d{6}", , , , "22345678", , , [ 8 ], [ 7 ] ], [ , , "5[024-68]\\d{7}", , , , "501234567", , , [ 9 ] ], [ , , "400\\d{6}|800\\d{2,9}", , , , "800123456" ], [ , , "900[02]\\d{5}", , , , "900234567", , , [ 9 ] ], [ , , "700[05]\\d{5}", , , , "700012345", , , [ 9 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "AE", 971, "00", "0", , , "0", , , , [ [ , "(\\d{3})(\\d{2,9})", "$1 $2", [ "60|8" ] ], [ , "(\\d)(\\d{3})(\\d{4})", "$1 $2 $3", [ "[236]|[479][2-8]" ], "0$1" ], [ , "(\\d{3})(\\d)(\\d{5})", "$1 $2 $3", [ "[479]" ] ], [ , "(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", [ "5" ], "0$1" ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , "600[25]\\d{5}", , , , "600212345", , , [ 9 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            AF: [ , [ , , "[2-7]\\d{8}", , , , , , , [ 9 ], [ 7 ] ], [ , , "(?:[25][0-8]|[34][0-4]|6[0-5])[2-9]\\d{6}", , , , "234567890", , , , [ 7 ] ], [ , , "7\\d{8}", , , , "701234567", , , , [ 7 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "AF", 93, "00", "0", , , "0", , , , [ [ , "(\\d{3})(\\d{4})", "$1 $2", [ "[1-9]" ] ], [ , "(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", [ "[2-7]" ], "0$1" ] ], [ [ , "(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", [ "[2-7]" ], "0$1" ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            AG: [ , [ , , "(?:268|[58]\\d\\d|900)\\d{7}", , , , , , , [ 10 ], [ 7 ] ], [ , , "268(?:4(?:6[0-38]|84)|56[0-2])\\d{4}", , , , "2684601234", , , , [ 7 ] ], [ , , "268(?:464|7(?:1[3-9]|[28]\\d|3[0246]|64|7[0-689]))\\d{4}", , , , "2684641234", , , , [ 7 ] ], [ , , "8(?:00|33|44|55|66|77|88)[2-9]\\d{6}", , , , "8002123456" ], [ , , "900[2-9]\\d{6}", , , , "9002123456" ], [ , , , , , , , , , [ -1 ] ], [ , , "52(?:3(?:[2-46-9][02-9]\\d|5(?:[02-46-9]\\d|5[0-46-9]))|4(?:[2-478][02-9]\\d|5(?:[034]\\d|2[024-9]|5[0-46-9])|6(?:0[1-9]|[2-9]\\d)|9(?:[05-9]\\d|2[0-5]|49)))\\d{4}|52[34][2-9]1[02-9]\\d{4}|5(?:00|2[12]|33|44|66|77|88)[2-9]\\d{6}", , , , "5002345678" ], [ , , "26848[01]\\d{4}", , , , "2684801234", , , , [ 7 ] ], "AG", 1, "011", "1", , , "1|([457]\\d{6})$", "268$1", , , , , [ , , "26840[69]\\d{4}", , , , "2684061234", , , , [ 7 ] ], , "268", [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            AI: [ , [ , , "(?:264|[58]\\d\\d|900)\\d{7}", , , , , , , [ 10 ], [ 7 ] ], [ , , "264(?:292|4(?:6[12]|9[78]))\\d{4}", , , , "2644612345", , , , [ 7 ] ], [ , , "264(?:235|4(?:69|76)|5(?:3[6-9]|8[1-4])|7(?:29|72))\\d{4}", , , , "2642351234", , , , [ 7 ] ], [ , , "8(?:00|33|44|55|66|77|88)[2-9]\\d{6}", , , , "8002123456" ], [ , , "900[2-9]\\d{6}", , , , "9002123456" ], [ , , , , , , , , , [ -1 ] ], [ , , "52(?:3(?:[2-46-9][02-9]\\d|5(?:[02-46-9]\\d|5[0-46-9]))|4(?:[2-478][02-9]\\d|5(?:[034]\\d|2[024-9]|5[0-46-9])|6(?:0[1-9]|[2-9]\\d)|9(?:[05-9]\\d|2[0-5]|49)))\\d{4}|52[34][2-9]1[02-9]\\d{4}|5(?:00|2[12]|33|44|66|77|88)[2-9]\\d{6}", , , , "5002345678" ], [ , , , , , , , , , [ -1 ] ], "AI", 1, "011", "1", , , "1|([2457]\\d{6})$", "264$1", , , , , [ , , "264724\\d{4}", , , , "2647241234", , , , [ 7 ] ], , "264", [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            AL: [ , [ , , "(?:700\\d\\d|900)\\d{3}|8\\d{5,7}|(?:[2-5]|6\\d)\\d{7}", , , , , , , [ 6, 7, 8, 9 ], [ 5 ] ], [ , , "4505[0-2]\\d{3}|(?:[2358][16-9]\\d[2-9]|4410)\\d{4}|(?:[2358][2-5][2-9]|4(?:[2-57-9][2-9]|6\\d))\\d{5}", , , , "22345678", , , [ 8 ], [ 5, 6, 7 ] ], [ , , "6(?:[78][2-9]|9\\d)\\d{6}", , , , "672123456", , , [ 9 ] ], [ , , "800\\d{4}", , , , "8001234", , , [ 7 ] ], [ , , "900[1-9]\\d\\d", , , , "900123", , , [ 6 ] ], [ , , "808[1-9]\\d\\d", , , , "808123", , , [ 6 ] ], [ , , "700[2-9]\\d{4}", , , , "70021234", , , [ 8 ] ], [ , , , , , , , , , [ -1 ] ], "AL", 355, "00", "0", , , "0", , , , [ [ , "(\\d{3})(\\d{3,4})", "$1 $2", [ "80|9" ], "0$1" ], [ , "(\\d)(\\d{3})(\\d{4})", "$1 $2 $3", [ "4[2-6]" ], "0$1" ], [ , "(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", [ "[2358][2-5]|4" ], "0$1" ], [ , "(\\d{3})(\\d{5})", "$1 $2", [ "[23578]" ], "0$1" ], [ , "(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", [ "6" ], "0$1" ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            AM: [ , [ , , "(?:[1-489]\\d|55|60|77)\\d{6}", , , , , , , [ 8 ], [ 5, 6 ] ], [ , , "(?:(?:1[0-25]|47)\\d|2(?:2[2-46]|3[1-8]|4[2-69]|5[2-7]|6[1-9]|8[1-7])|3[12]2)\\d{5}", , , , "10123456", , , , [ 5, 6 ] ], [ , , "(?:33|4[1349]|55|77|88|9[13-9])\\d{6}", , , , "77123456" ], [ , , "800\\d{5}", , , , "80012345" ], [ , , "90[016]\\d{5}", , , , "90012345" ], [ , , "80[1-4]\\d{5}", , , , "80112345" ], [ , , , , , , , , , [ -1 ] ], [ , , "60(?:2[78]|3[5-9]|4[02-9]|5[0-46-9]|[6-8]\\d|9[01])\\d{4}", , , , "60271234" ], "AM", 374, "00", "0", , , "0", , , , [ [ , "(\\d{3})(\\d{2})(\\d{3})", "$1 $2 $3", [ "[89]0" ], "0 $1" ], [ , "(\\d{3})(\\d{5})", "$1 $2", [ "2|3[12]" ], "(0$1)" ], [ , "(\\d{2})(\\d{6})", "$1 $2", [ "1|47" ], "(0$1)" ], [ , "(\\d{2})(\\d{6})", "$1 $2", [ "[3-9]" ], "0$1" ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            AO: [ , [ , , "[29]\\d{8}", , , , , , , [ 9 ] ], [ , , "2\\d(?:[0134][25-9]|[25-9]\\d)\\d{5}", , , , "222123456" ], [ , , "9[1-49]\\d{7}", , , , "923123456" ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "AO", 244, "00", , , , , , , , [ [ , "(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", [ "[29]" ] ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            AR: [ , [ , , "(?:11|[89]\\d\\d)\\d{8}|[2368]\\d{9}", , , , , , , [ 10, 11 ], [ 6, 7, 8 ] ], [ , , "3888[013-9]\\d{5}|(?:29(?:54|66)|3(?:777|865))[2-8]\\d{5}|3(?:7(?:1[15]|81)|8(?:21|4[16]|69|9[12]))[46]\\d{5}|(?:2(?:2(?:2[59]|44|52)|3(?:26|44)|473|9(?:[07]2|2[26]|34|46))|3327)[45]\\d{5}|(?:2(?:284|302|657|920)|3(?:4(?:8[27]|92)|541|755|878))[2-7]\\d{5}|(?:2(?:(?:26|62)2|32[03]|477|9(?:42|83))|3(?:329|4(?:[47]6|62|89)|564))[2-6]\\d{5}|(?:(?:11[1-8]|670)\\d|2(?:2(?:0[45]|1[2-6]|3[3-6])|3(?:[06]4|7[45])|494|6(?:04|1[2-8]|[36][45]|4[3-6])|80[45]|9(?:[17][4-6]|[48][45]|9[3-6]))|3(?:364|4(?:1[2-7]|[235][4-6]|84)|5(?:1[2-8]|[38][4-6])|6(?:2[45]|44)|7[069][45]|8(?:[03][45]|[17][2-6]|[58][3-6])))\\d{6}|2(?:2(?:21|4[23]|6[145]|7[1-4]|8[356]|9[267])|3(?:16|3[13-8]|43|5[346-8]|9[3-5])|475|6(?:2[46]|4[78]|5[1568])|9(?:03|2[1457-9]|3[1356]|4[08]|[56][23]|82))4\\d{5}|(?:2(?:2(?:57|81)|3(?:24|46|92)|9(?:01|23|64))|3(?:4(?:42|71)|5(?:25|37|4[347]|71)|7(?:18|5[17])))[3-6]\\d{5}|(?:2(?:2(?:02|2[3467]|4[156]|5[45]|6[6-8]|91)|3(?:1[47]|25|[45][25]|96)|47[48]|625|932)|3(?:38[2578]|4(?:0[0-24-9]|3[78]|4[457]|58|6[03-9]|72|83|9[136-8])|5(?:2[124]|[368][23]|4[2689]|7[2-6])|7(?:16|2[15]|3[145]|4[13]|5[468]|7[2-5]|8[26])|8(?:2[5-7]|3[278]|4[3-5]|5[78]|6[1-378]|[78]7|94)))[4-6]\\d{5}", , , , "1123456789", , , [ 10 ], [ 6, 7, 8 ] ], [ , , "93888[013-9]\\d{5}|9(?:29(?:54|66)|3(?:777|865))[2-8]\\d{5}|93(?:7(?:1[15]|81)|8(?:21|4[16]|69|9[12]))[46]\\d{5}|9(?:2(?:2(?:2[59]|44|52)|3(?:26|44)|473|9(?:[07]2|2[26]|34|46))|3327)[45]\\d{5}|9(?:2(?:284|302|657|920)|3(?:4(?:8[27]|92)|541|755|878))[2-7]\\d{5}|9(?:2(?:(?:26|62)2|32[03]|477|9(?:42|83))|3(?:329|4(?:[47]6|62|89)|564))[2-6]\\d{5}|(?:675\\d|9(?:11[1-8]\\d|2(?:2(?:0[45]|1[2-6]|3[3-6])|3(?:[06]4|7[45])|494|6(?:04|1[2-8]|[36][45]|4[3-6])|80[45]|9(?:[17][4-6]|[48][45]|9[3-6]))|3(?:364|4(?:1[2-7]|[235][4-6]|84)|5(?:1[2-8]|[38][4-6])|6(?:2[45]|44)|7[069][45]|8(?:[03][45]|[17][2-6]|[58][3-6]))))\\d{6}|92(?:2(?:21|4[23]|6[145]|7[1-4]|8[356]|9[267])|3(?:16|3[13-8]|43|5[346-8]|9[3-5])|475|6(?:2[46]|4[78]|5[1568])|9(?:03|2[1457-9]|3[1356]|4[08]|[56][23]|82))4\\d{5}|9(?:2(?:2(?:57|81)|3(?:24|46|92)|9(?:01|23|64))|3(?:4(?:42|71)|5(?:25|37|4[347]|71)|7(?:18|5[17])))[3-6]\\d{5}|9(?:2(?:2(?:02|2[3467]|4[156]|5[45]|6[6-8]|91)|3(?:1[47]|25|[45][25]|96)|47[48]|625|932)|3(?:38[2578]|4(?:0[0-24-9]|3[78]|4[457]|58|6[03-9]|72|83|9[136-8])|5(?:2[124]|[368][23]|4[2689]|7[2-6])|7(?:16|2[15]|3[145]|4[13]|5[468]|7[2-5]|8[26])|8(?:2[5-7]|3[278]|4[3-5]|5[78]|6[1-378]|[78]7|94)))[4-6]\\d{5}", , , , "91123456789", , , , [ 6, 7, 8 ] ], [ , , "800\\d{7,8}", , , , "8001234567" ], [ , , "60[04579]\\d{7}", , , , "6001234567", , , [ 10 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "AR", 54, "00", "0", , , "0?(?:(11|2(?:2(?:02?|[13]|2[13-79]|4[1-6]|5[2457]|6[124-8]|7[1-4]|8[13-6]|9[1267])|3(?:02?|1[467]|2[03-6]|3[13-8]|[49][2-6]|5[2-8]|[67])|4(?:7[3-578]|9)|6(?:[0136]|2[24-6]|4[6-8]?|5[15-8])|80|9(?:0[1-3]|[19]|2\\d|3[1-6]|4[02568]?|5[2-4]|6[2-46]|72?|8[23]?))|3(?:3(?:2[79]|6|8[2578])|4(?:0[0-24-9]|[12]|3[5-8]?|4[24-7]|5[4-68]?|6[02-9]|7[126]|8[2379]?|9[1-36-8])|5(?:1|2[1245]|3[237]?|4[1-46-9]|6[2-4]|7[1-6]|8[2-5]?)|6[24]|7(?:[069]|1[1568]|2[15]|3[145]|4[13]|5[14-8]|7[2-57]|8[126])|8(?:[01]|2[15-7]|3[2578]?|4[13-6]|5[4-8]?|6[1-357-9]|7[36-8]?|8[5-8]?|9[124])))15)?", "9$1", , , [ [ , "(\\d{3})", "$1", [ "0|1(?:0[0-35-7]|1[02-5]|2[015]|3[47]|4[478])|911" ] ], [ , "(\\d{2})(\\d{4})", "$1-$2", [ "[1-9]" ] ], [ , "(\\d{3})(\\d{4})", "$1-$2", [ "[2-8]" ] ], [ , "(\\d{4})(\\d{4})", "$1-$2", [ "[1-8]" ] ], [ , "(\\d{4})(\\d{2})(\\d{4})", "$1 $2-$3", [ "2(?:2[024-9]|3[0-59]|47|6[245]|9[02-8])|3(?:3[28]|4[03-9]|5[2-46-8]|7[1-578]|8[2-9])", "2(?:[23]02|6(?:[25]|4[6-8])|9(?:[02356]|4[02568]|72|8[23]))|3(?:3[28]|4(?:[04679]|3[5-8]|5[4-68]|8[2379])|5(?:[2467]|3[237]|8[2-5])|7[1-578]|8(?:[2469]|3[2578]|5[4-8]|7[36-8]|8[5-8]))|2(?:2[24-9]|3[1-59]|47)", "2(?:[23]02|6(?:[25]|4(?:64|[78]))|9(?:[02356]|4(?:[0268]|5[2-6])|72|8[23]))|3(?:3[28]|4(?:[04679]|3[78]|5(?:4[46]|8)|8[2379])|5(?:[2467]|3[237]|8[23])|7[1-578]|8(?:[2469]|3[278]|5[56][46]|86[3-6]))|2(?:2[24-9]|3[1-59]|47)|38(?:[58][78]|7[378])|3(?:4[35][56]|58[45]|8(?:[38]5|54|76))[4-6]", "2(?:[23]02|6(?:[25]|4(?:64|[78]))|9(?:[02356]|4(?:[0268]|5[2-6])|72|8[23]))|3(?:3[28]|4(?:[04679]|3(?:5(?:4[0-25689]|[56])|[78])|58|8[2379])|5(?:[2467]|3[237]|8(?:[23]|4(?:[45]|60)|5(?:4[0-39]|5|64)))|7[1-578]|8(?:[2469]|3[278]|54(?:4|5[13-7]|6[89])|86[3-6]))|2(?:2[24-9]|3[1-59]|47)|38(?:[58][78]|7[378])|3(?:454|85[56])[46]|3(?:4(?:36|5[56])|8(?:[38]5|76))[4-6]" ], "0$1", , 1 ], [ , "(\\d{2})(\\d{4})(\\d{4})", "$1 $2-$3", [ "1" ], "0$1", , 1 ], [ , "(\\d{3})(\\d{3})(\\d{4})", "$1-$2-$3", [ "[68]" ], "0$1" ], [ , "(\\d{3})(\\d{3})(\\d{4})", "$1 $2-$3", [ "[23]" ], "0$1", , 1 ], [ , "(\\d)(\\d{4})(\\d{2})(\\d{4})", "$2 15-$3-$4", [ "9(?:2[2-469]|3[3-578])", "9(?:2(?:2[024-9]|3[0-59]|47|6[245]|9[02-8])|3(?:3[28]|4[03-9]|5[2-46-8]|7[1-578]|8[2-9]))", "9(?:2(?:[23]02|6(?:[25]|4[6-8])|9(?:[02356]|4[02568]|72|8[23]))|3(?:3[28]|4(?:[04679]|3[5-8]|5[4-68]|8[2379])|5(?:[2467]|3[237]|8[2-5])|7[1-578]|8(?:[2469]|3[2578]|5[4-8]|7[36-8]|8[5-8])))|92(?:2[24-9]|3[1-59]|47)", "9(?:2(?:[23]02|6(?:[25]|4(?:64|[78]))|9(?:[02356]|4(?:[0268]|5[2-6])|72|8[23]))|3(?:3[28]|4(?:[04679]|3[78]|5(?:4[46]|8)|8[2379])|5(?:[2467]|3[237]|8[23])|7[1-578]|8(?:[2469]|3[278]|5(?:[56][46]|[78])|7[378]|8(?:6[3-6]|[78]))))|92(?:2[24-9]|3[1-59]|47)|93(?:4[35][56]|58[45]|8(?:[38]5|54|76))[4-6]", "9(?:2(?:[23]02|6(?:[25]|4(?:64|[78]))|9(?:[02356]|4(?:[0268]|5[2-6])|72|8[23]))|3(?:3[28]|4(?:[04679]|3(?:5(?:4[0-25689]|[56])|[78])|5(?:4[46]|8)|8[2379])|5(?:[2467]|3[237]|8(?:[23]|4(?:[45]|60)|5(?:4[0-39]|5|64)))|7[1-578]|8(?:[2469]|3[278]|5(?:4(?:4|5[13-7]|6[89])|[56][46]|[78])|7[378]|8(?:6[3-6]|[78]))))|92(?:2[24-9]|3[1-59]|47)|93(?:4(?:36|5[56])|8(?:[38]5|76))[4-6]" ], "0$1" ], [ , "(\\d)(\\d{2})(\\d{4})(\\d{4})", "$2 15-$3-$4", [ "91" ], "0$1" ], [ , "(\\d{3})(\\d{3})(\\d{5})", "$1-$2-$3", [ "8" ], "0$1" ], [ , "(\\d)(\\d{3})(\\d{3})(\\d{4})", "$2 15-$3-$4", [ "9" ], "0$1" ] ], [ [ , "(\\d{4})(\\d{2})(\\d{4})", "$1 $2-$3", [ "2(?:2[024-9]|3[0-59]|47|6[245]|9[02-8])|3(?:3[28]|4[03-9]|5[2-46-8]|7[1-578]|8[2-9])", "2(?:[23]02|6(?:[25]|4[6-8])|9(?:[02356]|4[02568]|72|8[23]))|3(?:3[28]|4(?:[04679]|3[5-8]|5[4-68]|8[2379])|5(?:[2467]|3[237]|8[2-5])|7[1-578]|8(?:[2469]|3[2578]|5[4-8]|7[36-8]|8[5-8]))|2(?:2[24-9]|3[1-59]|47)", "2(?:[23]02|6(?:[25]|4(?:64|[78]))|9(?:[02356]|4(?:[0268]|5[2-6])|72|8[23]))|3(?:3[28]|4(?:[04679]|3[78]|5(?:4[46]|8)|8[2379])|5(?:[2467]|3[237]|8[23])|7[1-578]|8(?:[2469]|3[278]|5[56][46]|86[3-6]))|2(?:2[24-9]|3[1-59]|47)|38(?:[58][78]|7[378])|3(?:4[35][56]|58[45]|8(?:[38]5|54|76))[4-6]", "2(?:[23]02|6(?:[25]|4(?:64|[78]))|9(?:[02356]|4(?:[0268]|5[2-6])|72|8[23]))|3(?:3[28]|4(?:[04679]|3(?:5(?:4[0-25689]|[56])|[78])|58|8[2379])|5(?:[2467]|3[237]|8(?:[23]|4(?:[45]|60)|5(?:4[0-39]|5|64)))|7[1-578]|8(?:[2469]|3[278]|54(?:4|5[13-7]|6[89])|86[3-6]))|2(?:2[24-9]|3[1-59]|47)|38(?:[58][78]|7[378])|3(?:454|85[56])[46]|3(?:4(?:36|5[56])|8(?:[38]5|76))[4-6]" ], "0$1", , 1 ], [ , "(\\d{2})(\\d{4})(\\d{4})", "$1 $2-$3", [ "1" ], "0$1", , 1 ], [ , "(\\d{3})(\\d{3})(\\d{4})", "$1-$2-$3", [ "[68]" ], "0$1" ], [ , "(\\d{3})(\\d{3})(\\d{4})", "$1 $2-$3", [ "[23]" ], "0$1", , 1 ], [ , "(\\d)(\\d{4})(\\d{2})(\\d{4})", "$1 $2 $3-$4", [ "9(?:2[2-469]|3[3-578])", "9(?:2(?:2[024-9]|3[0-59]|47|6[245]|9[02-8])|3(?:3[28]|4[03-9]|5[2-46-8]|7[1-578]|8[2-9]))", "9(?:2(?:[23]02|6(?:[25]|4[6-8])|9(?:[02356]|4[02568]|72|8[23]))|3(?:3[28]|4(?:[04679]|3[5-8]|5[4-68]|8[2379])|5(?:[2467]|3[237]|8[2-5])|7[1-578]|8(?:[2469]|3[2578]|5[4-8]|7[36-8]|8[5-8])))|92(?:2[24-9]|3[1-59]|47)", "9(?:2(?:[23]02|6(?:[25]|4(?:64|[78]))|9(?:[02356]|4(?:[0268]|5[2-6])|72|8[23]))|3(?:3[28]|4(?:[04679]|3[78]|5(?:4[46]|8)|8[2379])|5(?:[2467]|3[237]|8[23])|7[1-578]|8(?:[2469]|3[278]|5(?:[56][46]|[78])|7[378]|8(?:6[3-6]|[78]))))|92(?:2[24-9]|3[1-59]|47)|93(?:4[35][56]|58[45]|8(?:[38]5|54|76))[4-6]", "9(?:2(?:[23]02|6(?:[25]|4(?:64|[78]))|9(?:[02356]|4(?:[0268]|5[2-6])|72|8[23]))|3(?:3[28]|4(?:[04679]|3(?:5(?:4[0-25689]|[56])|[78])|5(?:4[46]|8)|8[2379])|5(?:[2467]|3[237]|8(?:[23]|4(?:[45]|60)|5(?:4[0-39]|5|64)))|7[1-578]|8(?:[2469]|3[278]|5(?:4(?:4|5[13-7]|6[89])|[56][46]|[78])|7[378]|8(?:6[3-6]|[78]))))|92(?:2[24-9]|3[1-59]|47)|93(?:4(?:36|5[56])|8(?:[38]5|76))[4-6]" ] ], [ , "(\\d)(\\d{2})(\\d{4})(\\d{4})", "$1 $2 $3-$4", [ "91" ] ], [ , "(\\d{3})(\\d{3})(\\d{5})", "$1-$2-$3", [ "8" ], "0$1" ], [ , "(\\d)(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3-$4", [ "9" ] ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , "810\\d{7}", , , , , , , [ 10 ] ], [ , , "810\\d{7}", , , , "8101234567", , , [ 10 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            AS: [ , [ , , "(?:[58]\\d\\d|684|900)\\d{7}", , , , , , , [ 10 ], [ 7 ] ], [ , , "6846(?:22|33|44|55|77|88|9[19])\\d{4}", , , , "6846221234", , , , [ 7 ] ], [ , , "684(?:2(?:48|5[2468]|72)|7(?:3[13]|70|82))\\d{4}", , , , "6847331234", , , , [ 7 ] ], [ , , "8(?:00|33|44|55|66|77|88)[2-9]\\d{6}", , , , "8002123456" ], [ , , "900[2-9]\\d{6}", , , , "9002123456" ], [ , , , , , , , , , [ -1 ] ], [ , , "52(?:3(?:[2-46-9][02-9]\\d|5(?:[02-46-9]\\d|5[0-46-9]))|4(?:[2-478][02-9]\\d|5(?:[034]\\d|2[024-9]|5[0-46-9])|6(?:0[1-9]|[2-9]\\d)|9(?:[05-9]\\d|2[0-5]|49)))\\d{4}|52[34][2-9]1[02-9]\\d{4}|5(?:00|2[12]|33|44|66|77|88)[2-9]\\d{6}", , , , "5002345678" ], [ , , , , , , , , , [ -1 ] ], "AS", 1, "011", "1", , , "1|([267]\\d{6})$", "684$1", , , , , [ , , , , , , , , , [ -1 ] ], , "684", [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            AT: [ , [ , , "1\\d{3,12}|2\\d{6,12}|43(?:(?:0\\d|5[02-9])\\d{3,9}|2\\d{4,5}|[3467]\\d{4}|8\\d{4,6}|9\\d{4,7})|5\\d{4,12}|8\\d{7,12}|9\\d{8,12}|(?:[367]\\d|4[0-24-9])\\d{4,11}", , , , , , , [ 4, 5, 6, 7, 8, 9, 10, 11, 12, 13 ], [ 3 ] ], [ , , "1(?:11\\d|[2-9]\\d{3,11})|(?:316|463|(?:51|66|73)2)\\d{3,10}|(?:2(?:1[467]|2[13-8]|5[2357]|6[1-46-8]|7[1-8]|8[124-7]|9[1458])|3(?:1[1-578]|3[23568]|4[5-7]|5[1378]|6[1-38]|8[3-68])|4(?:2[1-8]|35|7[1368]|8[2457])|5(?:2[1-8]|3[357]|4[147]|5[12578]|6[37])|6(?:13|2[1-47]|4[135-8]|5[468])|7(?:2[1-8]|35|4[13478]|5[68]|6[16-8]|7[1-6]|9[45]))\\d{4,10}", , , , "1234567890", , , , [ 3 ] ], [ , , "6(?:5[0-3579]|6[013-9]|[7-9]\\d)\\d{4,10}", , , , "664123456", , , [ 7, 8, 9, 10, 11, 12, 13 ] ], [ , , "800\\d{6,10}", , , , "800123456", , , [ 9, 10, 11, 12, 13 ] ], [ , , "(?:8[69][2-68]|9(?:0[01]|3[019]))\\d{6,10}", , , , "900123456", , , [ 9, 10, 11, 12, 13 ] ], [ , , "8(?:10|2[018])\\d{6,10}|828\\d{5}", , , , "810123456", , , [ 8, 9, 10, 11, 12, 13 ] ], [ , , , , , , , , , [ -1 ] ], [ , , "5(?:0[1-9]|17|[79]\\d)\\d{2,10}|7[28]0\\d{6,10}", , , , "780123456", , , [ 5, 6, 7, 8, 9, 10, 11, 12, 13 ] ], "AT", 43, "00", "0", , , "0", , , , [ [ , "(\\d)(\\d{3,12})", "$1 $2", [ "1(?:11|[2-9])" ], "0$1" ], [ , "(\\d{3})(\\d{2})", "$1 $2", [ "517" ], "0$1" ], [ , "(\\d{2})(\\d{3,5})", "$1 $2", [ "5[079]" ], "0$1" ], [ , "(\\d{6})", "$1", [ "1" ] ], [ , "(\\d{3})(\\d{3,10})", "$1 $2", [ "(?:31|4)6|51|6(?:5[0-3579]|[6-9])|7(?:20|32|8)|[89]" ], "0$1" ], [ , "(\\d{4})(\\d{3,9})", "$1 $2", [ "[2-467]|5[2-6]" ], "0$1" ], [ , "(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", [ "5" ], "0$1" ], [ , "(\\d{2})(\\d{4})(\\d{4,7})", "$1 $2 $3", [ "5" ], "0$1" ] ], [ [ , "(\\d)(\\d{3,12})", "$1 $2", [ "1(?:11|[2-9])" ], "0$1" ], [ , "(\\d{3})(\\d{2})", "$1 $2", [ "517" ], "0$1" ], [ , "(\\d{2})(\\d{3,5})", "$1 $2", [ "5[079]" ], "0$1" ], [ , "(\\d{3})(\\d{3,10})", "$1 $2", [ "(?:31|4)6|51|6(?:5[0-3579]|[6-9])|7(?:20|32|8)|[89]" ], "0$1" ], [ , "(\\d{4})(\\d{3,9})", "$1 $2", [ "[2-467]|5[2-6]" ], "0$1" ], [ , "(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", [ "5" ], "0$1" ], [ , "(\\d{2})(\\d{4})(\\d{4,7})", "$1 $2 $3", [ "5" ], "0$1" ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            AU: [ , [ , , "1(?:[0-79]\\d{7}(?:\\d(?:\\d{2})?)?|8[0-24-9]\\d{7})|[2-478]\\d{8}|1\\d{4,7}", , , , , , , [ 5, 6, 7, 8, 9, 10, 12 ] ], [ , , "(?:(?:2(?:[0-26-9]\\d|3[0-8]|4[02-9]|5[0135-9])|3(?:[0-3589]\\d|4[0-578]|6[1-9]|7[0-35-9])|7(?:[013-57-9]\\d|2[0-8]))\\d{3}|8(?:51(?:0(?:0[03-9]|[12479]\\d|3[2-9]|5[0-8]|6[1-9]|8[0-7])|1(?:[0235689]\\d|1[0-69]|4[0-589]|7[0-47-9])|2(?:0[0-79]|[18][13579]|2[14-9]|3[0-46-9]|[4-6]\\d|7[89]|9[0-4]))|(?:6[0-8]|[78]\\d)\\d{3}|9(?:[02-9]\\d{3}|1(?:(?:[0-58]\\d|6[0135-9])\\d|7(?:0[0-24-9]|[1-9]\\d)|9(?:[0-46-9]\\d|5[0-79])))))\\d{3}", , , , "212345678", , , [ 9 ], [ 8 ] ], [ , , "4(?:83[0-38]|93[0-6])\\d{5}|4(?:[0-3]\\d|4[047-9]|5[0-25-9]|6[06-9]|7[02-9]|8[0-24-9]|9[0-27-9])\\d{6}", , , , "412345678", , , [ 9 ] ], [ , , "180(?:0\\d{3}|2)\\d{3}", , , , "1800123456", , , [ 7, 10 ] ], [ , , "190[0-26]\\d{6}", , , , "1900123456", , , [ 10 ] ], [ , , "13(?:00\\d{6}(?:\\d{2})?|45[0-4]\\d{3})|13\\d{4}", , , , "1300123456", , , [ 6, 8, 10, 12 ] ], [ , , , , , , , , , [ -1 ] ], [ , , "14(?:5(?:1[0458]|[23][458])|71\\d)\\d{4}", , , , "147101234", , , [ 9 ] ], "AU", 61, "001[14-689]|14(?:1[14]|34|4[17]|[56]6|7[47]|88)0011", "0", , , "0|(183[12])", , "0011", , [ [ , "(\\d{2})(\\d{3,4})", "$1 $2", [ "16" ], "0$1" ], [ , "(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3", [ "13" ] ], [ , "(\\d{3})(\\d{3})", "$1 $2", [ "19" ] ], [ , "(\\d{3})(\\d{4})", "$1 $2", [ "180", "1802" ] ], [ , "(\\d{4})(\\d{3,4})", "$1 $2", [ "19" ] ], [ , "(\\d{2})(\\d{3})(\\d{2,4})", "$1 $2 $3", [ "16" ], "0$1" ], [ , "(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", [ "14|4" ], "0$1" ], [ , "(\\d)(\\d{4})(\\d{4})", "$1 $2 $3", [ "[2378]" ], "(0$1)", "$CC ($1)" ], [ , "(\\d{4})(\\d{3})(\\d{3})", "$1 $2 $3", [ "1(?:30|[89])" ] ], [ , "(\\d{4})(\\d{4})(\\d{4})", "$1 $2 $3", [ "130" ] ] ], [ [ , "(\\d{2})(\\d{3,4})", "$1 $2", [ "16" ], "0$1" ], [ , "(\\d{2})(\\d{3})(\\d{2,4})", "$1 $2 $3", [ "16" ], "0$1" ], [ , "(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", [ "14|4" ], "0$1" ], [ , "(\\d)(\\d{4})(\\d{4})", "$1 $2 $3", [ "[2378]" ], "(0$1)", "$CC ($1)" ], [ , "(\\d{4})(\\d{3})(\\d{3})", "$1 $2 $3", [ "1(?:30|[89])" ] ] ], [ , , "163\\d{2,6}", , , , "1631234", , , [ 5, 6, 7, 8, 9 ] ], 1, , [ , , "1(?:3(?:00\\d{5}|45[0-4])|802)\\d{3}|1[38]00\\d{6}|13\\d{4}", , , , , , , [ 6, 7, 8, 10, 12 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            AW: [ , [ , , "(?:[25-79]\\d\\d|800)\\d{4}", , , , , , , [ 7 ] ], [ , , "5(?:2\\d|8[1-9])\\d{4}", , , , "5212345" ], [ , , "(?:290|5[69]\\d|6(?:[03]0|22|4[0-2]|[69]\\d)|7(?:[34]\\d|7[07])|9(?:6[45]|9[4-8]))\\d{4}", , , , "5601234" ], [ , , "800\\d{4}", , , , "8001234" ], [ , , "900\\d{4}", , , , "9001234" ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , "(?:28\\d|501)\\d{4}", , , , "5011234" ], "AW", 297, "00", , , , , , , , [ [ , "(\\d{3})(\\d{4})", "$1 $2", [ "[25-9]" ] ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            AX: [ , [ , , "2\\d{4,9}|35\\d{4,5}|(?:60\\d\\d|800)\\d{4,6}|7\\d{5,11}|(?:[14]\\d|3[0-46-9]|50)\\d{4,8}", , , , , , , [ 5, 6, 7, 8, 9, 10, 11, 12 ] ], [ , , "18[1-8]\\d{3,6}", , , , "181234567", , , [ 6, 7, 8, 9 ] ], [ , , "4946\\d{2,6}|(?:4[0-8]|50)\\d{4,8}", , , , "412345678", , , [ 6, 7, 8, 9, 10 ] ], [ , , "800\\d{4,6}", , , , "800123456", , , [ 7, 8, 9 ] ], [ , , "[67]00\\d{5,6}", , , , "600123456", , , [ 8, 9 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "AX", 358, "00|99(?:[01469]|5(?:[14]1|3[23]|5[59]|77|88|9[09]))", "0", , , "0", , "00", , , , [ , , , , , , , , , [ -1 ] ], , "18", [ , , , , , , , , , [ -1 ] ], [ , , "20\\d{4,8}|60[12]\\d{5,6}|7(?:099\\d{4,5}|5[03-9]\\d{3,7})|20[2-59]\\d\\d|(?:606|7(?:0[78]|1|3\\d))\\d{7}|(?:10|29|3[09]|70[1-5]\\d)\\d{4,8}", , , , "10112345" ], , , [ , , , , , , , , , [ -1 ] ] ],
            AZ: [ , [ , , "365\\d{6}|(?:[124579]\\d|60|88)\\d{7}", , , , , , , [ 9 ], [ 7 ] ], [ , , "(?:2[12]428|3655[02])\\d{4}|(?:2(?:22[0-79]|63[0-28])|3654)\\d{5}|(?:(?:1[28]|46)\\d|2(?:[014-6]2|[23]3))\\d{6}", , , , "123123456", , , , [ 7 ] ], [ , , "36554\\d{4}|(?:[16]0|4[04]|5[015]|7[07]|99)\\d{7}", , , , "401234567" ], [ , , "88\\d{7}", , , , "881234567" ], [ , , "900200\\d{3}", , , , "900200123" ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "AZ", 994, "00", "0", , , "0", , , , [ [ , "(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3", [ "[1-9]" ] ], [ , "(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", [ "90" ], "0$1" ], [ , "(\\d{2})(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3 $4", [ "1[28]|2|365|46", "1[28]|2|365[45]|46", "1[28]|2|365(?:4|5[02])|46" ], "(0$1)" ], [ , "(\\d{2})(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3 $4", [ "[13-9]" ], "0$1" ] ], [ [ , "(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", [ "90" ], "0$1" ], [ , "(\\d{2})(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3 $4", [ "1[28]|2|365|46", "1[28]|2|365[45]|46", "1[28]|2|365(?:4|5[02])|46" ], "(0$1)" ], [ , "(\\d{2})(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3 $4", [ "[13-9]" ], "0$1" ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            BA: [ , [ , , "6\\d{8}|(?:[35689]\\d|49|70)\\d{6}", , , , , , , [ 8, 9 ], [ 6 ] ], [ , , "(?:3(?:[05-79][2-9]|1[4579]|[23][24-9]|4[2-4689]|8[2457-9])|49[2-579]|5(?:0[2-49]|[13][2-9]|[268][2-4679]|4[4689]|5[2-79]|7[2-69]|9[2-4689]))\\d{5}", , , , "30212345", , , [ 8 ], [ 6 ] ], [ , , "6040\\d{5}|6(?:03|[1-356]|44|7\\d)\\d{6}", , , , "61123456" ], [ , , "8[08]\\d{6}", , , , "80123456", , , [ 8 ] ], [ , , "9[0246]\\d{6}", , , , "90123456", , , [ 8 ] ], [ , , "8[12]\\d{6}", , , , "82123456", , , [ 8 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "BA", 387, "00", "0", , , "0", , , , [ [ , "(\\d{3})(\\d{3})", "$1-$2", [ "[2-9]" ] ], [ , "(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", [ "6[1-3]|[7-9]" ], "0$1" ], [ , "(\\d{2})(\\d{3})(\\d{3})", "$1 $2-$3", [ "[3-5]|6[56]" ], "0$1" ], [ , "(\\d{2})(\\d{2})(\\d{2})(\\d{3})", "$1 $2 $3 $4", [ "6" ], "0$1" ] ], [ [ , "(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", [ "6[1-3]|[7-9]" ], "0$1" ], [ , "(\\d{2})(\\d{3})(\\d{3})", "$1 $2-$3", [ "[3-5]|6[56]" ], "0$1" ], [ , "(\\d{2})(\\d{2})(\\d{2})(\\d{3})", "$1 $2 $3 $4", [ "6" ], "0$1" ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , "703[235]0\\d{3}|70(?:2[0-5]|3[0146]|[56]0)\\d{4}", , , , "70341234", , , [ 8 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            BB: [ , [ , , "(?:246|[58]\\d\\d|900)\\d{7}", , , , , , , [ 10 ], [ 7 ] ], [ , , "246(?:2(?:2[78]|7[0-4])|4(?:1[024-6]|2\\d|3[2-9])|5(?:20|[34]\\d|54|7[1-3])|6(?:2\\d|38)|7[35]7|9(?:1[89]|63))\\d{4}", , , , "2464123456", , , , [ 7 ] ], [ , , "246(?:2(?:[3568]\\d|4[0-57-9])|45\\d|69[5-7]|8(?:[2-5]\\d|83))\\d{4}", , , , "2462501234", , , , [ 7 ] ], [ , , "8(?:00|33|44|55|66|77|88)[2-9]\\d{6}", , , , "8002123456" ], [ , , "(?:246976|900[2-9]\\d\\d)\\d{4}", , , , "9002123456", , , , [ 7 ] ], [ , , , , , , , , , [ -1 ] ], [ , , "52(?:3(?:[2-46-9][02-9]\\d|5(?:[02-46-9]\\d|5[0-46-9]))|4(?:[2-478][02-9]\\d|5(?:[034]\\d|2[024-9]|5[0-46-9])|6(?:0[1-9]|[2-9]\\d)|9(?:[05-9]\\d|2[0-5]|49)))\\d{4}|52[34][2-9]1[02-9]\\d{4}|5(?:00|2[12]|33|44|66|77|88)[2-9]\\d{6}", , , , "5002345678" ], [ , , "24631\\d{5}", , , , "2463101234", , , , [ 7 ] ], "BB", 1, "011", "1", , , "1|([2-9]\\d{6})$", "246$1", , , , , [ , , , , , , , , , [ -1 ] ], , "246", [ , , , , , , , , , [ -1 ] ], [ , , "246(?:292|367|4(?:1[7-9]|3[01]|44|67)|7(?:36|53))\\d{4}", , , , "2464301234", , , , [ 7 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            BD: [ , [ , , "[1-469]\\d{9}|8[0-79]\\d{7,8}|[2-79]\\d{8}|[2-9]\\d{7}|[3-9]\\d{6}|[57-9]\\d{5}", , , , , , , [ 6, 7, 8, 9, 10 ] ], [ , , "(?:4(?:31\\d\\d|423)|5222)\\d{3}(?:\\d{2})?|8332[6-9]\\d\\d|(?:3(?:03[56]|224)|4(?:22[25]|653))\\d{3,4}|(?:3(?:42[47]|529|823)|4(?:027|525|65(?:28|8))|562|6257|7(?:1(?:5[3-5]|6[12]|7[156]|89)|22[589]56|32|42675|52(?:[25689](?:56|8)|[347]8)|71(?:6[1267]|75|89)|92374)|82(?:2[59]|32)56|9(?:03[23]56|23(?:256|373)|31|5(?:1|2[4589]56)))\\d{3}|(?:3(?:02[348]|22[35]|324|422)|4(?:22[67]|32[236-9]|6(?:2[46]|5[57])|953)|5526|6(?:024|6655)|81)\\d{4,5}|(?:2(?:7(?:1[0-267]|2[0-289]|3[0-29]|4[01]|5[1-3]|6[013]|7[0178]|91)|8(?:0[125]|1[1-6]|2[0157-9]|3[1-69]|41|6[1-35]|7[1-5]|8[1-8]|9[0-6])|9(?:0[0-2]|1[0-4]|2[568]|3[3-6]|5[5-7]|6[0136-9]|7[0-7]|8[014-9]))|3(?:0(?:2[025-79]|3[2-4])|181|22[12]|32[2356]|824)|4(?:02[09]|22[348]|32[045]|523|6(?:27|54))|666(?:22|53)|7(?:22[57-9]|42[56]|82[35])8|8(?:0[124-9]|2(?:181|2[02-4679]8)|4[12]|[5-7]2)|9(?:[04]2|2(?:2|328)|81))\\d{4}|(?:2(?:222|[45]\\d)\\d|3(?:1(?:2[5-7]|[5-7])|425|822)|4(?:033|1\\d|[257]1|332|4(?:2[246]|5[25])|6(?:2[35]|56|62)|8(?:23|54)|92[2-5])|5(?:02[03489]|22[457]|32[35-79]|42[46]|6(?:[18]|53)|724|826)|6(?:023|2(?:2[2-5]|5[3-5]|8)|32[3478]|42[34]|52[47]|6(?:[18]|6(?:2[34]|5[24]))|[78]2[2-5]|92[2-6])|7(?:02|21\\d|[3-589]1|6[12]|72[24])|8(?:217|3[12]|[5-7]1)|9[24]1)\\d{5}|(?:(?:3[2-8]|5[2-57-9]|6[03-589])1|4[4689][18])\\d{5}|[59]1\\d{5}", , , , "27111234" ], [ , , "(?:1[13-9]\\d|644)\\d{7}|(?:3[78]|44|66)[02-9]\\d{7}", , , , "1812345678", , , [ 10 ] ], [ , , "80[03]\\d{7}", , , , "8001234567", , , [ 10 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , "96(?:0[469]|1[0-47]|3[389]|6[69]|7[78])\\d{6}", , , , "9604123456", , , [ 10 ] ], "BD", 880, "00", "0", , , "0", , , , [ [ , "(\\d{2})(\\d{4,6})", "$1-$2", [ "31[5-8]|[459]1" ], "0$1" ], [ , "(\\d{3})(\\d{3,7})", "$1-$2", [ "3(?:[67]|8[013-9])|4(?:6[168]|7|[89][18])|5(?:6[128]|9)|6(?:28|4[14]|5)|7[2-589]|8(?:0[014-9]|[12])|9[358]|(?:3[2-5]|4[235]|5[2-578]|6[0389]|76|8[3-7]|9[24])1|(?:44|66)[01346-9]" ], "0$1" ], [ , "(\\d{4})(\\d{3,6})", "$1-$2", [ "[13-9]|22" ], "0$1" ], [ , "(\\d)(\\d{7,8})", "$1-$2", [ "2" ], "0$1" ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            BE: [ , [ , , "4\\d{8}|[1-9]\\d{7}", , , , , , , [ 8, 9 ] ], [ , , "80[2-8]\\d{5}|(?:1[0-69]|[23][2-8]|4[23]|5\\d|6[013-57-9]|71|8[1-79]|9[2-4])\\d{6}", , , , "12345678", , , [ 8 ] ], [ , , "4[5-9]\\d{7}", , , , "470123456", , , [ 9 ] ], [ , , "800[1-9]\\d{4}", , , , "80012345", , , [ 8 ] ], [ , , "(?:70(?:2[0-57]|3[04-7]|44|69|7[0579])|90(?:0[0-8]|1[36]|2[0-3568]|3[013-689]|[47][2-68]|5[1-68]|6[0-378]|9[34679]))\\d{4}", , , , "90012345", , , [ 8 ] ], [ , , "7879\\d{4}", , , , "78791234", , , [ 8 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "BE", 32, "00", "0", , , "0", , , , [ [ , "(\\d{3})(\\d{2})(\\d{3})", "$1 $2 $3", [ "(?:80|9)0" ], "0$1" ], [ , "(\\d)(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3 $4", [ "[239]|4[23]" ], "0$1" ], [ , "(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", [ "[15-8]" ], "0$1" ], [ , "(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", [ "4" ], "0$1" ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , "78(?:0[57]|1[0458]|2[25]|3[15-8]|48|[56]0|7[078]|9\\d)\\d{4}", , , , "78102345", , , [ 8 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            BF: [ , [ , , "[025-7]\\d{7}", , , , , , , [ 8 ] ], [ , , "2(?:0(?:49|5[23]|6[56]|9[016-9])|4(?:4[569]|5[4-6]|6[56]|7[0179])|5(?:[34]\\d|50|6[5-7]))\\d{4}", , , , "20491234" ], [ , , "(?:0[1267]|5[1-8]|[67]\\d)\\d{6}", , , , "70123456" ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "BF", 226, "00", , , , , , , , [ [ , "(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", [ "[025-7]" ] ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            BG: [ , [ , , "[2-7]\\d{6,7}|[89]\\d{6,8}|2\\d{5}", , , , , , , [ 6, 7, 8, 9 ], [ 4, 5 ] ], [ , , "2\\d{5,7}|(?:43[1-6]|70[1-9])\\d{4,5}|(?:[36]\\d|4[124-7]|[57][1-9]|8[1-6]|9[1-7])\\d{5,6}", , , , "2123456", , , [ 6, 7, 8 ], [ 4, 5 ] ], [ , , "43[07-9]\\d{5}|(?:48|8[7-9]\\d|9(?:8\\d|9[69]))\\d{6}", , , , "48123456", , , [ 8, 9 ] ], [ , , "800\\d{5}", , , , "80012345", , , [ 8 ] ], [ , , "90\\d{6}", , , , "90123456", , , [ 8 ] ], [ , , "700\\d{5}", , , , "70012345", , , [ 8 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "BG", 359, "00", "0", , , "0", , , , [ [ , "(\\d{6})", "$1", [ "1" ] ], [ , "(\\d)(\\d)(\\d{2})(\\d{2})", "$1 $2 $3 $4", [ "2" ], "0$1" ], [ , "(\\d{3})(\\d{4})", "$1 $2", [ "43[1-6]|70[1-9]" ], "0$1" ], [ , "(\\d)(\\d{3})(\\d{3,4})", "$1 $2 $3", [ "2" ], "0$1" ], [ , "(\\d{2})(\\d{3})(\\d{2,3})", "$1 $2 $3", [ "[356]|4[124-7]|7[1-9]|8[1-6]|9[1-7]" ], "0$1" ], [ , "(\\d{3})(\\d{2})(\\d{3})", "$1 $2 $3", [ "(?:70|8)0" ], "0$1" ], [ , "(\\d{3})(\\d{3})(\\d{2})", "$1 $2 $3", [ "43[1-7]|7" ], "0$1" ], [ , "(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", [ "[48]|9[08]" ], "0$1" ], [ , "(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", [ "9" ], "0$1" ] ], [ [ , "(\\d)(\\d)(\\d{2})(\\d{2})", "$1 $2 $3 $4", [ "2" ], "0$1" ], [ , "(\\d{3})(\\d{4})", "$1 $2", [ "43[1-6]|70[1-9]" ], "0$1" ], [ , "(\\d)(\\d{3})(\\d{3,4})", "$1 $2 $3", [ "2" ], "0$1" ], [ , "(\\d{2})(\\d{3})(\\d{2,3})", "$1 $2 $3", [ "[356]|4[124-7]|7[1-9]|8[1-6]|9[1-7]" ], "0$1" ], [ , "(\\d{3})(\\d{2})(\\d{3})", "$1 $2 $3", [ "(?:70|8)0" ], "0$1" ], [ , "(\\d{3})(\\d{3})(\\d{2})", "$1 $2 $3", [ "43[1-7]|7" ], "0$1" ], [ , "(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", [ "[48]|9[08]" ], "0$1" ], [ , "(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", [ "9" ], "0$1" ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            BH: [ , [ , , "[136-9]\\d{7}", , , , , , , [ 8 ] ], [ , , "(?:1(?:3[1356]|6[0156]|7\\d)\\d|6(?:1[16]\\d|500|6(?:0\\d|3[12]|44|7[7-9]|88)|9[69][69])|7(?:1(?:11|78)|7\\d\\d))\\d{4}", , , , "17001234" ], [ , , "(?:3(?:[1-79]\\d|8[0-47-9])\\d|6(?:3(?:00|33|6[16])|6(?:3[03-9]|[69]\\d|7[0-6])))\\d{4}", , , , "36001234" ], [ , , "80\\d{6}", , , , "80123456" ], [ , , "(?:87|9[014578])\\d{6}", , , , "90123456" ], [ , , "84\\d{6}", , , , "84123456" ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "BH", 973, "00", , , , , , , , [ [ , "(\\d{4})(\\d{4})", "$1 $2", [ "[13679]|8[047]" ] ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            BI: [ , [ , , "(?:[267]\\d|31)\\d{6}", , , , , , , [ 8 ] ], [ , , "22\\d{6}", , , , "22201234" ], [ , , "(?:29|31|6[1257-9]|7[125-9])\\d{6}", , , , "79561234" ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "BI", 257, "00", , , , , , , , [ [ , "(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", [ "[2367]" ] ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            BJ: [ , [ , , "[25689]\\d{7}", , , , , , , [ 8 ] ], [ , , "2(?:02|1[037]|2[45]|3[68])\\d{5}", , , , "20211234" ], [ , , "(?:5[1-35-8]|6\\d|9[013-9])\\d{6}", , , , "90011234" ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , "857[58]\\d{4}", , , , "85751234" ], "BJ", 229, "00", , , , , , , , [ [ , "(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", [ "[25689]" ] ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , "81\\d{6}", , , , "81123456" ], , , [ , , , , , , , , , [ -1 ] ] ],
            BL: [ , [ , , "(?:590|(?:69|80)\\d|976)\\d{6}", , , , , , , [ 9 ] ], [ , , "590(?:2[7-9]|5[12]|87)\\d{4}", , , , "590271234" ], [ , , "69(?:0\\d\\d|1(?:2[2-9]|3[0-5]))\\d{4}", , , , "690001234" ], [ , , "80[0-5]\\d{6}", , , , "800012345" ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , "976[01]\\d{5}", , , , "976012345" ], "BL", 590, "00", "0", , , "0", , , , , , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            BM: [ , [ , , "(?:441|[58]\\d\\d|900)\\d{7}", , , , , , , [ 10 ], [ 7 ] ], [ , , "441(?:[46]\\d\\d|5(?:4\\d|60|89))\\d{4}", , , , "4414123456", , , , [ 7 ] ], [ , , "441(?:[2378]\\d|5[0-39])\\d{5}", , , , "4413701234", , , , [ 7 ] ], [ , , "8(?:00|33|44|55|66|77|88)[2-9]\\d{6}", , , , "8002123456" ], [ , , "900[2-9]\\d{6}", , , , "9002123456" ], [ , , , , , , , , , [ -1 ] ], [ , , "52(?:3(?:[2-46-9][02-9]\\d|5(?:[02-46-9]\\d|5[0-46-9]))|4(?:[2-478][02-9]\\d|5(?:[034]\\d|2[024-9]|5[0-46-9])|6(?:0[1-9]|[2-9]\\d)|9(?:[05-9]\\d|2[0-5]|49)))\\d{4}|52[34][2-9]1[02-9]\\d{4}|5(?:00|2[12]|33|44|66|77|88)[2-9]\\d{6}", , , , "5002345678" ], [ , , , , , , , , , [ -1 ] ], "BM", 1, "011", "1", , , "1|([2-8]\\d{6})$", "441$1", , , , , [ , , , , , , , , , [ -1 ] ], , "441", [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            BN: [ , [ , , "[2-578]\\d{6}", , , , , , , [ 7 ] ], [ , , "22[0-7]\\d{4}|(?:2[013-9]|[34]\\d|5[0-25-9])\\d{5}", , , , "2345678" ], [ , , "(?:22[89]|[78]\\d\\d)\\d{4}", , , , "7123456" ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , "5[34]\\d{5}", , , , "5345678" ], "BN", 673, "00", , , , , , , , [ [ , "(\\d{3})(\\d{4})", "$1 $2", [ "[2-578]" ] ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            BO: [ , [ , , "(?:[2-467]\\d\\d|8001)\\d{5}", , , , , , , [ 8, 9 ], [ 7 ] ], [ , , "(?:2(?:2\\d\\d|5(?:11|[258]\\d|9[67])|6(?:12|2\\d|9[34])|8(?:2[34]|39|62))|3(?:3\\d\\d|4(?:6\\d|8[24])|8(?:25|42|5[257]|86|9[25])|9(?:[27]\\d|3[2-4]|4[248]|5[24]|6[2-6]))|4(?:4\\d\\d|6(?:11|[24689]\\d|72)))\\d{4}", , , , "22123456", , , [ 8 ], [ 7 ] ], [ , , "[67]\\d{7}", , , , "71234567", , , [ 8 ] ], [ , , "8001[07]\\d{4}", , , , "800171234", , , [ 9 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "BO", 591, "00(?:1\\d)?", "0", , , "0(1\\d)?", , , , [ [ , "(\\d)(\\d{7})", "$1 $2", [ "[23]|4[46]" ], , "0$CC $1" ], [ , "(\\d{8})", "$1", [ "[67]" ], , "0$CC $1" ], [ , "(\\d{3})(\\d{2})(\\d{4})", "$1 $2 $3", [ "8" ], , "0$CC $1" ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , "8001[07]\\d{4}", , , , , , , [ 9 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            BQ: [ , [ , , "(?:[34]1|7\\d)\\d{5}", , , , , , , [ 7 ] ], [ , , "(?:318[023]|41(?:6[023]|70)|7(?:1[578]|2[05]|50)\\d)\\d{3}", , , , "7151234" ], [ , , "(?:31(?:8[14-8]|9[14578])|416[14-9]|7(?:0[01]|7[07]|8\\d|9[056])\\d)\\d{3}", , , , "3181234" ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "BQ", 599, "00", , , , , , , , , , [ , , , , , , , , , [ -1 ] ], , "[347]", [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            BR: [ , [ , , "(?:[1-46-9]\\d\\d|5(?:[0-46-9]\\d|5[0-24679]))\\d{8}|[1-9]\\d{9}|[3589]\\d{8}|[34]\\d{7}", , , , , , , [ 8, 9, 10, 11 ] ], [ , , "(?:[14689][1-9]|2[12478]|3[1-578]|5[13-5]|7[13-579])[2-5]\\d{7}", , , , "1123456789", , , [ 10 ], [ 8 ] ], [ , , "(?:[14689][1-9]|2[12478]|3[1-578]|5[13-5]|7[13-579])(?:7|9\\d)\\d{7}", , , , "11961234567", , , [ 10, 11 ], [ 8, 9 ] ], [ , , "800\\d{6,7}", , , , "800123456", , , [ 9, 10 ] ], [ , , "300\\d{6}|[59]00\\d{6,7}", , , , "300123456", , , [ 9, 10 ] ], [ , , "300\\d{7}|[34]00\\d{5}|4(?:02|37)0\\d{4}", , , , "40041234", , , [ 8, 10 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "BR", 55, "00(?:1[245]|2[1-35]|31|4[13]|[56]5|99)", "0", , , "(?:0|90)(?:(1[245]|2[1-35]|31|4[13]|[56]5|99)(\\d{10,11}))?", "$2", , , [ [ , "(\\d{3,6})", "$1", [ "1(?:1[25-8]|2[357-9]|3[02-68]|4[12568]|5|6[0-8]|8[015]|9[0-47-9])|321|610" ] ], [ , "(\\d{4})(\\d{4})", "$1-$2", [ "300|4(?:0[02]|37)", "4(?:02|37)0|[34]00" ] ], [ , "(\\d{4})(\\d{4})", "$1-$2", [ "[2-57]", "[2357]|4(?:[0-24-9]|3(?:[0-689]|7[1-9]))" ] ], [ , "(\\d{3})(\\d{2,3})(\\d{4})", "$1 $2 $3", [ "(?:[358]|90)0" ], "0$1" ], [ , "(\\d{5})(\\d{4})", "$1-$2", [ "9" ] ], [ , "(\\d{2})(\\d{4})(\\d{4})", "$1 $2-$3", [ "(?:[14689][1-9]|2[12478]|3[1-578]|5[13-5]|7[13-579])[2-57]" ], "($1)", "0 $CC ($1)" ], [ , "(\\d{2})(\\d{5})(\\d{4})", "$1 $2-$3", [ "[16][1-9]|[2-57-9]" ], "($1)", "0 $CC ($1)" ] ], [ [ , "(\\d{4})(\\d{4})", "$1-$2", [ "300|4(?:0[02]|37)", "4(?:02|37)0|[34]00" ] ], [ , "(\\d{3})(\\d{2,3})(\\d{4})", "$1 $2 $3", [ "(?:[358]|90)0" ], "0$1" ], [ , "(\\d{2})(\\d{4})(\\d{4})", "$1 $2-$3", [ "(?:[14689][1-9]|2[12478]|3[1-578]|5[13-5]|7[13-579])[2-57]" ], "($1)", "0 $CC ($1)" ], [ , "(\\d{2})(\\d{5})(\\d{4})", "$1 $2-$3", [ "[16][1-9]|[2-57-9]" ], "($1)", "0 $CC ($1)" ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , "4020\\d{4}|[34]00\\d{5}", , , , , , , [ 8 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            BS: [ , [ , , "(?:242|[58]\\d\\d|900)\\d{7}", , , , , , , [ 10 ], [ 7 ] ], [ , , "242(?:3(?:02|[236][1-9]|4[0-24-9]|5[0-68]|7[347]|8[0-4]|9[2-467])|461|502|6(?:0[1-4]|12|2[013]|[45]0|7[67]|8[78]|9[89])|7(?:02|88))\\d{4}", , , , "2423456789", , , , [ 7 ] ], [ , , "242(?:3(?:5[79]|7[56]|95)|4(?:[23][1-9]|4[1-35-9]|5[1-8]|6[2-8]|7\\d|81)|5(?:2[45]|3[35]|44|5[1-46-9]|65|77)|6[34]6|7(?:27|38)|8(?:0[1-9]|1[02-9]|2\\d|[89]9))\\d{4}", , , , "2423591234", , , , [ 7 ] ], [ , , "242300\\d{4}|8(?:00|33|44|55|66|77|88)[2-9]\\d{6}", , , , "8002123456", , , , [ 7 ] ], [ , , "900[2-9]\\d{6}", , , , "9002123456" ], [ , , , , , , , , , [ -1 ] ], [ , , "52(?:3(?:[2-46-9][02-9]\\d|5(?:[02-46-9]\\d|5[0-46-9]))|4(?:[2-478][02-9]\\d|5(?:[034]\\d|2[024-9]|5[0-46-9])|6(?:0[1-9]|[2-9]\\d)|9(?:[05-9]\\d|2[0-5]|49)))\\d{4}|52[34][2-9]1[02-9]\\d{4}|5(?:00|2[12]|33|44|66|77|88)[2-9]\\d{6}", , , , "5002345678" ], [ , , , , , , , , , [ -1 ] ], "BS", 1, "011", "1", , , "1|([3-8]\\d{6})$", "242$1", , , , , [ , , , , , , , , , [ -1 ] ], , "242", [ , , , , , , , , , [ -1 ] ], [ , , "242225\\d{4}", , , , "2422250123" ], , , [ , , , , , , , , , [ -1 ] ] ],
            BT: [ , [ , , "[17]\\d{7}|[2-8]\\d{6}", , , , , , , [ 7, 8 ], [ 6 ] ], [ , , "(?:2[3-6]|[34][5-7]|5[236]|6[2-46]|7[246]|8[2-4])\\d{5}", , , , "2345678", , , [ 7 ], [ 6 ] ], [ , , "(?:1[67]|77)\\d{6}", , , , "17123456", , , [ 8 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "BT", 975, "00", , , , , , , , [ [ , "(\\d{3})(\\d{3})", "$1 $2", [ "[2-7]" ] ], [ , "(\\d)(\\d{3})(\\d{3})", "$1 $2 $3", [ "[2-68]|7[246]" ] ], [ , "(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", [ "1[67]|7" ] ] ], [ [ , "(\\d)(\\d{3})(\\d{3})", "$1 $2 $3", [ "[2-68]|7[246]" ] ], [ , "(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", [ "1[67]|7" ] ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            BW: [ , [ , , "(?:0800|(?:[37]|800)\\d)\\d{6}|(?:[2-6]\\d|90)\\d{5}", , , , , , , [ 7, 8, 10 ] ], [ , , "(?:2(?:4[0-48]|6[0-24]|9[0578])|3(?:1[0-35-9]|55|[69]\\d|7[013])|4(?:6[03]|7[1267]|9[0-5])|5(?:3[03489]|4[0489]|7[1-47]|88|9[0-49])|6(?:2[1-35]|5[149]|8[067]))\\d{4}", , , , "2401234", , , [ 7 ] ], [ , , "(?:321|7(?:[1-7]\\d|8[01]))\\d{5}", , , , "71123456", , , [ 8 ] ], [ , , "(?:0800|800\\d)\\d{6}", , , , "0800012345", , , [ 10 ] ], [ , , "90\\d{5}", , , , "9012345", , , [ 7 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , "79(?:1(?:[01]\\d|20)|2[0-25-7]\\d)\\d{3}", , , , "79101234", , , [ 8 ] ], "BW", 267, "00", , , , , , , , [ [ , "(\\d{2})(\\d{5})", "$1 $2", [ "90" ] ], [ , "(\\d{3})(\\d{4})", "$1 $2", [ "[24-6]|3[15-79]" ] ], [ , "(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", [ "[37]" ] ], [ , "(\\d{4})(\\d{3})(\\d{3})", "$1 $2 $3", [ "0" ] ], [ , "(\\d{3})(\\d{4})(\\d{3})", "$1 $2 $3", [ "8" ] ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            BY: [ , [ , , "(?:[12]\\d|33|44|902)\\d{7}|8(?:0[0-79]\\d{5,7}|[1-7]\\d{9})|8(?:1[0-489]|[5-79]\\d)\\d{7}|8[1-79]\\d{6,7}|8[0-79]\\d{5}|8\\d{5}", , , , , , , [ 6, 7, 8, 9, 10, 11 ], [ 5 ] ], [ , , "(?:1(?:5(?:1[1-5]|[24]\\d|6[2-4]|9[1-7])|6(?:[235]\\d|4[1-7])|7\\d\\d)|2(?:1(?:[246]\\d|3[0-35-9]|5[1-9])|2(?:[235]\\d|4[0-8])|3(?:[26]\\d|3[02-79]|4[024-7]|5[03-7])))\\d{5}", , , , "152450911", , , [ 9 ], [ 5, 6, 7 ] ], [ , , "(?:2(?:5[5-79]|9[1-9])|(?:33|44)\\d)\\d{6}", , , , "294911911", , , [ 9 ] ], [ , , "800\\d{3,7}|8(?:0[13]|20\\d)\\d{7}", , , , "8011234567" ], [ , , "(?:810|902)\\d{7}", , , , "9021234567", , , [ 10 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , "249\\d{6}", , , , "249123456", , , [ 9 ] ], "BY", 375, "810", "8", , , "0|80?", , "8~10", , [ [ , "(\\d{3})(\\d{3})", "$1 $2", [ "800" ], "8 $1" ], [ , "(\\d{3})(\\d{2})(\\d{2,4})", "$1 $2 $3", [ "800" ], "8 $1" ], [ , "(\\d{4})(\\d{2})(\\d{3})", "$1 $2-$3", [ "1(?:5[169]|6[3-5]|7[179])|2(?:1[35]|2[34]|3[3-5])", "1(?:5[169]|6(?:3[1-3]|4|5[125])|7(?:1[3-9]|7[0-24-6]|9[2-7]))|2(?:1[35]|2[34]|3[3-5])" ], "8 0$1" ], [ , "(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2-$3-$4", [ "1(?:[56]|7[467])|2[1-3]" ], "8 0$1" ], [ , "(\\d{2})(\\d{3})(\\d{2})(\\d{2})", "$1 $2-$3-$4", [ "[1-4]" ], "8 0$1" ], [ , "(\\d{3})(\\d{3,4})(\\d{4})", "$1 $2 $3", [ "[89]" ], "8 $1" ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , "800\\d{3,7}|(?:8(?:0[13]|10|20\\d)|902)\\d{7}" ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            BZ: [ , [ , , "(?:0800\\d|[2-8])\\d{6}", , , , , , , [ 7, 11 ] ], [ , , "(?:2(?:[02]\\d|36|[68]0)|[3-58](?:[02]\\d|[68]0)|7(?:[02]\\d|32|[68]0))\\d{4}", , , , "2221234", , , [ 7 ] ], [ , , "6[0-35-7]\\d{5}", , , , "6221234", , , [ 7 ] ], [ , , "0800\\d{7}", , , , "08001234123", , , [ 11 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "BZ", 501, "00", , , , , , , , [ [ , "(\\d{3})(\\d{4})", "$1-$2", [ "[2-8]" ] ], [ , "(\\d)(\\d{3})(\\d{4})(\\d{3})", "$1-$2-$3-$4", [ "0" ] ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            CA: [ , [ , , "(?:[2-8]\\d|90)\\d{8}", , , , , , , [ 10 ], [ 7 ] ], [ , , "(?:2(?:04|[23]6|[48]9|50)|3(?:06|43|6[578])|4(?:03|1[68]|3[178]|50|74)|5(?:06|1[49]|48|79|8[17])|6(?:04|13|39|47|72)|7(?:0[59]|78|8[02])|8(?:[06]7|19|25|73)|90[25])[2-9]\\d{6}", , , , "5062345678", , , , [ 7 ] ], [ , , "(?:2(?:04|[23]6|[48]9|50)|3(?:06|43|6[578])|4(?:03|1[68]|3[178]|50|74)|5(?:06|1[49]|48|79|8[17])|6(?:04|13|39|47|72)|7(?:0[59]|78|8[02])|8(?:[06]7|19|25|73)|90[25])[2-9]\\d{6}", , , , "5062345678", , , , [ 7 ] ], [ , , "8(?:00|33|44|55|66|77|88)[2-9]\\d{6}", , , , "8002123456" ], [ , , "900[2-9]\\d{6}", , , , "9002123456" ], [ , , , , , , , , , [ -1 ] ], [ , , "52(?:3(?:[2-46-9][02-9]\\d|5(?:[02-46-9]\\d|5[0-46-9]))|4(?:[2-478][02-9]\\d|5(?:[034]\\d|2[024-9]|5[0-46-9])|6(?:0[1-9]|[2-9]\\d)|9(?:[05-9]\\d|2[0-5]|49)))\\d{4}|52[34][2-9]1[02-9]\\d{4}|(?:5(?:00|2[12]|33|44|66|77|88)|622)[2-9]\\d{6}", , , , "5002345678" ], [ , , "600[2-9]\\d{6}", , , , "6002012345" ], "CA", 1, "011", "1", , , "1", , , 1, , , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            CC: [ , [ , , "1(?:[0-79]\\d{8}(?:\\d{2})?|8[0-24-9]\\d{7})|[148]\\d{8}|1\\d{5,7}", , , , , , , [ 6, 7, 8, 9, 10, 12 ] ], [ , , "8(?:51(?:0(?:02|31|60|89)|1(?:18|76)|223)|91(?:0(?:1[0-2]|29)|1(?:[28]2|50|79)|2(?:10|64)|3(?:[06]8|22)|4[29]8|62\\d|70[23]|959))\\d{3}", , , , "891621234", , , [ 9 ], [ 8 ] ], [ , , "4(?:83[0-38]|93[0-6])\\d{5}|4(?:[0-3]\\d|4[047-9]|5[0-25-9]|6[06-9]|7[02-9]|8[0-24-9]|9[0-27-9])\\d{6}", , , , "412345678", , , [ 9 ] ], [ , , "180(?:0\\d{3}|2)\\d{3}", , , , "1800123456", , , [ 7, 10 ] ], [ , , "190[0-26]\\d{6}", , , , "1900123456", , , [ 10 ] ], [ , , "13(?:00\\d{6}(?:\\d{2})?|45[0-4]\\d{3})|13\\d{4}", , , , "1300123456", , , [ 6, 8, 10, 12 ] ], [ , , , , , , , , , [ -1 ] ], [ , , "14(?:5(?:1[0458]|[23][458])|71\\d)\\d{4}", , , , "147101234", , , [ 9 ] ], "CC", 61, "001[14-689]|14(?:1[14]|34|4[17]|[56]6|7[47]|88)0011", "0", , , "0|([59]\\d{7})$", "8$1", "0011", , , , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            CD: [ , [ , , "[189]\\d{8}|[1-68]\\d{6}", , , , , , , [ 7, 9 ] ], [ , , "12\\d{7}|[1-6]\\d{6}", , , , "1234567" ], [ , , "88\\d{5}|(?:8[0-59]|9[017-9])\\d{7}", , , , "991234567" ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "CD", 243, "00", "0", , , "0", , , , [ [ , "(\\d{2})(\\d{2})(\\d{3})", "$1 $2 $3", [ "88" ], "0$1" ], [ , "(\\d{2})(\\d{5})", "$1 $2", [ "[1-6]" ], "0$1" ], [ , "(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", [ "1" ], "0$1" ], [ , "(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", [ "[89]" ], "0$1" ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            CF: [ , [ , , "(?:[27]\\d{3}|8776)\\d{4}", , , , , , , [ 8 ] ], [ , , "2[12]\\d{6}", , , , "21612345" ], [ , , "7[0257]\\d{6}", , , , "70012345" ], [ , , , , , , , , , [ -1 ] ], [ , , "8776\\d{4}", , , , "87761234" ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "CF", 236, "00", , , , , , , , [ [ , "(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", [ "[278]" ] ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            CG: [ , [ , , "222\\d{6}|(?:0\\d|80)\\d{7}", , , , , , , [ 9 ] ], [ , , "222[1-589]\\d{5}", , , , "222123456" ], [ , , "026(?:1[0-5]|6[6-9])\\d{4}|0(?:[14-6]\\d\\d|2(?:40|5[5-8]|6[07-9]))\\d{5}", , , , "061234567" ], [ , , , , , , , , , [ -1 ] ], [ , , "80(?:0\\d\\d|120)\\d{4}", , , , "800123456" ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "CG", 242, "00", , , , , , , , [ [ , "(\\d)(\\d{4})(\\d{4})", "$1 $2 $3", [ "8" ] ], [ , "(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", [ "[02]" ] ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            CH: [ , [ , , "8\\d{11}|[2-9]\\d{8}", , , , , , , [ 9, 12 ] ], [ , , "(?:2[12467]|3[1-4]|4[134]|5[256]|6[12]|[7-9]1)\\d{7}", , , , "212345678", , , [ 9 ] ], [ , , "7[35-9]\\d{7}", , , , "781234567", , , [ 9 ] ], [ , , "800\\d{6}", , , , "800123456", , , [ 9 ] ], [ , , "90[016]\\d{6}", , , , "900123456", , , [ 9 ] ], [ , , "84[0248]\\d{6}", , , , "840123456", , , [ 9 ] ], [ , , "878\\d{6}", , , , "878123456", , , [ 9 ] ], [ , , , , , , , , , [ -1 ] ], "CH", 41, "00", "0", , , "0", , , , [ [ , "(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", [ "8[047]|90" ], "0$1" ], [ , "(\\d{2})(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3 $4", [ "[2-79]|81" ], "0$1" ], [ , "(\\d{3})(\\d{2})(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3 $4 $5", [ "8" ], "0$1" ] ], , [ , , "74[0248]\\d{6}", , , , "740123456", , , [ 9 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , "5[18]\\d{7}", , , , "581234567", , , [ 9 ] ], , , [ , , "860\\d{9}", , , , "860123456789", , , [ 12 ] ] ],
            CI: [ , [ , , "[02]\\d{9}", , , , , , , [ 10 ] ], [ , , "2(?:[15]\\d{3}|7(?:2(?:0[23]|1[2357]|[23][45]|4[3-5])|3(?:06|1[69]|[2-6]7)))\\d{5}", , , , "2123456789" ], [ , , "0704[0-7]\\d{5}|0(?:[15]\\d\\d|7(?:0[0-37-9]|[4-9][7-9]))\\d{6}", , , , "0123456789" ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "CI", 225, "00", , , , , , , , [ [ , "(\\d{2})(\\d{2})(\\d)(\\d{5})", "$1 $2 $3 $4", [ "2" ] ], [ , "(\\d{2})(\\d{2})(\\d{2})(\\d{4})", "$1 $2 $3 $4", [ "0" ] ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            CK: [ , [ , , "[2-578]\\d{4}", , , , , , , [ 5 ] ], [ , , "(?:2\\d|3[13-7]|4[1-5])\\d{3}", , , , "21234" ], [ , , "[578]\\d{4}", , , , "71234" ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "CK", 682, "00", , , , , , , , [ [ , "(\\d{2})(\\d{3})", "$1 $2", [ "[2-578]" ] ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            CL: [ , [ , , "12300\\d{6}|6\\d{9,10}|[2-9]\\d{8}", , , , , , , [ 9, 10, 11 ] ], [ , , "2(?:1982[0-6]|3314[05-9])\\d{3}|(?:2(?:1(?:160|962)|3(?:2\\d\\d|3(?:[034]\\d|1[0-35-9]|2[1-9]|5[0-2])|600))|80[1-9]\\d\\d|9(?:3(?:[0-57-9]\\d\\d|6(?:0[02-9]|[1-9]\\d))|6(?:[0-8]\\d\\d|9(?:[02-79]\\d|1[05-9]))|7[1-9]\\d\\d|9(?:[03-9]\\d\\d|1(?:[0235-9]\\d|4[0-24-9])|2(?:[0-79]\\d|8[0-46-9]))))\\d{4}|(?:22|3[2-5]|[47][1-35]|5[1-3578]|6[13-57]|8[1-9]|9[2458])\\d{7}", , , , "221234567", , , [ 9 ] ], [ , , "2(?:1982[0-6]|3314[05-9])\\d{3}|(?:2(?:1(?:160|962)|3(?:2\\d\\d|3(?:[034]\\d|1[0-35-9]|2[1-9]|5[0-2])|600))|80[1-9]\\d\\d|9(?:3(?:[0-57-9]\\d\\d|6(?:0[02-9]|[1-9]\\d))|6(?:[0-8]\\d\\d|9(?:[02-79]\\d|1[05-9]))|7[1-9]\\d\\d|9(?:[03-9]\\d\\d|1(?:[0235-9]\\d|4[0-24-9])|2(?:[0-79]\\d|8[0-46-9]))))\\d{4}|(?:22|3[2-5]|[47][1-35]|5[1-3578]|6[13-57]|8[1-9]|9[2458])\\d{7}", , , , "221234567", , , [ 9 ] ], [ , , "(?:123|8)00\\d{6}", , , , "800123456", , , [ 9, 11 ] ], [ , , , , , , , , , [ -1 ] ], [ , , "600\\d{7,8}", , , , "6001234567", , , [ 10, 11 ] ], [ , , , , , , , , , [ -1 ] ], [ , , "44\\d{7}", , , , "441234567", , , [ 9 ] ], "CL", 56, "(?:0|1(?:1[0-69]|2[02-5]|5[13-58]|69|7[0167]|8[018]))0", , , , , , , 1, [ [ , "(\\d{4})", "$1", [ "1(?:[03-589]|21)|[29]0|78" ] ], [ , "(\\d{5})(\\d{4})", "$1 $2", [ "219", "2196" ], "($1)" ], [ , "(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", [ "44" ] ], [ , "(\\d)(\\d{4})(\\d{4})", "$1 $2 $3", [ "2[1-3]" ], "($1)" ], [ , "(\\d)(\\d{4})(\\d{4})", "$1 $2 $3", [ "9[2-9]" ] ], [ , "(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", [ "3[2-5]|[47]|5[1-3578]|6[13-57]|8(?:0[1-9]|[1-9])" ], "($1)" ], [ , "(\\d{3})(\\d{3})(\\d{3,4})", "$1 $2 $3", [ "60|8" ] ], [ , "(\\d{4})(\\d{3})(\\d{4})", "$1 $2 $3", [ "1" ] ], [ , "(\\d{3})(\\d{3})(\\d{2})(\\d{3})", "$1 $2 $3 $4", [ "60" ] ] ], [ [ , "(\\d{5})(\\d{4})", "$1 $2", [ "219", "2196" ], "($1)" ], [ , "(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", [ "44" ] ], [ , "(\\d)(\\d{4})(\\d{4})", "$1 $2 $3", [ "2[1-3]" ], "($1)" ], [ , "(\\d)(\\d{4})(\\d{4})", "$1 $2 $3", [ "9[2-9]" ] ], [ , "(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", [ "3[2-5]|[47]|5[1-3578]|6[13-57]|8(?:0[1-9]|[1-9])" ], "($1)" ], [ , "(\\d{3})(\\d{3})(\\d{3,4})", "$1 $2 $3", [ "60|8" ] ], [ , "(\\d{4})(\\d{3})(\\d{4})", "$1 $2 $3", [ "1" ] ], [ , "(\\d{3})(\\d{3})(\\d{2})(\\d{3})", "$1 $2 $3 $4", [ "60" ] ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , "600\\d{7,8}", , , , , , , [ 10, 11 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            CM: [ , [ , , "[26]\\d{8}|88\\d{6,7}", , , , , , , [ 8, 9 ] ], [ , , "2(?:22|33)\\d{6}", , , , "222123456", , , [ 9 ] ], [ , , "(?:24[23]|6[5-9]\\d)\\d{6}", , , , "671234567", , , [ 9 ] ], [ , , "88\\d{6,7}", , , , "88012345" ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "CM", 237, "00", , , , , , , , [ [ , "(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", [ "88" ] ], [ , "(\\d)(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4 $5", [ "[26]|88" ] ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            CN: [ , [ , , "1[127]\\d{8,9}|2\\d{9}(?:\\d{2})?|[12]\\d{6,7}|86\\d{6}|(?:1[03-689]\\d|6)\\d{7,9}|(?:[3-579]\\d|8[0-57-9])\\d{6,9}", , , , , , , [ 7, 8, 9, 10, 11, 12 ], [ 5, 6 ] ], [ , , "(?:10(?:[02-79]\\d\\d|[18](?:0[1-9]|[1-9]\\d))|21(?:[18](?:0[1-9]|[1-9]\\d)|[2-79]\\d\\d))\\d{5}|(?:43[35]|754)\\d{7,8}|8(?:078\\d{7}|51\\d{7,8})|(?:10|(?:2|85)1|43[35]|754)(?:100\\d\\d|95\\d{3,4})|(?:2[02-57-9]|3(?:11|7[179])|4(?:[15]1|3[12])|5(?:1\\d|2[37]|3[12]|51|7[13-79]|9[15])|7(?:[39]1|5[57]|6[09])|8(?:71|98))(?:[02-8]\\d{7}|1(?:0(?:0\\d\\d(?:\\d{3})?|[1-9]\\d{5})|[1-9]\\d{6})|9(?:[0-46-9]\\d{6}|5\\d{3}(?:\\d(?:\\d{2})?)?))|(?:3(?:1[02-9]|35|49|5\\d|7[02-68]|9[1-68])|4(?:1[02-9]|2[179]|3[46-9]|5[2-9]|6[47-9]|7\\d|8[23])|5(?:3[03-9]|4[36]|5[02-9]|6[1-46]|7[028]|80|9[2-46-9])|6(?:3[1-5]|6[0238]|9[12])|7(?:01|[17]\\d|2[248]|3[04-9]|4[3-6]|5[0-3689]|6[2368]|9[02-9])|8(?:1[236-8]|2[5-7]|3\\d|5[2-9]|7[02-9]|8[36-8]|9[1-7])|9(?:0[1-3689]|1[1-79]|[379]\\d|4[13]|5[1-5]))(?:[02-8]\\d{6}|1(?:0(?:0\\d\\d(?:\\d{2})?|[1-9]\\d{4})|[1-9]\\d{5})|9(?:[0-46-9]\\d{5}|5\\d{3,5}))", , , , "1012345678", , , [ 7, 8, 9, 10, 11 ], [ 5, 6 ] ], [ , , "1740[0-5]\\d{6}|1(?:[38]\\d|4[57]|5[0-35-9]|6[25-7]|7[0-35-8]|9[0135-9])\\d{8}", , , , "13123456789", , , [ 11 ] ], [ , , "(?:(?:10|21)8|8)00\\d{7}", , , , "8001234567", , , [ 10, 12 ] ], [ , , "16[08]\\d{5}", , , , "16812345", , , [ 8 ] ], [ , , "400\\d{7}|950\\d{7,8}|(?:10|2[0-57-9]|3(?:[157]\\d|35|49|9[1-68])|4(?:[17]\\d|2[179]|[35][1-9]|6[47-9]|8[23])|5(?:[1357]\\d|2[37]|4[36]|6[1-46]|80|9[1-9])|6(?:3[1-5]|6[0238]|9[12])|7(?:01|[1579]\\d|2[248]|3[014-9]|4[3-6]|6[023689])|8(?:1[236-8]|2[5-7]|[37]\\d|5[14-9]|8[36-8]|9[1-8])|9(?:0[1-3689]|1[1-79]|[379]\\d|4[13]|5[1-5]))96\\d{3,4}", , , , "4001234567", , , [ 7, 8, 9, 10, 11 ], [ 5, 6 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "CN", 86, "00|1(?:[12]\\d|79)\\d\\d00", "0", , , "0|(1(?:[12]\\d|79)\\d\\d)", , "00", , [ [ , "(\\d{5,6})", "$1", [ "96" ] ], [ , "(\\d{2})(\\d{5,6})", "$1 $2", [ "(?:10|2[0-57-9])[19]", "(?:10|2[0-57-9])(?:10|9[56])", "(?:10|2[0-57-9])(?:100|9[56])" ], "0$1", "$CC $1" ], [ , "(\\d{3})(\\d{4})", "$1 $2", [ "[1-9]", "1[1-9]|26|[3-9]|(?:10|2[0-57-9])(?:[0-8]|9[0-47-9])", "1[1-9]|26|[3-9]|(?:10|2[0-57-9])(?:[02-8]|1(?:0[1-9]|[1-9])|9[0-47-9])" ] ], [ , "(\\d{4})(\\d{4})", "$1 $2", [ "16[08]" ] ], [ , "(\\d{3})(\\d{5,6})", "$1 $2", [ "3(?:[157]|35|49|9[1-68])|4(?:[17]|2[179]|6[47-9]|8[23])|5(?:[1357]|2[37]|4[36]|6[1-46]|80)|6(?:3[1-5]|6[0238]|9[12])|7(?:01|[1579]|2[248]|3[014-9]|4[3-6]|6[023689])|8(?:1[236-8]|2[5-7]|[37]|8[36-8]|9[1-8])|9(?:0[1-3689]|1[1-79]|[379]|4[13]|5[1-5])|(?:4[35]|59|85)[1-9]", "(?:3(?:[157]\\d|35|49|9[1-68])|4(?:[17]\\d|2[179]|[35][1-9]|6[47-9]|8[23])|5(?:[1357]\\d|2[37]|4[36]|6[1-46]|80|9[1-9])|6(?:3[1-5]|6[0238]|9[12])|7(?:01|[1579]\\d|2[248]|3[014-9]|4[3-6]|6[023689])|8(?:1[236-8]|2[5-7]|[37]\\d|5[1-9]|8[36-8]|9[1-8])|9(?:0[1-3689]|1[1-79]|[379]\\d|4[13]|5[1-5]))[19]", "85[23](?:10|95)|(?:3(?:[157]\\d|35|49|9[1-68])|4(?:[17]\\d|2[179]|[35][1-9]|6[47-9]|8[23])|5(?:[1357]\\d|2[37]|4[36]|6[1-46]|80|9[1-9])|6(?:3[1-5]|6[0238]|9[12])|7(?:01|[1579]\\d|2[248]|3[014-9]|4[3-6]|6[023689])|8(?:1[236-8]|2[5-7]|[37]\\d|5[14-9]|8[36-8]|9[1-8])|9(?:0[1-3689]|1[1-79]|[379]\\d|4[13]|5[1-5]))(?:10|9[56])", "85[23](?:100|95)|(?:3(?:[157]\\d|35|49|9[1-68])|4(?:[17]\\d|2[179]|[35][1-9]|6[47-9]|8[23])|5(?:[1357]\\d|2[37]|4[36]|6[1-46]|80|9[1-9])|6(?:3[1-5]|6[0238]|9[12])|7(?:01|[1579]\\d|2[248]|3[014-9]|4[3-6]|6[023689])|8(?:1[236-8]|2[5-7]|[37]\\d|5[14-9]|8[36-8]|9[1-8])|9(?:0[1-3689]|1[1-79]|[379]\\d|4[13]|5[1-5]))(?:100|9[56])" ], "0$1", "$CC $1" ], [ , "(\\d{4})(\\d{4})", "$1 $2", [ "[1-9]", "1[1-9]|26|[3-9]|(?:10|2[0-57-9])(?:[0-8]|9[0-47-9])", "26|3(?:[0268]|9[079])|4(?:[049]|2[02-68]|[35]0|6[0-356]|8[014-9])|5(?:0|2[0-24-689]|4[0-2457-9]|6[057-9]|90)|6(?:[0-24578]|6[14-79]|9[03-9])|7(?:0[02-9]|2[0135-79]|3[23]|4[0-27-9]|6[1457]|8)|8(?:[046]|1[01459]|2[0-489]|50|8[0-2459]|9[09])|9(?:0[0457]|1[08]|[268]|4[024-9])|(?:34|85[23])[0-8]|(?:1|58)[1-9]|(?:63|95)[06-9]|(?:33|85[23]9)[0-46-9]|(?:10|2[0-57-9]|3(?:[157]\\d|35|49|9[1-68])|4(?:[17]\\d|2[179]|[35][1-9]|6[47-9]|8[23])|5(?:[1357]\\d|2[37]|4[36]|6[1-46]|80|9[1-9])|6(?:3[1-5]|6[0238]|9[12])|7(?:01|[1579]\\d|2[248]|3[014-9]|4[3-6]|6[023689])|8(?:1[236-8]|2[5-7]|[37]\\d|5[14-9]|8[36-8]|9[1-8])|9(?:0[1-3689]|1[1-79]|[379]\\d|4[13]|5[1-5]))(?:[0-8]|9[0-47-9])", "26|3(?:[0268]|3[0-46-9]|4[0-8]|9[079])|4(?:[049]|2[02-68]|[35]0|6[0-356]|8[014-9])|5(?:0|2[0-24-689]|4[0-2457-9]|6[057-9]|90)|6(?:[0-24578]|3[06-9]|6[14-79]|9[03-9])|7(?:0[02-9]|2[0135-79]|3[23]|4[0-27-9]|6[1457]|8)|8(?:[046]|1[01459]|2[0-489]|5(?:0|[23](?:[02-8]|1[1-9]|9[0-46-9]))|8[0-2459]|9[09])|9(?:0[0457]|1[08]|[268]|4[024-9]|5[06-9])|(?:1|58|85[23]10)[1-9]|(?:10|2[0-57-9])(?:[0-8]|9[0-47-9])|(?:3(?:[157]\\d|35|49|9[1-68])|4(?:[17]\\d|2[179]|[35][1-9]|6[47-9]|8[23])|5(?:[1357]\\d|2[37]|4[36]|6[1-46]|80|9[1-9])|6(?:3[1-5]|6[0238]|9[12])|7(?:01|[1579]\\d|2[248]|3[014-9]|4[3-6]|6[023689])|8(?:1[236-8]|2[5-7]|[37]\\d|5[14-9]|8[36-8]|9[1-8])|9(?:0[1-3689]|1[1-79]|[379]\\d|4[13]|5[1-5]))(?:[02-8]|1(?:0[1-9]|[1-9])|9[0-47-9])" ] ], [ , "(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", [ "(?:4|80)0" ] ], [ , "(\\d{2})(\\d{4})(\\d{4})", "$1 $2 $3", [ "10|2(?:[02-57-9]|1[1-9])", "10|2(?:[02-57-9]|1[1-9])", "10[0-79]|2(?:[02-57-9]|1[1-79])|(?:10|21)8(?:0[1-9]|[1-9])" ], "0$1", "$CC $1", 1 ], [ , "(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", [ "3(?:[3-59]|7[02-68])|4(?:[26-8]|3[3-9]|5[2-9])|5(?:3[03-9]|[468]|7[028]|9[2-46-9])|6|7(?:[0-247]|3[04-9]|5[0-4689]|6[2368])|8(?:[1-358]|9[1-7])|9(?:[013479]|5[1-5])|(?:[34]1|55|79|87)[02-9]" ], "0$1", "$CC $1", 1 ], [ , "(\\d{3})(\\d{7,8})", "$1 $2", [ "9" ] ], [ , "(\\d{4})(\\d{3})(\\d{4})", "$1 $2 $3", [ "80" ], "0$1", "$CC $1", 1 ], [ , "(\\d{3})(\\d{4})(\\d{4})", "$1 $2 $3", [ "[3-578]" ], "0$1", "$CC $1", 1 ], [ , "(\\d{3})(\\d{4})(\\d{4})", "$1 $2 $3", [ "1[3-9]" ], , "$CC $1" ], [ , "(\\d{2})(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3 $4", [ "[12]" ], "0$1", , 1 ] ], [ [ , "(\\d{2})(\\d{5,6})", "$1 $2", [ "(?:10|2[0-57-9])[19]", "(?:10|2[0-57-9])(?:10|9[56])", "(?:10|2[0-57-9])(?:100|9[56])" ], "0$1", "$CC $1" ], [ , "(\\d{3})(\\d{5,6})", "$1 $2", [ "3(?:[157]|35|49|9[1-68])|4(?:[17]|2[179]|6[47-9]|8[23])|5(?:[1357]|2[37]|4[36]|6[1-46]|80)|6(?:3[1-5]|6[0238]|9[12])|7(?:01|[1579]|2[248]|3[014-9]|4[3-6]|6[023689])|8(?:1[236-8]|2[5-7]|[37]|8[36-8]|9[1-8])|9(?:0[1-3689]|1[1-79]|[379]|4[13]|5[1-5])|(?:4[35]|59|85)[1-9]", "(?:3(?:[157]\\d|35|49|9[1-68])|4(?:[17]\\d|2[179]|[35][1-9]|6[47-9]|8[23])|5(?:[1357]\\d|2[37]|4[36]|6[1-46]|80|9[1-9])|6(?:3[1-5]|6[0238]|9[12])|7(?:01|[1579]\\d|2[248]|3[014-9]|4[3-6]|6[023689])|8(?:1[236-8]|2[5-7]|[37]\\d|5[1-9]|8[36-8]|9[1-8])|9(?:0[1-3689]|1[1-79]|[379]\\d|4[13]|5[1-5]))[19]", "85[23](?:10|95)|(?:3(?:[157]\\d|35|49|9[1-68])|4(?:[17]\\d|2[179]|[35][1-9]|6[47-9]|8[23])|5(?:[1357]\\d|2[37]|4[36]|6[1-46]|80|9[1-9])|6(?:3[1-5]|6[0238]|9[12])|7(?:01|[1579]\\d|2[248]|3[014-9]|4[3-6]|6[023689])|8(?:1[236-8]|2[5-7]|[37]\\d|5[14-9]|8[36-8]|9[1-8])|9(?:0[1-3689]|1[1-79]|[379]\\d|4[13]|5[1-5]))(?:10|9[56])", "85[23](?:100|95)|(?:3(?:[157]\\d|35|49|9[1-68])|4(?:[17]\\d|2[179]|[35][1-9]|6[47-9]|8[23])|5(?:[1357]\\d|2[37]|4[36]|6[1-46]|80|9[1-9])|6(?:3[1-5]|6[0238]|9[12])|7(?:01|[1579]\\d|2[248]|3[014-9]|4[3-6]|6[023689])|8(?:1[236-8]|2[5-7]|[37]\\d|5[14-9]|8[36-8]|9[1-8])|9(?:0[1-3689]|1[1-79]|[379]\\d|4[13]|5[1-5]))(?:100|9[56])" ], "0$1", "$CC $1" ], [ , "(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", [ "(?:4|80)0" ] ], [ , "(\\d{2})(\\d{4})(\\d{4})", "$1 $2 $3", [ "10|2(?:[02-57-9]|1[1-9])", "10|2(?:[02-57-9]|1[1-9])", "10[0-79]|2(?:[02-57-9]|1[1-79])|(?:10|21)8(?:0[1-9]|[1-9])" ], "0$1", "$CC $1", 1 ], [ , "(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", [ "3(?:[3-59]|7[02-68])|4(?:[26-8]|3[3-9]|5[2-9])|5(?:3[03-9]|[468]|7[028]|9[2-46-9])|6|7(?:[0-247]|3[04-9]|5[0-4689]|6[2368])|8(?:[1-358]|9[1-7])|9(?:[013479]|5[1-5])|(?:[34]1|55|79|87)[02-9]" ], "0$1", "$CC $1", 1 ], [ , "(\\d{3})(\\d{7,8})", "$1 $2", [ "9" ] ], [ , "(\\d{4})(\\d{3})(\\d{4})", "$1 $2 $3", [ "80" ], "0$1", "$CC $1", 1 ], [ , "(\\d{3})(\\d{4})(\\d{4})", "$1 $2 $3", [ "[3-578]" ], "0$1", "$CC $1", 1 ], [ , "(\\d{3})(\\d{4})(\\d{4})", "$1 $2 $3", [ "1[3-9]" ], , "$CC $1" ], [ , "(\\d{2})(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3 $4", [ "[12]" ], "0$1", , 1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , "(?:(?:10|21)8|[48])00\\d{7}|950\\d{7,8}", , , , , , , [ 10, 11, 12 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            CO: [ , [ , , "(?:(?:1\\d|[36])\\d{3}|9101)\\d{6}|[124-8]\\d{7}", , , , , , , [ 8, 10, 11 ], [ 7 ] ], [ , , "60[124-8][2-9]\\d{6}|[124-8][2-9]\\d{6}", , , , "12345678", , , [ 8, 10 ], [ 7 ] ], [ , , "3333(?:0(?:0\\d|1[0-5])|[4-9]\\d\\d)\\d{3}|(?:3(?:24[2-6]|3(?:00|3[0-24-9]))|9101)\\d{6}|3(?:0[0-5]|1\\d|2[0-3]|5[01]|70)\\d{7}", , , , "3211234567", , , [ 10 ] ], [ , , "1800\\d{7}", , , , "18001234567", , , [ 11 ] ], [ , , "19(?:0[01]|4[78])\\d{7}", , , , "19001234567", , , [ 11 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "CO", 57, "00(?:4(?:[14]4|56)|[579])", "0", , , "0([3579]|4(?:[14]4|56))?", , , , [ [ , "(\\d)(\\d{7})", "$1 $2", [ "[146][2-9]|[2578]" ], "($1)", "0$CC $1" ], [ , "(\\d{3})(\\d{7})", "$1 $2", [ "6" ], "($1)" ], [ , "(\\d{3})(\\d{7})", "$1 $2", [ "[39]" ], , "0$CC $1" ], [ , "(\\d)(\\d{3})(\\d{7})", "$1-$2-$3", [ "1" ], "0$1" ] ], [ [ , "(\\d)(\\d{7})", "$1 $2", [ "[146][2-9]|[2578]" ], "($1)", "0$CC $1" ], [ , "(\\d{3})(\\d{7})", "$1 $2", [ "6" ], "($1)" ], [ , "(\\d{3})(\\d{7})", "$1 $2", [ "[39]" ], , "0$CC $1" ], [ , "(\\d)(\\d{3})(\\d{7})", "$1 $2 $3", [ "1" ] ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            CR: [ , [ , , "(?:8\\d|90)\\d{8}|(?:[24-8]\\d{3}|3005)\\d{4}", , , , , , , [ 8, 10 ] ], [ , , "210[7-9]\\d{4}|2(?:[024-7]\\d|1[1-9])\\d{5}", , , , "22123456", , , [ 8 ] ], [ , , "(?:3005\\d|6500[01])\\d{3}|(?:5[07]|6[0-4]|7[0-3]|8[3-9])\\d{6}", , , , "83123456", , , [ 8 ] ], [ , , "800\\d{7}", , , , "8001234567", , , [ 10 ] ], [ , , "90[059]\\d{7}", , , , "9001234567", , , [ 10 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , "(?:210[0-6]|4\\d{3}|5100)\\d{4}", , , , "40001234", , , [ 8 ] ], "CR", 506, "00", , , , "(19(?:0[0-2468]|1[09]|20|66|77|99))", , , , [ [ , "(\\d{4})(\\d{4})", "$1 $2", [ "[2-7]|8[3-9]" ], , "$CC $1" ], [ , "(\\d{3})(\\d{3})(\\d{4})", "$1-$2-$3", [ "[89]" ], , "$CC $1" ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            CU: [ , [ , , "[27]\\d{6,7}|[34]\\d{5,7}|(?:5|8\\d\\d)\\d{7}", , , , , , , [ 6, 7, 8, 10 ], [ 4, 5 ] ], [ , , "(?:3[23]|48)\\d{4,6}|(?:31|4[36]|8(?:0[25]|78)\\d)\\d{6}|(?:2[1-4]|4[1257]|7\\d)\\d{5,6}", , , , "71234567", , , , [ 4, 5 ] ], [ , , "5\\d{7}", , , , "51234567", , , [ 8 ] ], [ , , "800\\d{7}", , , , "8001234567", , , [ 10 ] ], [ , , , , , , , , , [ -1 ] ], [ , , "807\\d{7}", , , , "8071234567", , , [ 10 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "CU", 53, "119", "0", , , "0", , , , [ [ , "(\\d{2})(\\d{4,6})", "$1 $2", [ "2[1-4]|[34]" ], "(0$1)" ], [ , "(\\d)(\\d{6,7})", "$1 $2", [ "7" ], "(0$1)" ], [ , "(\\d)(\\d{7})", "$1 $2", [ "5" ], "0$1" ], [ , "(\\d{3})(\\d{7})", "$1 $2", [ "8" ], "0$1" ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            CV: [ , [ , , "(?:[2-59]\\d\\d|800)\\d{4}", , , , , , , [ 7 ] ], [ , , "2(?:2[1-7]|3[0-8]|4[12]|5[1256]|6\\d|7[1-3]|8[1-5])\\d{4}", , , , "2211234" ], [ , , "(?:[34][36]|5[1-389]|9\\d)\\d{5}", , , , "9911234" ], [ , , "800\\d{4}", , , , "8001234" ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "CV", 238, "0", , , , , , , , [ [ , "(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3", [ "[2-589]" ] ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            CW: [ , [ , , "(?:[34]1|60|(?:7|9\\d)\\d)\\d{5}", , , , , , , [ 7, 8 ] ], [ , , "9(?:4(?:3[0-5]|4[14]|6\\d)|50\\d|7(?:2[014]|3[02-9]|4[4-9]|6[357]|77|8[7-9])|8(?:3[39]|[46]\\d|7[01]|8[57-9]))\\d{4}", , , , "94351234" ], [ , , "953[01]\\d{4}|9(?:5[12467]|6[5-9])\\d{5}", , , , "95181234" ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , "60[0-2]\\d{4}", , , , "6001234", , , [ 7 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "CW", 599, "00", , , , , , , , [ [ , "(\\d{3})(\\d{4})", "$1 $2", [ "[3467]" ] ], [ , "(\\d)(\\d{3})(\\d{4})", "$1 $2 $3", [ "9[4-8]" ] ] ], , [ , , "955\\d{5}", , , , "95581234", , , [ 8 ] ], 1, "[69]", [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            CX: [ , [ , , "1(?:[0-79]\\d{8}(?:\\d{2})?|8[0-24-9]\\d{7})|[148]\\d{8}|1\\d{5,7}", , , , , , , [ 6, 7, 8, 9, 10, 12 ] ], [ , , "8(?:51(?:0(?:01|30|59|88)|1(?:17|46|75)|2(?:22|35))|91(?:00[6-9]|1(?:[28]1|49|78)|2(?:09|63)|3(?:12|26|75)|4(?:56|97)|64\\d|7(?:0[01]|1[0-2])|958))\\d{3}", , , , "891641234", , , [ 9 ], [ 8 ] ], [ , , "4(?:83[0-38]|93[0-6])\\d{5}|4(?:[0-3]\\d|4[047-9]|5[0-25-9]|6[06-9]|7[02-9]|8[0-24-9]|9[0-27-9])\\d{6}", , , , "412345678", , , [ 9 ] ], [ , , "180(?:0\\d{3}|2)\\d{3}", , , , "1800123456", , , [ 7, 10 ] ], [ , , "190[0-26]\\d{6}", , , , "1900123456", , , [ 10 ] ], [ , , "13(?:00\\d{6}(?:\\d{2})?|45[0-4]\\d{3})|13\\d{4}", , , , "1300123456", , , [ 6, 8, 10, 12 ] ], [ , , , , , , , , , [ -1 ] ], [ , , "14(?:5(?:1[0458]|[23][458])|71\\d)\\d{4}", , , , "147101234", , , [ 9 ] ], "CX", 61, "001[14-689]|14(?:1[14]|34|4[17]|[56]6|7[47]|88)0011", "0", , , "0|([59]\\d{7})$", "8$1", "0011", , , , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            CY: [ , [ , , "(?:[279]\\d|[58]0)\\d{6}", , , , , , , [ 8 ] ], [ , , "2[2-6]\\d{6}", , , , "22345678" ], [ , , "9[4-79]\\d{6}", , , , "96123456" ], [ , , "800\\d{5}", , , , "80001234" ], [ , , "90[09]\\d{5}", , , , "90012345" ], [ , , "80[1-9]\\d{5}", , , , "80112345" ], [ , , "700\\d{5}", , , , "70012345" ], [ , , , , , , , , , [ -1 ] ], "CY", 357, "00", , , , , , , , [ [ , "(\\d{2})(\\d{6})", "$1 $2", [ "[257-9]" ] ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , "(?:50|77)\\d{6}", , , , "77123456" ], , , [ , , , , , , , , , [ -1 ] ] ],
            CZ: [ , [ , , "(?:[2-578]\\d|60)\\d{7}|9\\d{8,11}", , , , , , , [ 9, 10, 11, 12 ] ], [ , , "(?:2\\d|3[1257-9]|4[16-9]|5[13-9])\\d{7}", , , , "212345678", , , [ 9 ] ], [ , , "(?:60[1-8]|7(?:0[2-5]|[2379]\\d))\\d{6}", , , , "601123456", , , [ 9 ] ], [ , , "800\\d{6}", , , , "800123456", , , [ 9 ] ], [ , , "9(?:0[05689]|76)\\d{6}", , , , "900123456", , , [ 9 ] ], [ , , "8[134]\\d{7}", , , , "811234567", , , [ 9 ] ], [ , , "70[01]\\d{6}", , , , "700123456", , , [ 9 ] ], [ , , "9[17]0\\d{6}", , , , "910123456", , , [ 9 ] ], "CZ", 420, "00", , , , , , , , [ [ , "(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", [ "[2-8]|9[015-7]" ] ], [ , "(\\d{2})(\\d{3})(\\d{3})(\\d{2})", "$1 $2 $3 $4", [ "96" ] ], [ , "(\\d{2})(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3 $4", [ "9" ] ], [ , "(\\d{3})(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3 $4", [ "9" ] ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , "9(?:5\\d|7[2-4])\\d{6}", , , , "972123456", , , [ 9 ] ], , , [ , , "9(?:3\\d{9}|6\\d{7,10})", , , , "93123456789" ] ],
            DE: [ , [ , , "[2579]\\d{5,14}|49(?:[34]0|69|8\\d)\\d\\d?|49(?:37|49|60|7[089]|9\\d)\\d{1,3}|49(?:1\\d|2[02-9]|3[2-689]|7[1-7])\\d{1,8}|(?:1|[368]\\d|4[0-8])\\d{3,13}|49(?:[05]\\d|[23]1|[46][1-8])\\d{1,9}", , , , , , , [ 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15 ], [ 2, 3 ] ], [ , , "32\\d{9,11}|49[2-6]\\d{10}|49[0-7]\\d{3,9}|(?:[34]0|[68]9)\\d{3,13}|(?:2(?:0[1-689]|[1-3569]\\d|4[0-8]|7[1-7]|8[0-7])|3(?:[3569]\\d|4[0-79]|7[1-7]|8[1-8])|4(?:1[02-9]|[2-48]\\d|5[0-6]|6[0-8]|7[0-79])|5(?:0[2-8]|[124-6]\\d|[38][0-8]|[79][0-7])|6(?:0[02-9]|[1-358]\\d|[47][0-8]|6[1-9])|7(?:0[2-8]|1[1-9]|[27][0-7]|3\\d|[4-6][0-8]|8[0-5]|9[013-7])|8(?:0[2-9]|1[0-79]|2\\d|3[0-46-9]|4[0-6]|5[013-9]|6[1-8]|7[0-8]|8[0-24-6])|9(?:0[6-9]|[1-4]\\d|[589][0-7]|6[0-8]|7[0-467]))\\d{3,12}", , , , "30123456", , , [ 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15 ], [ 2, 3, 4 ] ], [ , , "15[0-25-9]\\d{8}|1(?:6[023]|7\\d)\\d{7,8}", , , , "15123456789", , , [ 10, 11 ] ], [ , , "800\\d{7,12}", , , , "8001234567890", , , [ 10, 11, 12, 13, 14, 15 ] ], [ , , "(?:137[7-9]|900(?:[135]|9\\d))\\d{6}", , , , "9001234567", , , [ 10, 11 ] ], [ , , "180\\d{5,11}|13(?:7[1-6]\\d\\d|8)\\d{4}", , , , "18012345", , , [ 7, 8, 9, 10, 11, 12, 13, 14 ] ], [ , , "700\\d{8}", , , , "70012345678", , , [ 11 ] ], [ , , , , , , , , , [ -1 ] ], "DE", 49, "00", "0", , , "0", , , , [ [ , "(\\d{2})(\\d{3,13})", "$1 $2", [ "3[02]|40|[68]9" ], "0$1" ], [ , "(\\d{3})(\\d{3,12})", "$1 $2", [ "2(?:0[1-389]|1[124]|2[18]|3[14])|3(?:[35-9][15]|4[015])|906|(?:2[4-9]|4[2-9]|[579][1-9]|[68][1-8])1", "2(?:0[1-389]|12[0-8])|3(?:[35-9][15]|4[015])|906|2(?:[13][14]|2[18])|(?:2[4-9]|4[2-9]|[579][1-9]|[68][1-8])1" ], "0$1" ], [ , "(\\d{4})(\\d{2,11})", "$1 $2", [ "[24-6]|3(?:[3569][02-46-9]|4[2-4679]|7[2-467]|8[2-46-8])|70[2-8]|8(?:0[2-9]|[1-8])|90[7-9]|[79][1-9]", "[24-6]|3(?:3(?:0[1-467]|2[127-9]|3[124578]|7[1257-9]|8[1256]|9[145])|4(?:2[135]|4[13578]|9[1346])|5(?:0[14]|2[1-3589]|6[1-4]|7[13468]|8[13568])|6(?:2[1-489]|3[124-6]|6[13]|7[12579]|8[1-356]|9[135])|7(?:2[1-7]|4[145]|6[1-5]|7[1-4])|8(?:21|3[1468]|6|7[1467]|8[136])|9(?:0[12479]|2[1358]|4[134679]|6[1-9]|7[136]|8[147]|9[1468]))|70[2-8]|8(?:0[2-9]|[1-8])|90[7-9]|[79][1-9]|3[68]4[1347]|3(?:47|60)[1356]|3(?:3[46]|46|5[49])[1246]|3[4579]3[1357]" ], "0$1" ], [ , "(\\d{3})(\\d{4})", "$1 $2", [ "138" ], "0$1" ], [ , "(\\d{5})(\\d{2,10})", "$1 $2", [ "3" ], "0$1" ], [ , "(\\d{3})(\\d{5,11})", "$1 $2", [ "181" ], "0$1" ], [ , "(\\d{3})(\\d)(\\d{4,10})", "$1 $2 $3", [ "1(?:3|80)|9" ], "0$1" ], [ , "(\\d{3})(\\d{7,8})", "$1 $2", [ "1[67]" ], "0$1" ], [ , "(\\d{3})(\\d{7,12})", "$1 $2", [ "8" ], "0$1" ], [ , "(\\d{5})(\\d{6})", "$1 $2", [ "185", "1850", "18500" ], "0$1" ], [ , "(\\d{3})(\\d{4})(\\d{4})", "$1 $2 $3", [ "7" ], "0$1" ], [ , "(\\d{4})(\\d{7})", "$1 $2", [ "18[68]" ], "0$1" ], [ , "(\\d{5})(\\d{6})", "$1 $2", [ "15[0568]" ], "0$1" ], [ , "(\\d{4})(\\d{7})", "$1 $2", [ "15[1279]" ], "0$1" ], [ , "(\\d{3})(\\d{8})", "$1 $2", [ "18" ], "0$1" ], [ , "(\\d{3})(\\d{2})(\\d{7,8})", "$1 $2 $3", [ "1(?:6[023]|7)" ], "0$1" ], [ , "(\\d{4})(\\d{2})(\\d{7})", "$1 $2 $3", [ "15[279]" ], "0$1" ], [ , "(\\d{3})(\\d{2})(\\d{8})", "$1 $2 $3", [ "15" ], "0$1" ] ], , [ , , "16(?:4\\d{1,10}|[89]\\d{1,11})", , , , "16412345", , , [ 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , "18(?:1\\d{5,11}|[2-9]\\d{8})", , , , "18500123456", , , [ 8, 9, 10, 11, 12, 13, 14 ] ], , , [ , , "1(?:6(?:013|255|399)|7(?:(?:[015]1|[69]3)3|[2-4]55|[78]99))\\d{7,8}|15(?:(?:[03-68]00|113)\\d|2\\d55|7\\d99|9\\d33)\\d{7}", , , , "177991234567", , , [ 12, 13 ] ] ],
            DJ: [ , [ , , "(?:2\\d|77)\\d{6}", , , , , , , [ 8 ] ], [ , , "2(?:1[2-5]|7[45])\\d{5}", , , , "21360003" ], [ , , "77\\d{6}", , , , "77831001" ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "DJ", 253, "00", , , , , , , , [ [ , "(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", [ "[27]" ] ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            DK: [ , [ , , "[2-9]\\d{7}", , , , , , , [ 8 ] ], [ , , "(?:[2-7]\\d|8[126-9]|9[1-46-9])\\d{6}", , , , "32123456" ], [ , , "(?:[2-7]\\d|8[126-9]|9[1-46-9])\\d{6}", , , , "32123456" ], [ , , "80\\d{6}", , , , "80123456" ], [ , , "90\\d{6}", , , , "90123456" ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "DK", 45, "00", , , , , , , 1, [ [ , "(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", [ "[2-9]" ] ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            DM: [ , [ , , "(?:[58]\\d\\d|767|900)\\d{7}", , , , , , , [ 10 ], [ 7 ] ], [ , , "767(?:2(?:55|66)|4(?:2[01]|4[0-25-9])|50[0-4])\\d{4}", , , , "7674201234", , , , [ 7 ] ], [ , , "767(?:2(?:[2-4689]5|7[5-7])|31[5-7]|61[1-8]|70[1-6])\\d{4}", , , , "7672251234", , , , [ 7 ] ], [ , , "8(?:00|33|44|55|66|77|88)[2-9]\\d{6}", , , , "8002123456" ], [ , , "900[2-9]\\d{6}", , , , "9002123456" ], [ , , , , , , , , , [ -1 ] ], [ , , "52(?:3(?:[2-46-9][02-9]\\d|5(?:[02-46-9]\\d|5[0-46-9]))|4(?:[2-478][02-9]\\d|5(?:[034]\\d|2[024-9]|5[0-46-9])|6(?:0[1-9]|[2-9]\\d)|9(?:[05-9]\\d|2[0-5]|49)))\\d{4}|52[34][2-9]1[02-9]\\d{4}|5(?:00|2[12]|33|44|66|77|88)[2-9]\\d{6}", , , , "5002345678" ], [ , , , , , , , , , [ -1 ] ], "DM", 1, "011", "1", , , "1|([2-7]\\d{6})$", "767$1", , , , , [ , , , , , , , , , [ -1 ] ], , "767", [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            DO: [ , [ , , "(?:[58]\\d\\d|900)\\d{7}", , , , , , , [ 10 ], [ 7 ] ], [ , , "8(?:[04]9[2-9]\\d\\d|29(?:2(?:[0-59]\\d|6[04-9]|7[0-27]|8[0237-9])|3(?:[0-35-9]\\d|4[7-9])|[45]\\d\\d|6(?:[0-27-9]\\d|[3-5][1-9]|6[0135-8])|7(?:0[013-9]|[1-37]\\d|4[1-35689]|5[1-4689]|6[1-57-9]|8[1-79]|9[1-8])|8(?:0[146-9]|1[0-48]|[248]\\d|3[1-79]|5[01589]|6[013-68]|7[124-8]|9[0-8])|9(?:[0-24]\\d|3[02-46-9]|5[0-79]|60|7[0169]|8[57-9]|9[02-9])))\\d{4}", , , , "8092345678", , , , [ 7 ] ], [ , , "8[024]9[2-9]\\d{6}", , , , "8092345678", , , , [ 7 ] ], [ , , "8(?:00(?:14|[2-9]\\d)|(?:33|44|55|66|77|88)[2-9]\\d)\\d{5}", , , , "8002123456" ], [ , , "900[2-9]\\d{6}", , , , "9002123456" ], [ , , , , , , , , , [ -1 ] ], [ , , "52(?:3(?:[2-46-9][02-9]\\d|5(?:[02-46-9]\\d|5[0-46-9]))|4(?:[2-478][02-9]\\d|5(?:[034]\\d|2[024-9]|5[0-46-9])|6(?:0[1-9]|[2-9]\\d)|9(?:[05-9]\\d|2[0-5]|49)))\\d{4}|52[34][2-9]1[02-9]\\d{4}|5(?:00|2[12]|33|44|66|77|88)[2-9]\\d{6}", , , , "5002345678" ], [ , , , , , , , , , [ -1 ] ], "DO", 1, "011", "1", , , "1", , , , , , [ , , , , , , , , , [ -1 ] ], , "8001|8[024]9", [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            DZ: [ , [ , , "(?:[1-4]|[5-79]\\d|80)\\d{7}", , , , , , , [ 8, 9 ] ], [ , , "9619\\d{5}|(?:1\\d|2[013-79]|3[0-8]|4[0135689])\\d{6}", , , , "12345678" ], [ , , "(?:5(?:4[0-29]|5\\d|6[0-2])|6(?:[569]\\d|7[0-6])|7[7-9]\\d)\\d{6}", , , , "551234567", , , [ 9 ] ], [ , , "800\\d{6}", , , , "800123456", , , [ 9 ] ], [ , , "80[3-689]1\\d{5}", , , , "808123456", , , [ 9 ] ], [ , , "80[12]1\\d{5}", , , , "801123456", , , [ 9 ] ], [ , , , , , , , , , [ -1 ] ], [ , , "98[23]\\d{6}", , , , "983123456", , , [ 9 ] ], "DZ", 213, "00", "0", , , "0", , , , [ [ , "(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", [ "[1-4]" ], "0$1" ], [ , "(\\d{2})(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3 $4", [ "9" ], "0$1" ], [ , "(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", [ "[5-8]" ], "0$1" ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            EC: [ , [ , , "1\\d{9,10}|(?:[2-7]|9\\d)\\d{7}", , , , , , , [ 8, 9, 10, 11 ], [ 7 ] ], [ , , "[2-7][2-7]\\d{6}", , , , "22123456", , , [ 8 ], [ 7 ] ], [ , , "964[0-2]\\d{5}|9(?:39|[57][89]|6[0-36-9]|[89]\\d)\\d{6}", , , , "991234567", , , [ 9 ] ], [ , , "1800\\d{7}|1[78]00\\d{6}", , , , "18001234567", , , [ 10, 11 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , "[2-7]890\\d{4}", , , , "28901234", , , [ 8 ] ], "EC", 593, "00", "0", , , "0", , , , [ [ , "(\\d{3})(\\d{4})", "$1-$2", [ "[2-7]" ] ], [ , "(\\d)(\\d{3})(\\d{4})", "$1 $2-$3", [ "[2-7]" ], "(0$1)" ], [ , "(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", [ "9" ], "0$1" ], [ , "(\\d{4})(\\d{3})(\\d{3,4})", "$1 $2 $3", [ "1" ] ] ], [ [ , "(\\d)(\\d{3})(\\d{4})", "$1-$2-$3", [ "[2-7]" ] ], [ , "(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", [ "9" ], "0$1" ], [ , "(\\d{4})(\\d{3})(\\d{3,4})", "$1 $2 $3", [ "1" ] ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            EE: [ , [ , , "8\\d{9}|[4578]\\d{7}|(?:[3-8]\\d|90)\\d{5}", , , , , , , [ 7, 8, 10 ] ], [ , , "(?:3[23589]|4[3-8]|6\\d|7[1-9]|88)\\d{5}", , , , "3212345", , , [ 7 ] ], [ , , "(?:5\\d{5}|8(?:1(?:0(?:000|[3-9]\\d\\d)|(?:1(?:0[236]|1\\d)|(?:23|[3-79]\\d)\\d)\\d)|2(?:0(?:000|(?:19|[24-7]\\d)\\d)|(?:(?:[124-6]\\d|3[5-9])\\d|7(?:[679]\\d|8[13-9])|8(?:[2-6]\\d|7[01]))\\d)|[349]\\d{4}))\\d\\d|5(?:(?:[02]\\d|5[0-478])\\d|1(?:[0-8]\\d|95)|6(?:4[0-4]|5[1-589]))\\d{3}", , , , "51234567", , , [ 7, 8 ] ], [ , , "800(?:(?:0\\d\\d|1)\\d|[2-9])\\d{3}", , , , "80012345" ], [ , , "(?:40\\d\\d|900)\\d{4}", , , , "9001234", , , [ 7, 8 ] ], [ , , , , , , , , , [ -1 ] ], [ , , "70[0-2]\\d{5}", , , , "70012345", , , [ 8 ] ], [ , , , , , , , , , [ -1 ] ], "EE", 372, "00", , , , , , , , [ [ , "(\\d{3})(\\d{4})", "$1 $2", [ "[369]|4[3-8]|5(?:[0-2]|5[0-478]|6[45])|7[1-9]|88", "[369]|4[3-8]|5(?:[02]|1(?:[0-8]|95)|5[0-478]|6(?:4[0-4]|5[1-589]))|7[1-9]|88" ] ], [ , "(\\d{4})(\\d{3,4})", "$1 $2", [ "[45]|8(?:00|[1-49])", "[45]|8(?:00[1-9]|[1-49])" ] ], [ , "(\\d{2})(\\d{2})(\\d{4})", "$1 $2 $3", [ "7" ] ], [ , "(\\d{4})(\\d{3})(\\d{3})", "$1 $2 $3", [ "8" ] ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , "800[2-9]\\d{3}", , , , , , , [ 7 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            EG: [ , [ , , "[189]\\d{8,9}|[24-6]\\d{8}|[135]\\d{7}", , , , , , , [ 8, 9, 10 ], [ 6, 7 ] ], [ , , "13[23]\\d{6}|(?:15|57)\\d{6,7}|(?:2[2-4]|3|4[05-8]|5[05]|6[24-689]|8[2468]|9[235-7])\\d{7}", , , , "234567890", , , [ 8, 9 ], [ 6, 7 ] ], [ , , "1[0-25]\\d{8}", , , , "1001234567", , , [ 10 ] ], [ , , "800\\d{7}", , , , "8001234567", , , [ 10 ] ], [ , , "900\\d{7}", , , , "9001234567", , , [ 10 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "EG", 20, "00", "0", , , "0", , , , [ [ , "(\\d)(\\d{7,8})", "$1 $2", [ "[23]" ], "0$1" ], [ , "(\\d{2})(\\d{6,7})", "$1 $2", [ "1[35]|[4-6]|8[2468]|9[235-7]" ], "0$1" ], [ , "(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", [ "[189]" ], "0$1" ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            EH: [ , [ , , "[5-8]\\d{8}", , , , , , , [ 9 ] ], [ , , "528[89]\\d{5}", , , , "528812345" ], [ , , "(?:6(?:[0-79]\\d|8[0-247-9])|7(?:[01]\\d|6[1267]|7[0-57]))\\d{6}", , , , "650123456" ], [ , , "80\\d{7}", , , , "801234567" ], [ , , "89\\d{7}", , , , "891234567" ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , "592(?:4[0-2]|93)\\d{4}", , , , "592401234" ], "EH", 212, "00", "0", , , "0", , , , , , [ , , , , , , , , , [ -1 ] ], , "528[89]", [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            ER: [ , [ , , "[178]\\d{6}", , , , , , , [ 7 ], [ 6 ] ], [ , , "(?:1(?:1[12568]|[24]0|55|6[146])|8\\d\\d)\\d{4}", , , , "8370362", , , , [ 6 ] ], [ , , "(?:17[1-3]|7\\d\\d)\\d{4}", , , , "7123456" ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "ER", 291, "00", "0", , , "0", , , , [ [ , "(\\d)(\\d{3})(\\d{3})", "$1 $2 $3", [ "[178]" ], "0$1" ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            ES: [ , [ , , "[5-9]\\d{8}", , , , , , , [ 9 ] ], [ , , "96906(?:0[0-8]|1[1-9]|[2-9]\\d)\\d\\d|9(?:69(?:0[0-57-9]|[1-9]\\d)|73(?:[0-8]\\d|9[1-9]))\\d{4}|(?:8(?:[1356]\\d|[28][0-8]|[47][1-9])|9(?:[135]\\d|[268][0-8]|4[1-9]|7[124-9]))\\d{6}", , , , "810123456" ], [ , , "(?:590[16]00\\d|9(?:6906(?:09|10)|7390\\d\\d))\\d\\d|(?:6\\d|7[1-48])\\d{7}", , , , "612345678" ], [ , , "[89]00\\d{6}", , , , "800123456" ], [ , , "80[367]\\d{6}", , , , "803123456" ], [ , , "90[12]\\d{6}", , , , "901123456" ], [ , , "70\\d{7}", , , , "701234567" ], [ , , , , , , , , , [ -1 ] ], "ES", 34, "00", , , , , , , , [ [ , "(\\d{4})", "$1", [ "905" ] ], [ , "(\\d{6})", "$1", [ "[79]9" ] ], [ , "(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", [ "[89]00" ] ], [ , "(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", [ "[5-9]" ] ] ], [ [ , "(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", [ "[89]00" ] ], [ , "(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", [ "[5-9]" ] ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , "51\\d{7}", , , , "511234567" ], , , [ , , , , , , , , , [ -1 ] ] ],
            ET: [ , [ , , "(?:11|[2-59]\\d)\\d{7}", , , , , , , [ 9 ], [ 7 ] ], [ , , "11667[01]\\d{3}|(?:11(?:1(?:1[124]|2[2-7]|3[1-5]|5[5-8]|8[6-8])|2(?:13|3[6-8]|5[89]|7[05-9]|8[2-6])|3(?:2[01]|3[0-289]|4[1289]|7[1-4]|87)|4(?:1[69]|3[2-49]|4[0-3]|6[5-8])|5(?:1[578]|44|5[0-4])|6(?:1[78]|2[69]|39|4[5-7]|5[1-5]|6[0-59]|8[015-8]))|2(?:2(?:11[1-9]|22[0-7]|33\\d|44[1467]|66[1-68])|5(?:11[124-6]|33[2-8]|44[1467]|55[14]|66[1-3679]|77[124-79]|880))|3(?:3(?:11[0-46-8]|(?:22|55)[0-6]|33[0134689]|44[04]|66[01467])|4(?:44[0-8]|55[0-69]|66[0-3]|77[1-5]))|4(?:6(?:119|22[0-24-7]|33[1-5]|44[13-69]|55[14-689]|660|88[1-4])|7(?:(?:11|22)[1-9]|33[13-7]|44[13-6]|55[1-689]))|5(?:7(?:227|55[05]|(?:66|77)[14-8])|8(?:11[149]|22[013-79]|33[0-68]|44[013-8]|550|66[1-5]|77\\d)))\\d{4}", , , , "111112345", , , , [ 7 ] ], [ , , "9\\d{8}", , , , "911234567" ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "ET", 251, "00", "0", , , "0", , , , [ [ , "(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", [ "[1-59]" ], "0$1" ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            FI: [ , [ , , "[1-35689]\\d{4}|7\\d{10,11}|(?:[124-7]\\d|3[0-46-9])\\d{8}|[1-9]\\d{5,8}", , , , , , , [ 5, 6, 7, 8, 9, 10, 11, 12 ] ], [ , , "(?:1[3-79][1-8]|[235689][1-8]\\d)\\d{2,6}", , , , "131234567", , , [ 5, 6, 7, 8, 9 ] ], [ , , "4946\\d{2,6}|(?:4[0-8]|50)\\d{4,8}", , , , "412345678", , , [ 6, 7, 8, 9, 10 ] ], [ , , "800\\d{4,6}", , , , "800123456", , , [ 7, 8, 9 ] ], [ , , "[67]00\\d{5,6}", , , , "600123456", , , [ 8, 9 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "FI", 358, "00|99(?:[01469]|5(?:[14]1|3[23]|5[59]|77|88|9[09]))", "0", , , "0", , "00", , [ [ , "(\\d{5})", "$1", [ "75[12]" ], "0$1" ], [ , "(\\d)(\\d{4,9})", "$1 $2", [ "[2568][1-8]|3(?:0[1-9]|[1-9])|9" ], "0$1" ], [ , "(\\d{6})", "$1", [ "11" ] ], [ , "(\\d{3})(\\d{3,7})", "$1 $2", [ "[12]00|[368]|70[07-9]" ], "0$1" ], [ , "(\\d{2})(\\d{4,8})", "$1 $2", [ "[1245]|7[135]" ], "0$1" ], [ , "(\\d{2})(\\d{6,10})", "$1 $2", [ "7" ], "0$1" ] ], [ [ , "(\\d)(\\d{4,9})", "$1 $2", [ "[2568][1-8]|3(?:0[1-9]|[1-9])|9" ], "0$1" ], [ , "(\\d{3})(\\d{3,7})", "$1 $2", [ "[12]00|[368]|70[07-9]" ], "0$1" ], [ , "(\\d{2})(\\d{4,8})", "$1 $2", [ "[1245]|7[135]" ], "0$1" ], [ , "(\\d{2})(\\d{6,10})", "$1 $2", [ "7" ], "0$1" ] ], [ , , , , , , , , , [ -1 ] ], 1, "1[03-79]|[2-9]", [ , , "20(?:2[023]|9[89])\\d{1,6}|(?:60[12]\\d|7099)\\d{4,5}|(?:606|7(?:0[78]|1|3\\d))\\d{7}|(?:[1-3]00|7(?:0[1-5]\\d\\d|5[03-9]))\\d{3,7}" ], [ , , "20\\d{4,8}|60[12]\\d{5,6}|7(?:099\\d{4,5}|5[03-9]\\d{3,7})|20[2-59]\\d\\d|(?:606|7(?:0[78]|1|3\\d))\\d{7}|(?:10|29|3[09]|70[1-5]\\d)\\d{4,8}", , , , "10112345" ], , , [ , , , , , , , , , [ -1 ] ] ],
            FJ: [ , [ , , "45\\d{5}|(?:0800\\d|[235-9])\\d{6}", , , , , , , [ 7, 11 ] ], [ , , "603\\d{4}|(?:3[0-5]|6[25-7]|8[58])\\d{5}", , , , "3212345", , , [ 7 ] ], [ , , "(?:[279]\\d|45|5[01568]|8[034679])\\d{5}", , , , "7012345", , , [ 7 ] ], [ , , "0800\\d{7}", , , , "08001234567", , , [ 11 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "FJ", 679, "0(?:0|52)", , , , , , "00", , [ [ , "(\\d{3})(\\d{4})", "$1 $2", [ "[235-9]|45" ] ], [ , "(\\d{4})(\\d{3})(\\d{4})", "$1 $2 $3", [ "0" ] ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            FK: [ , [ , , "[2-7]\\d{4}", , , , , , , [ 5 ] ], [ , , "[2-47]\\d{4}", , , , "31234" ], [ , , "[56]\\d{4}", , , , "51234" ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "FK", 500, "00", , , , , , , , , , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            FM: [ , [ , , "(?:[39]\\d\\d|820)\\d{4}", , , , , , , [ 7 ] ], [ , , "31(?:00[67]|208|309)\\d\\d|(?:3(?:[2357]0[1-9]|602|804|905)|(?:820|9[2-6]\\d)\\d)\\d{3}", , , , "3201234" ], [ , , "31(?:00[67]|208|309)\\d\\d|(?:3(?:[2357]0[1-9]|602|804|905)|(?:820|9[2-7]\\d)\\d)\\d{3}", , , , "3501234" ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "FM", 691, "00", , , , , , , , [ [ , "(\\d{3})(\\d{4})", "$1 $2", [ "[389]" ] ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            FO: [ , [ , , "[2-9]\\d{5}", , , , , , , [ 6 ] ], [ , , "(?:20|[34]\\d|8[19])\\d{4}", , , , "201234" ], [ , , "(?:[27][1-9]|5\\d|91)\\d{4}", , , , "211234" ], [ , , "80[257-9]\\d{3}", , , , "802123" ], [ , , "90(?:[13-5][15-7]|2[125-7]|9\\d)\\d\\d", , , , "901123" ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , "(?:6[0-36]|88)\\d{4}", , , , "601234" ], "FO", 298, "00", , , , "(10(?:01|[12]0|88))", , , , [ [ , "(\\d{6})", "$1", [ "[2-9]" ], , "$CC $1" ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            FR: [ , [ , , "[1-9]\\d{8}", , , , , , , [ 9 ] ], [ , , "(?:[1-35]\\d|4[1-9])\\d{7}", , , , "123456789" ], [ , , "(?:6(?:[0-24-8]\\d|3[0-8]|9[589])|7(?:00|[3-9]\\d))\\d{6}", , , , "612345678" ], [ , , "80[0-5]\\d{6}", , , , "801234567" ], [ , , "836(?:0[0-36-9]|[1-9]\\d)\\d{4}|8(?:1[2-9]|2[2-47-9]|3[0-57-9]|[569]\\d|8[0-35-9])\\d{6}", , , , "891123456" ], [ , , "8(?:1[01]|2[0156]|84)\\d{6}", , , , "884012345" ], [ , , , , , , , , , [ -1 ] ], [ , , "9\\d{8}", , , , "912345678" ], "FR", 33, "00", "0", , , "0", , , , [ [ , "(\\d{4})", "$1", [ "10" ] ], [ , "(\\d{3})(\\d{3})", "$1 $2", [ "1" ] ], [ , "(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", [ "8" ], "0 $1" ], [ , "(\\d)(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4 $5", [ "[1-79]" ], "0$1" ] ], [ [ , "(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", [ "8" ], "0 $1" ], [ , "(\\d)(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4 $5", [ "[1-79]" ], "0$1" ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , "80[6-9]\\d{6}", , , , "806123456" ], , , [ , , , , , , , , , [ -1 ] ] ],
            GA: [ , [ , , "(?:[067]\\d|11)\\d{6}|[2-7]\\d{6}", , , , , , , [ 7, 8 ] ], [ , , "[01]1\\d{6}", , , , "01441234", , , [ 8 ] ], [ , , "(?:(?:0[2-7]\\d|6(?:0[0-4]|10|[256]\\d))\\d|7(?:[47]\\d\\d|658))\\d{4}|[2-7]\\d{6}", , , , "06031234" ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "GA", 241, "00", , , , "0(11\\d{6}|60\\d{6}|61\\d{6}|6[256]\\d{6}|7[47]\\d{6}|76\\d{6})", "$1", , , [ [ , "(\\d)(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", [ "[2-7]" ], "0$1" ], [ , "(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", [ "11|[67]" ], "0$1" ], [ , "(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", [ "0" ] ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            GB: [ , [ , , "[1-357-9]\\d{9}|[18]\\d{8}|8\\d{6}", , , , , , , [ 7, 9, 10 ], [ 4, 5, 6, 8 ] ], [ , , "(?:1(?:1(?:3(?:[0-58]\\d\\d|73[0235])|4(?:[0-5]\\d\\d|69[7-9]|70[0359])|(?:5[0-26-9]|[78][0-49])\\d\\d|6(?:[0-4]\\d\\d|50[0-24-69]))|2(?:(?:0[024-9]|2[3-9]|3[3-79]|4[1-689]|[58][02-9]|6[0-47-9]|7[013-9]|9\\d)\\d\\d|1(?:[0-7]\\d\\d|8(?:[02]\\d|1[0-278])))|(?:3(?:0\\d|1[0-8]|[25][02-9]|3[02-579]|[468][0-46-9]|7[1-35-79]|9[2-578])|4(?:0[03-9]|[137]\\d|[28][02-57-9]|4[02-69]|5[0-8]|[69][0-79])|5(?:0[1-35-9]|[16]\\d|2[024-9]|3[015689]|4[02-9]|5[03-9]|7[0-35-9]|8[0-468]|9[0-57-9])|6(?:0[034689]|1\\d|2[0-35689]|[38][013-9]|4[1-467]|5[0-69]|6[13-9]|7[0-8]|9[0-24578])|7(?:0[0246-9]|2\\d|3[0236-8]|4[03-9]|5[0-46-9]|6[013-9]|7[0-35-9]|8[024-9]|9[02-9])|8(?:0[35-9]|2[1-57-9]|3[02-578]|4[0-578]|5[124-9]|6[2-69]|7\\d|8[02-9]|9[02569])|9(?:0[02-589]|[18]\\d|2[02-689]|3[1-57-9]|4[2-9]|5[0-579]|6[2-47-9]|7[0-24578]|9[2-57]))\\d\\d)|2(?:0[013478]|3[0189]|4[017]|8[0-46-9]|9[0-2])\\d{3})\\d{4}|1(?:2(?:0(?:46[1-4]|87[2-9])|545[1-79]|76(?:2\\d|3[1-8]|6[1-6])|9(?:7(?:2[0-4]|3[2-5])|8(?:2[2-8]|7[0-47-9]|8[3-5])))|3(?:6(?:38[2-5]|47[23])|8(?:47[04-9]|64[0157-9]))|4(?:044[1-7]|20(?:2[23]|8\\d)|6(?:0(?:30|5[2-57]|6[1-8]|7[2-8])|140)|8(?:052|87[1-3]))|5(?:2(?:4(?:3[2-79]|6\\d)|76\\d)|6(?:26[06-9]|686))|6(?:06(?:4\\d|7[4-79])|295[5-7]|35[34]\\d|47(?:24|61)|59(?:5[08]|6[67]|74)|9(?:55[0-4]|77[23]))|7(?:26(?:6[13-9]|7[0-7])|(?:442|688)\\d|50(?:2[0-3]|[3-68]2|76))|8(?:27[56]\\d|37(?:5[2-5]|8[239])|843[2-58])|9(?:0(?:0(?:6[1-8]|85)|52\\d)|3583|4(?:66[1-8]|9(?:2[01]|81))|63(?:23|3[1-4])|9561))\\d{3}", , , , "1212345678", , , [ 9, 10 ], [ 4, 5, 6, 7, 8 ] ], [ , , "7(?:457[0-57-9]|700[01]|911[028])\\d{5}|7(?:[1-3]\\d\\d|4(?:[0-46-9]\\d|5[0-689])|5(?:0[0-8]|[13-9]\\d|2[0-35-9])|7(?:0[1-9]|[1-7]\\d|8[02-9]|9[0-689])|8(?:[014-9]\\d|[23][0-8])|9(?:[024-9]\\d|1[02-9]|3[0-689]))\\d{6}", , , , "7400123456", , , [ 10 ] ], [ , , "80[08]\\d{7}|800\\d{6}|8001111", , , , "8001234567" ], [ , , "(?:8(?:4[2-5]|7[0-3])|9(?:[01]\\d|8[2-49]))\\d{7}|845464\\d", , , , "9012345678", , , [ 7, 10 ] ], [ , , , , , , , , , [ -1 ] ], [ , , "70\\d{8}", , , , "7012345678", , , [ 10 ] ], [ , , "56\\d{8}", , , , "5612345678", , , [ 10 ] ], "GB", 44, "00", "0", " x", , "0", , , , [ [ , "(\\d{3})(\\d{4})", "$1 $2", [ "800", "8001", "80011", "800111", "8001111" ], "0$1" ], [ , "(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3", [ "845", "8454", "84546", "845464" ], "0$1" ], [ , "(\\d{3})(\\d{6})", "$1 $2", [ "800" ], "0$1" ], [ , "(\\d{5})(\\d{4,5})", "$1 $2", [ "1(?:38|5[23]|69|76|94)", "1(?:(?:38|69)7|5(?:24|39)|768|946)", "1(?:3873|5(?:242|39[4-6])|(?:697|768)[347]|9467)" ], "0$1" ], [ , "(\\d{4})(\\d{5,6})", "$1 $2", [ "1(?:[2-69][02-9]|[78])" ], "0$1" ], [ , "(\\d{2})(\\d{4})(\\d{4})", "$1 $2 $3", [ "[25]|7(?:0|6[02-9])", "[25]|7(?:0|6(?:[03-9]|2[356]))" ], "0$1" ], [ , "(\\d{4})(\\d{6})", "$1 $2", [ "7" ], "0$1" ], [ , "(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", [ "[1389]" ], "0$1" ] ], , [ , , "76(?:464|652)\\d{5}|76(?:0[0-2]|2[356]|34|4[01347]|5[49]|6[0-369]|77|81|9[139])\\d{6}", , , , "7640123456", , , [ 10 ] ], 1, , [ , , , , , , , , , [ -1 ] ], [ , , "(?:3[0347]|55)\\d{8}", , , , "5512345678", , , [ 10 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            GD: [ , [ , , "(?:473|[58]\\d\\d|900)\\d{7}", , , , , , , [ 10 ], [ 7 ] ], [ , , "473(?:2(?:3[0-2]|69)|3(?:2[89]|86)|4(?:[06]8|3[5-9]|4[0-49]|5[5-79]|73|90)|63[68]|7(?:58|84)|800|938)\\d{4}", , , , "4732691234", , , , [ 7 ] ], [ , , "473(?:4(?:0[2-79]|1[04-9]|2[0-5]|58)|5(?:2[01]|3[3-8])|901)\\d{4}", , , , "4734031234", , , , [ 7 ] ], [ , , "8(?:00|33|44|55|66|77|88)[2-9]\\d{6}", , , , "8002123456" ], [ , , "900[2-9]\\d{6}", , , , "9002123456" ], [ , , , , , , , , , [ -1 ] ], [ , , "52(?:3(?:[2-46-9][02-9]\\d|5(?:[02-46-9]\\d|5[0-46-9]))|4(?:[2-478][02-9]\\d|5(?:[034]\\d|2[024-9]|5[0-46-9])|6(?:0[1-9]|[2-9]\\d)|9(?:[05-9]\\d|2[0-5]|49)))\\d{4}|52[34][2-9]1[02-9]\\d{4}|5(?:00|2[12]|33|44|66|77|88)[2-9]\\d{6}", , , , "5002345678" ], [ , , , , , , , , , [ -1 ] ], "GD", 1, "011", "1", , , "1|([2-9]\\d{6})$", "473$1", , , , , [ , , , , , , , , , [ -1 ] ], , "473", [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            GE: [ , [ , , "(?:[3-57]\\d\\d|800)\\d{6}", , , , , , , [ 9 ], [ 6, 7 ] ], [ , , "(?:3(?:[256]\\d|4[124-9]|7[0-4])|4(?:1\\d|2[2-7]|3[1-79]|4[2-8]|7[239]|9[1-7]))\\d{6}", , , , "322123456", , , , [ 6, 7 ] ], [ , , "5(?:(?:0555|1177)[5-9]|757(?:7[7-9]|8[01]))\\d{3}|5(?:0070|(?:11|33)33|[25]222)[0-4]\\d{3}|5(?:00(?:0\\d|50)|11(?:00|1\\d|2[0-4])|5200|75(?:00|[57]5)|8(?:0(?:[01]\\d|2[0-4])|58[89]|8(?:55|88)))\\d{4}|(?:5(?:[14]4|5[0157-9]|68|7[0147-9]|9[1-35-9])|790)\\d{6}", , , , "555123456" ], [ , , "800\\d{6}", , , , "800123456" ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , "70[67]\\d{6}", , , , "706123456" ], "GE", 995, "00", "0", , , "0", , , , [ [ , "(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", [ "70" ], "0$1" ], [ , "(\\d{2})(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3 $4", [ "32" ], "0$1" ], [ , "(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", [ "[57]" ] ], [ , "(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", [ "[348]" ], "0$1" ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , "70[67]\\d{6}" ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            GF: [ , [ , , "(?:[56]94|80\\d|976)\\d{6}", , , , , , , [ 9 ] ], [ , , "594(?:[023]\\d|1[01]|4[03-9]|5[6-9]|6[0-3]|80|9[0-4])\\d{4}", , , , "594101234" ], [ , , "694(?:[0-249]\\d|3[0-48])\\d{4}", , , , "694201234" ], [ , , "80[0-5]\\d{6}", , , , "800012345" ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , "976\\d{6}", , , , "976012345" ], "GF", 594, "00", "0", , , "0", , , , [ [ , "(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", [ "[569]" ], "0$1" ], [ , "(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", [ "8" ], "0$1" ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            GG: [ , [ , , "(?:1481|[357-9]\\d{3})\\d{6}|8\\d{6}(?:\\d{2})?", , , , , , , [ 7, 9, 10 ], [ 6 ] ], [ , , "1481[25-9]\\d{5}", , , , "1481256789", , , [ 10 ], [ 6 ] ], [ , , "7(?:(?:781|839)\\d|911[17])\\d{5}", , , , "7781123456", , , [ 10 ] ], [ , , "80[08]\\d{7}|800\\d{6}|8001111", , , , "8001234567" ], [ , , "(?:8(?:4[2-5]|7[0-3])|9(?:[01]\\d|8[0-3]))\\d{7}|845464\\d", , , , "9012345678", , , [ 7, 10 ] ], [ , , , , , , , , , [ -1 ] ], [ , , "70\\d{8}", , , , "7012345678", , , [ 10 ] ], [ , , "56\\d{8}", , , , "5612345678", , , [ 10 ] ], "GG", 44, "00", "0", , , "0|([25-9]\\d{5})$", "1481$1", , , , , [ , , "76(?:464|652)\\d{5}|76(?:0[0-2]|2[356]|34|4[01347]|5[49]|6[0-369]|77|81|9[139])\\d{6}", , , , "7640123456", , , [ 10 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , "(?:3[0347]|55)\\d{8}", , , , "5512345678", , , [ 10 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            GH: [ , [ , , "(?:[235]\\d{3}|800)\\d{5}", , , , , , , [ 8, 9 ], [ 7 ] ], [ , , "3082[0-5]\\d{4}|3(?:0(?:[237]\\d|8[01])|[167](?:2[0-6]|7\\d|80)|2(?:2[0-5]|7\\d|80)|3(?:2[0-3]|7\\d|80)|4(?:2[013-9]|3[01]|7\\d|80)|5(?:2[0-7]|7\\d|80)|8(?:2[0-2]|7\\d|80)|9(?:[28]0|7\\d))\\d{5}", , , , "302345678", , , [ 9 ], [ 7 ] ], [ , , "(?:2(?:[0346-8]\\d|5[67])|5(?:[0457]\\d|6[01]|9[1-9]))\\d{6}", , , , "231234567", , , [ 9 ] ], [ , , "800\\d{5}", , , , "80012345", , , [ 8 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "GH", 233, "00", "0", , , "0", , , , [ [ , "(\\d{3})(\\d{4})", "$1 $2", [ "[237]|8[0-2]" ] ], [ , "(\\d{3})(\\d{5})", "$1 $2", [ "8" ], "0$1" ], [ , "(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", [ "[235]" ], "0$1" ] ], [ [ , "(\\d{3})(\\d{5})", "$1 $2", [ "8" ], "0$1" ], [ , "(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", [ "[235]" ], "0$1" ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , "800\\d{5}", , , , , , , [ 8 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            GI: [ , [ , , "(?:[25]\\d\\d|606)\\d{5}", , , , , , , [ 8 ] ], [ , , "21(?:6[24-7]\\d|90[0-2])\\d{3}|2(?:00|2[25])\\d{5}", , , , "20012345" ], [ , , "(?:5[146-8]\\d|606)\\d{5}", , , , "57123456" ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "GI", 350, "00", , , , , , , , [ [ , "(\\d{3})(\\d{5})", "$1 $2", [ "2" ] ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            GL: [ , [ , , "(?:19|[2-689]\\d|70)\\d{4}", , , , , , , [ 6 ] ], [ , , "(?:19|3[1-7]|6[14689]|70|8[14-79]|9\\d)\\d{4}", , , , "321000" ], [ , , "[245]\\d{5}", , , , "221234" ], [ , , "80\\d{4}", , , , "801234" ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , "3[89]\\d{4}", , , , "381234" ], "GL", 299, "00", , , , , , , , [ [ , "(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3", [ "19|[2-9]" ] ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            GM: [ , [ , , "[2-9]\\d{6}", , , , , , , [ 7 ] ], [ , , "(?:4(?:[23]\\d\\d|4(?:1[024679]|[6-9]\\d))|5(?:5(?:3\\d|4[0-7])|6[67]\\d|7(?:1[04]|2[035]|3[58]|48))|8\\d{3})\\d{3}", , , , "5661234" ], [ , , "(?:[23679]\\d|5[0-389])\\d{5}", , , , "3012345" ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "GM", 220, "00", , , , , , , , [ [ , "(\\d{3})(\\d{4})", "$1 $2", [ "[2-9]" ] ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            GN: [ , [ , , "722\\d{6}|(?:3|6\\d)\\d{7}", , , , , , , [ 8, 9 ] ], [ , , "3(?:0(?:24|3[12]|4[1-35-7]|5[13]|6[189]|[78]1|9[1478])|1\\d\\d)\\d{4}", , , , "30241234", , , [ 8 ] ], [ , , "6[0-356]\\d{7}", , , , "601123456", , , [ 9 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , "722\\d{6}", , , , "722123456", , , [ 9 ] ], "GN", 224, "00", , , , , , , , [ [ , "(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", [ "3" ] ], [ , "(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", [ "[67]" ] ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            GP: [ , [ , , "(?:590|(?:69|80)\\d|976)\\d{6}", , , , , , , [ 9 ] ], [ , , "590(?:0[1-68]|1[0-2]|2[0-68]|3[1289]|4[0-24-9]|5[3-579]|6[0189]|7[08]|8[0-689]|9\\d)\\d{4}", , , , "590201234" ], [ , , "69(?:0\\d\\d|1(?:2[2-9]|3[0-5]))\\d{4}", , , , "690001234" ], [ , , "80[0-5]\\d{6}", , , , "800012345" ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , "976[01]\\d{5}", , , , "976012345" ], "GP", 590, "00", "0", , , "0", , , , [ [ , "(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", [ "[569]" ], "0$1" ], [ , "(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", [ "8" ], "0$1" ] ], , [ , , , , , , , , , [ -1 ] ], 1, , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            GQ: [ , [ , , "222\\d{6}|(?:3\\d|55|[89]0)\\d{7}", , , , , , , [ 9 ] ], [ , , "33[0-24-9]\\d[46]\\d{4}|3(?:33|5\\d)\\d[7-9]\\d{4}", , , , "333091234" ], [ , , "(?:222|55\\d)\\d{6}", , , , "222123456" ], [ , , "80\\d[1-9]\\d{5}", , , , "800123456" ], [ , , "90\\d[1-9]\\d{5}", , , , "900123456" ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "GQ", 240, "00", , , , , , , , [ [ , "(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", [ "[235]" ] ], [ , "(\\d{3})(\\d{6})", "$1 $2", [ "[89]" ] ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            GR: [ , [ , , "5005000\\d{3}|8\\d{9,11}|(?:[269]\\d|70)\\d{8}", , , , , , , [ 10, 11, 12 ] ], [ , , "2(?:1\\d\\d|2(?:2[1-46-9]|[36][1-8]|4[1-7]|5[1-4]|7[1-5]|[89][1-9])|3(?:1\\d|2[1-57]|[35][1-3]|4[13]|7[1-7]|8[124-6]|9[1-79])|4(?:1\\d|2[1-8]|3[1-4]|4[13-5]|6[1-578]|9[1-5])|5(?:1\\d|[29][1-4]|3[1-5]|4[124]|5[1-6])|6(?:1\\d|[269][1-6]|3[1245]|4[1-7]|5[13-9]|7[14]|8[1-5])|7(?:1\\d|2[1-5]|3[1-6]|4[1-7]|5[1-57]|6[135]|9[125-7])|8(?:1\\d|2[1-5]|[34][1-4]|9[1-57]))\\d{6}", , , , "2123456789", , , [ 10 ] ], [ , , "68[57-9]\\d{7}|(?:69|94)\\d{8}", , , , "6912345678", , , [ 10 ] ], [ , , "800\\d{7,9}", , , , "8001234567" ], [ , , "90[19]\\d{7}", , , , "9091234567", , , [ 10 ] ], [ , , "8(?:0[16]|12|[27]5|50)\\d{7}", , , , "8011234567", , , [ 10 ] ], [ , , "70\\d{8}", , , , "7012345678", , , [ 10 ] ], [ , , , , , , , , , [ -1 ] ], "GR", 30, "00", , , , , , , , [ [ , "(\\d{2})(\\d{4})(\\d{4})", "$1 $2 $3", [ "21|7" ] ], [ , "(\\d{4})(\\d{6})", "$1 $2", [ "2(?:2|3[2-57-9]|4[2-469]|5[2-59]|6[2-9]|7[2-69]|8[2-49])|5" ] ], [ , "(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", [ "[2689]" ] ], [ , "(\\d{3})(\\d{3,4})(\\d{5})", "$1 $2 $3", [ "8" ] ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , "5005000\\d{3}", , , , "5005000123", , , [ 10 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            GT: [ , [ , , "(?:1\\d{3}|[2-7])\\d{7}", , , , , , , [ 8, 11 ] ], [ , , "[267][2-9]\\d{6}", , , , "22456789", , , [ 8 ] ], [ , , "[3-5]\\d{7}", , , , "51234567", , , [ 8 ] ], [ , , "18[01]\\d{8}", , , , "18001112222", , , [ 11 ] ], [ , , "19\\d{9}", , , , "19001112222", , , [ 11 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "GT", 502, "00", , , , , , , , [ [ , "(\\d{4})(\\d{4})", "$1 $2", [ "[2-7]" ] ], [ , "(\\d{4})(\\d{3})(\\d{4})", "$1 $2 $3", [ "1" ] ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            GU: [ , [ , , "(?:[58]\\d\\d|671|900)\\d{7}", , , , , , , [ 10 ], [ 7 ] ], [ , , "671(?:3(?:00|3[39]|4[349]|55|6[26])|4(?:00|56|7[1-9]|8[0236-9])|5(?:55|6[2-5]|88)|6(?:3[2-578]|4[24-9]|5[34]|78|8[235-9])|7(?:[0479]7|2[0167]|3[45]|8[7-9])|8(?:[2-57-9]8|6[48])|9(?:2[29]|6[79]|7[1279]|8[7-9]|9[78]))\\d{4}", , , , "6713001234", , , , [ 7 ] ], [ , , "671(?:3(?:00|3[39]|4[349]|55|6[26])|4(?:00|56|7[1-9]|8[0236-9])|5(?:55|6[2-5]|88)|6(?:3[2-578]|4[24-9]|5[34]|78|8[235-9])|7(?:[0479]7|2[0167]|3[45]|8[7-9])|8(?:[2-57-9]8|6[48])|9(?:2[29]|6[79]|7[1279]|8[7-9]|9[78]))\\d{4}", , , , "6713001234", , , , [ 7 ] ], [ , , "8(?:00|33|44|55|66|77|88)[2-9]\\d{6}", , , , "8002123456" ], [ , , "900[2-9]\\d{6}", , , , "9002123456" ], [ , , , , , , , , , [ -1 ] ], [ , , "52(?:3(?:[2-46-9][02-9]\\d|5(?:[02-46-9]\\d|5[0-46-9]))|4(?:[2-478][02-9]\\d|5(?:[034]\\d|2[024-9]|5[0-46-9])|6(?:0[1-9]|[2-9]\\d)|9(?:[05-9]\\d|2[0-5]|49)))\\d{4}|52[34][2-9]1[02-9]\\d{4}|5(?:00|2[12]|33|44|66|77|88)[2-9]\\d{6}", , , , "5002345678" ], [ , , , , , , , , , [ -1 ] ], "GU", 1, "011", "1", , , "1|([3-9]\\d{6})$", "671$1", , 1, , , [ , , , , , , , , , [ -1 ] ], , "671", [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            GW: [ , [ , , "[49]\\d{8}|4\\d{6}", , , , , , , [ 7, 9 ] ], [ , , "443\\d{6}", , , , "443201234", , , [ 9 ] ], [ , , "9(?:5\\d|6[569]|77)\\d{6}", , , , "955012345", , , [ 9 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , "40\\d{5}", , , , "4012345", , , [ 7 ] ], "GW", 245, "00", , , , , , , , [ [ , "(\\d{3})(\\d{4})", "$1 $2", [ "40" ] ], [ , "(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", [ "[49]" ] ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            GY: [ , [ , , "(?:862\\d|9008)\\d{3}|(?:[2-46]\\d|77)\\d{5}", , , , , , , [ 7 ] ], [ , , "(?:2(?:1[6-9]|2[0-35-9]|3[1-4]|5[3-9]|6\\d|7[0-24-79])|3(?:2[25-9]|3\\d)|4(?:4[0-24]|5[56])|77[1-57])\\d{4}", , , , "2201234" ], [ , , "6\\d{6}", , , , "6091234" ], [ , , "(?:289|862)\\d{4}", , , , "2891234" ], [ , , "9008\\d{3}", , , , "9008123" ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "GY", 592, "001", , , , , , , , [ [ , "(\\d{3})(\\d{4})", "$1 $2", [ "[2-46-9]" ] ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            HK: [ , [ , , "8[0-46-9]\\d{6,7}|9\\d{4}(?:\\d(?:\\d(?:\\d{4})?)?)?|(?:[235-79]\\d|46)\\d{6}", , , , , , , [ 5, 6, 7, 8, 9, 11 ] ], [ , , "(?:2(?:[13-9]\\d|2[013-9])\\d|3(?:(?:[1569][0-24-9]|4[0-246-9]|7[0-24-69])\\d|8(?:4[0-8]|5[0-5]|9\\d))|58(?:0[1-8]|1[2-9]))\\d{4}", , , , "21234567", , , [ 8 ] ], [ , , "(?:46(?:[07][0-7]|1[0-6]|4[0-57-9]|5[0-8]|6[0-4])|573[0-6]|6(?:26[013-7]|66[0-3])|70(?:7[1-5]|8[0-4])|848[015-9]|929[03-9])\\d{4}|(?:46[238]|5(?:[1-59][0-46-9]|6[0-4689]|7[0-2469])|6(?:0[1-9]|[13-59]\\d|[268][0-57-9]|7[0-79])|84[09]|9(?:0[1-9]|1[02-9]|[2358][0-8]|[467]\\d))\\d{5}", , , , "51234567", , , [ 8 ] ], [ , , "800\\d{6}", , , , "800123456", , , [ 9 ] ], [ , , "900(?:[0-24-9]\\d{7}|3\\d{1,4})", , , , "90012345678", , , [ 5, 6, 7, 8, 11 ] ], [ , , , , , , , , , [ -1 ] ], [ , , "8(?:1[0-4679]\\d|2(?:[0-36]\\d|7[0-4])|3(?:[034]\\d|2[09]|70))\\d{4}", , , , "81123456", , , [ 8 ] ], [ , , , , , , , , , [ -1 ] ], "HK", 852, "00(?:30|5[09]|[126-9]?)", , , , , , "00", , [ [ , "(\\d{3})(\\d{2,5})", "$1 $2", [ "900", "9003" ] ], [ , "(\\d{4})(\\d{4})", "$1 $2", [ "[2-7]|8[1-4]|9(?:0[1-9]|[1-8])" ] ], [ , "(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", [ "8" ] ], [ , "(\\d{3})(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3 $4", [ "9" ] ] ], , [ , , "7(?:1(?:0[0-38]|1[0-3679]|3[013]|69|9[0136])|2(?:[02389]\\d|1[18]|7[27-9])|3(?:[0-38]\\d|7[0-369]|9[2357-9])|47\\d|5(?:[178]\\d|5[0-5])|6(?:0[0-7]|2[236-9]|[35]\\d)|7(?:[27]\\d|8[7-9])|8(?:[23689]\\d|7[1-9])|9(?:[025]\\d|6[0-246-8]|7[0-36-9]|8[238]))\\d{4}", , , , "71123456", , , [ 8 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , "30(?:0[1-9]|[15-7]\\d|2[047]|89)\\d{4}", , , , "30161234", , , [ 8 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            HN: [ , [ , , "8\\d{10}|[237-9]\\d{7}", , , , , , , [ 8, 11 ] ], [ , , "2(?:2(?:0[0-39]|1[1-367]|[23]\\d|4[03-6]|5[57]|6[245]|7[0135689]|8[01346-9]|9[0-2])|4(?:0[78]|2[3-59]|3[13-9]|4[0-68]|5[1-35])|5(?:0[7-9]|16|4[03-5]|5\\d|6[014-6]|7[04]|80)|6(?:[056]\\d|17|2[067]|3[04]|4[0-378]|[78][0-8]|9[01])|7(?:6[46-9]|7[02-9]|8[034]|91)|8(?:79|8[0-357-9]|9[1-57-9]))\\d{4}", , , , "22123456", , , [ 8 ] ], [ , , "[37-9]\\d{7}", , , , "91234567", , , [ 8 ] ], [ , , "8002\\d{7}", , , , "80021234567", , , [ 11 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "HN", 504, "00", , , , , , , , [ [ , "(\\d{4})(\\d{4})", "$1-$2", [ "[237-9]" ] ], [ , "(\\d{3})(\\d{4})(\\d{4})", "$1 $2 $3", [ "8" ] ] ], [ [ , "(\\d{4})(\\d{4})", "$1-$2", [ "[237-9]" ] ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , "8002\\d{7}", , , , , , , [ 11 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            HR: [ , [ , , "(?:[24-69]\\d|3[0-79])\\d{7}|80\\d{5,7}|[1-79]\\d{7}|6\\d{5,6}", , , , , , , [ 6, 7, 8, 9 ] ], [ , , "1\\d{7}|(?:2[0-3]|3[1-5]|4[02-47-9]|5[1-3])\\d{6,7}", , , , "12345678", , , [ 8, 9 ], [ 6, 7 ] ], [ , , "9(?:751\\d{5}|8\\d{6,7})|9(?:0[1-9]|[1259]\\d|7[0679])\\d{6}", , , , "921234567", , , [ 8, 9 ] ], [ , , "80[01]\\d{4,6}", , , , "800123456", , , [ 7, 8, 9 ] ], [ , , "6[01459]\\d{6}|6[01]\\d{4,5}", , , , "611234", , , [ 6, 7, 8 ] ], [ , , , , , , , , , [ -1 ] ], [ , , "7[45]\\d{6}", , , , "74123456", , , [ 8 ] ], [ , , , , , , , , , [ -1 ] ], "HR", 385, "00", "0", , , "0", , , , [ [ , "(\\d{2})(\\d{2})(\\d{2,3})", "$1 $2 $3", [ "6[01]" ], "0$1" ], [ , "(\\d{3})(\\d{2})(\\d{2,3})", "$1 $2 $3", [ "8" ], "0$1" ], [ , "(\\d)(\\d{4})(\\d{3})", "$1 $2 $3", [ "1" ], "0$1" ], [ , "(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", [ "[67]" ], "0$1" ], [ , "(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", [ "9" ], "0$1" ], [ , "(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", [ "[2-5]" ], "0$1" ], [ , "(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", [ "8" ], "0$1" ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , "62\\d{6,7}|72\\d{6}", , , , "62123456", , , [ 8, 9 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            HT: [ , [ , , "[2-489]\\d{7}", , , , , , , [ 8 ] ], [ , , "2(?:2\\d|5[1-5]|81|9[149])\\d{5}", , , , "22453300" ], [ , , "[34]\\d{7}", , , , "34101234" ], [ , , "8\\d{7}", , , , "80012345" ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , "9(?:[67][0-4]|8[0-3589]|9\\d)\\d{5}", , , , "98901234" ], "HT", 509, "00", , , , , , , , [ [ , "(\\d{2})(\\d{2})(\\d{4})", "$1 $2 $3", [ "[2-489]" ] ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            HU: [ , [ , , "[235-7]\\d{8}|[1-9]\\d{7}", , , , , , , [ 8, 9 ], [ 6, 7 ] ], [ , , "(?:1\\d|[27][2-9]|3[2-7]|4[24-9]|5[2-79]|6[23689]|8[2-57-9]|9[2-69])\\d{6}", , , , "12345678", , , [ 8 ], [ 6, 7 ] ], [ , , "(?:[257]0|3[01])\\d{7}", , , , "201234567", , , [ 9 ] ], [ , , "(?:[48]0\\d|680[29])\\d{5}", , , , "80123456" ], [ , , "9[01]\\d{6}", , , , "90123456", , , [ 8 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , "21\\d{7}", , , , "211234567", , , [ 9 ] ], "HU", 36, "00", "06", , , "06", , , , [ [ , "(\\d)(\\d{3})(\\d{4})", "$1 $2 $3", [ "1" ], "(06 $1)" ], [ , "(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", [ "[27][2-9]|3[2-7]|4[24-9]|5[2-79]|6|8[2-57-9]|9[2-69]" ], "(06 $1)" ], [ , "(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", [ "[2-9]" ], "06 $1" ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , "(?:[48]0\\d|680[29])\\d{5}" ], [ , , "38\\d{7}", , , , "381234567", , , [ 9 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            ID: [ , [ , , "(?:(?:00[1-9]|8\\d)\\d{4}|[1-36])\\d{6}|00\\d{10}|[1-9]\\d{8,10}|[2-9]\\d{7}", , , , , , , [ 7, 8, 9, 10, 11, 12, 13 ], [ 5, 6 ] ], [ , , "2[124]\\d{7,8}|619\\d{8}|2(?:1(?:14|500)|2\\d{3})\\d{3}|61\\d{5,8}|(?:2(?:[35][1-4]|6[0-8]|7[1-6]|8\\d|9[1-8])|3(?:1|[25][1-8]|3[1-68]|4[1-3]|6[1-3568]|7[0-469]|8\\d)|4(?:0[1-589]|1[01347-9]|2[0-36-8]|3[0-24-68]|43|5[1-378]|6[1-5]|7[134]|8[1245])|5(?:1[1-35-9]|2[25-8]|3[124-9]|4[1-3589]|5[1-46]|6[1-8])|6(?:[25]\\d|3[1-69]|4[1-6])|7(?:02|[125][1-9]|[36]\\d|4[1-8]|7[0-36-9])|9(?:0[12]|1[013-8]|2[0-479]|5[125-8]|6[23679]|7[159]|8[01346]))\\d{5,8}", , , , "218350123", , , [ 7, 8, 9, 10, 11 ], [ 5, 6 ] ], [ , , "8[1-35-9]\\d{7,10}", , , , "812345678", , , [ 9, 10, 11, 12 ] ], [ , , "00[17]803\\d{7}|(?:177\\d|800)\\d{5,7}|001803\\d{6}", , , , "8001234567", , , [ 8, 9, 10, 11, 12, 13 ] ], [ , , "809\\d{7}", , , , "8091234567", , , [ 10 ] ], [ , , "804\\d{7}", , , , "8041234567", , , [ 10 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "ID", 62, "00[89]", "0", , , "0", , , , [ [ , "(\\d)(\\d{3})(\\d{3})", "$1 $2 $3", [ "15" ] ], [ , "(\\d{2})(\\d{5,9})", "$1 $2", [ "2[124]|[36]1" ], "(0$1)" ], [ , "(\\d{3})(\\d{5,7})", "$1 $2", [ "800" ], "0$1" ], [ , "(\\d{3})(\\d{5,8})", "$1 $2", [ "[2-79]" ], "(0$1)" ], [ , "(\\d{3})(\\d{3,4})(\\d{3})", "$1-$2-$3", [ "8[1-35-9]" ], "0$1" ], [ , "(\\d{3})(\\d{6,8})", "$1 $2", [ "1" ], "0$1" ], [ , "(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", [ "804" ], "0$1" ], [ , "(\\d{3})(\\d)(\\d{3})(\\d{3})", "$1 $2 $3 $4", [ "80" ], "0$1" ], [ , "(\\d{3})(\\d{4})(\\d{4,5})", "$1-$2-$3", [ "8" ], "0$1" ], [ , "(\\d{3})(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3 $4", [ "001" ] ], [ , "(\\d{2})(\\d{4})(\\d{3})(\\d{4})", "$1 $2 $3 $4", [ "0" ] ] ], [ [ , "(\\d)(\\d{3})(\\d{3})", "$1 $2 $3", [ "15" ] ], [ , "(\\d{2})(\\d{5,9})", "$1 $2", [ "2[124]|[36]1" ], "(0$1)" ], [ , "(\\d{3})(\\d{5,7})", "$1 $2", [ "800" ], "0$1" ], [ , "(\\d{3})(\\d{5,8})", "$1 $2", [ "[2-79]" ], "(0$1)" ], [ , "(\\d{3})(\\d{3,4})(\\d{3})", "$1-$2-$3", [ "8[1-35-9]" ], "0$1" ], [ , "(\\d{3})(\\d{6,8})", "$1 $2", [ "1" ], "0$1" ], [ , "(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", [ "804" ], "0$1" ], [ , "(\\d{3})(\\d)(\\d{3})(\\d{3})", "$1 $2 $3 $4", [ "80" ], "0$1" ], [ , "(\\d{3})(\\d{4})(\\d{4,5})", "$1-$2-$3", [ "8" ], "0$1" ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , "001803\\d{6,7}|(?:007803\\d|8071)\\d{6}", , , , , , , [ 10, 12, 13 ] ], [ , , "(?:1500|8071\\d{3})\\d{3}", , , , "8071123456", , , [ 7, 10 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            IE: [ , [ , , "(?:1\\d|[2569])\\d{6,8}|4\\d{6,9}|7\\d{8}|8\\d{8,9}", , , , , , , [ 7, 8, 9, 10 ], [ 5, 6 ] ], [ , , "(?:1\\d|21)\\d{6,7}|(?:2[24-9]|4(?:0[24]|5\\d|7)|5(?:0[45]|1\\d|8)|6(?:1\\d|[237-9])|9(?:1\\d|[35-9]))\\d{5}|(?:23|4(?:[1-469]|8\\d)|5[23679]|6[4-6]|7[14]|9[04])\\d{7}", , , , "2212345", , , , [ 5, 6 ] ], [ , , "8(?:22|[35-9]\\d)\\d{6}", , , , "850123456", , , [ 9 ] ], [ , , "1800\\d{6}", , , , "1800123456", , , [ 10 ] ], [ , , "15(?:1[2-8]|[2-8]0|9[089])\\d{6}", , , , "1520123456", , , [ 10 ] ], [ , , "18[59]0\\d{6}", , , , "1850123456", , , [ 10 ] ], [ , , "700\\d{6}", , , , "700123456", , , [ 9 ] ], [ , , "76\\d{7}", , , , "761234567", , , [ 9 ] ], "IE", 353, "00", "0", , , "0", , , , [ [ , "(\\d{2})(\\d{5})", "$1 $2", [ "2[24-9]|47|58|6[237-9]|9[35-9]" ], "(0$1)" ], [ , "(\\d{3})(\\d{5})", "$1 $2", [ "[45]0" ], "(0$1)" ], [ , "(\\d)(\\d{3,4})(\\d{4})", "$1 $2 $3", [ "1" ], "(0$1)" ], [ , "(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", [ "[2569]|4[1-69]|7[14]" ], "(0$1)" ], [ , "(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", [ "70" ], "0$1" ], [ , "(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", [ "81" ], "(0$1)" ], [ , "(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", [ "[78]" ], "0$1" ], [ , "(\\d{4})(\\d{3})(\\d{3})", "$1 $2 $3", [ "1" ] ], [ , "(\\d{2})(\\d{4})(\\d{4})", "$1 $2 $3", [ "4" ], "(0$1)" ], [ , "(\\d{2})(\\d)(\\d{3})(\\d{4})", "$1 $2 $3 $4", [ "8" ], "0$1" ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , "18[59]0\\d{6}", , , , , , , [ 10 ] ], [ , , "818\\d{6}", , , , "818123456", , , [ 9 ] ], , , [ , , "88210[1-9]\\d{4}|8(?:[35-79]5\\d\\d|8(?:[013-9]\\d\\d|2(?:[01][1-9]|[2-9]\\d)))\\d{5}", , , , "8551234567", , , [ 10 ] ] ],
            IL: [ , [ , , "1\\d{6}(?:\\d{3,5})?|[57]\\d{8}|[1-489]\\d{7}", , , , , , , [ 7, 8, 9, 10, 11, 12 ] ], [ , , "153\\d{8,9}|29[1-9]\\d{5}|(?:2[0-8]|[3489]\\d)\\d{6}", , , , "21234567", , , [ 8, 11, 12 ], [ 7 ] ], [ , , "5(?:(?:[02368]\\d|[19][2-9]|4[1-9])\\d|5(?:01|1[79]|2[2-9]|3[0-3]|4[34]|5[015689]|6[6-8]|7[0-267]|8[7-9]|9[1-9]))\\d{5}", , , , "502345678", , , [ 9 ] ], [ , , "1(?:255|80[019]\\d{3})\\d{3}", , , , "1800123456", , , [ 7, 10 ] ], [ , , "1212\\d{4}|1(?:200|9(?:0[01]|19))\\d{6}", , , , "1919123456", , , [ 8, 10 ] ], [ , , "1700\\d{6}", , , , "1700123456", , , [ 10 ] ], [ , , , , , , , , , [ -1 ] ], [ , , "7(?:380|8(?:33|55|77|81))\\d{5}|7(?:18|2[23]|3[237]|47|6[58]|7\\d|82|9[235-9])\\d{6}", , , , "771234567", , , [ 9 ] ], "IL", 972, "0(?:0|1[2-9])", "0", , , "0", , , , [ [ , "(\\d{4})(\\d{3})", "$1-$2", [ "125" ] ], [ , "(\\d{4})(\\d{2})(\\d{2})", "$1-$2-$3", [ "121" ] ], [ , "(\\d)(\\d{3})(\\d{4})", "$1-$2-$3", [ "[2-489]" ], "0$1" ], [ , "(\\d{2})(\\d{3})(\\d{4})", "$1-$2-$3", [ "[57]" ], "0$1" ], [ , "(\\d{4})(\\d{3})(\\d{3})", "$1-$2-$3", [ "12" ] ], [ , "(\\d{4})(\\d{6})", "$1-$2", [ "159" ] ], [ , "(\\d)(\\d{3})(\\d{3})(\\d{3})", "$1-$2-$3-$4", [ "1[7-9]" ] ], [ , "(\\d{3})(\\d{1,2})(\\d{3})(\\d{4})", "$1-$2 $3-$4", [ "15" ] ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , "1700\\d{6}", , , , , , , [ 10 ] ], [ , , "1599\\d{6}", , , , "1599123456", , , [ 10 ] ], , , [ , , "151\\d{8,9}", , , , "15112340000", , , [ 11, 12 ] ] ],
            IM: [ , [ , , "1624\\d{6}|(?:[3578]\\d|90)\\d{8}", , , , , , , [ 10 ], [ 6 ] ], [ , , "1624(?:230|[5-8]\\d\\d)\\d{3}", , , , "1624756789", , , , [ 6 ] ], [ , , "76245[06]\\d{4}|7(?:4576|[59]24\\d|624[0-4689])\\d{5}", , , , "7924123456" ], [ , , "808162\\d{4}", , , , "8081624567" ], [ , , "8(?:440[49]06|72299\\d)\\d{3}|(?:8(?:45|70)|90[0167])624\\d{4}", , , , "9016247890" ], [ , , , , , , , , , [ -1 ] ], [ , , "70\\d{8}", , , , "7012345678" ], [ , , "56\\d{8}", , , , "5612345678" ], "IM", 44, "00", "0", , , "0|([25-8]\\d{5})$", "1624$1", , , , , [ , , , , , , , , , [ -1 ] ], , "74576|(?:16|7[56])24", [ , , , , , , , , , [ -1 ] ], [ , , "3440[49]06\\d{3}|(?:3(?:08162|3\\d{4}|45624|7(?:0624|2299))|55\\d{4})\\d{4}", , , , "5512345678" ], , , [ , , , , , , , , , [ -1 ] ] ],
            IN: [ , [ , , "(?:000800|[2-9]\\d\\d)\\d{7}|1\\d{7,12}", , , , , , , [ 8, 9, 10, 11, 12, 13 ], [ 6, 7 ] ], [ , , "2717(?:[2-7]\\d|95)\\d{4}|(?:271[0-689]|782[0-6])[2-7]\\d{5}|(?:170[24]|2(?:(?:[02][2-79]|90)\\d|80[13468])|(?:3(?:23|80)|683|79[1-7])\\d|4(?:20[24]|72[2-8])|552[1-7])\\d{6}|(?:11|33|4[04]|80)[2-7]\\d{7}|(?:342|674|788)(?:[0189][2-7]|[2-7]\\d)\\d{5}|(?:1(?:2[0-249]|3[0-25]|4[145]|[59][14]|6[014]|7[1257]|8[01346])|2(?:1[257]|3[013]|4[01]|5[0137]|6[0158]|78|8[1568]|9[14])|3(?:26|4[13]|5[34]|6[01489]|7[02-46]|8[159])|4(?:1[36]|2[1-47]|3[15]|5[12]|6[0-26-9]|7[014-9]|8[013-57]|9[014-7])|5(?:1[025]|22|[36][25]|4[28]|[578]1|9[15])|6(?:12|[2-47]1|5[17]|6[13]|80)|7(?:12|2[14]|3[134]|4[47]|5[15]|[67]1)|8(?:16|2[014]|3[126]|6[136]|7[078]|8[34]|91))[2-7]\\d{6}|(?:1(?:2[35-8]|3[346-9]|4[236-9]|[59][0235-9]|6[235-9]|7[34689]|8[257-9])|2(?:1[134689]|3[24-8]|4[2-8]|5[25689]|6[2-4679]|7[3-79]|8[2-479]|9[235-9])|3(?:01|1[79]|2[1245]|4[5-8]|5[125689]|6[235-7]|7[157-9]|8[2-46-8])|4(?:1[14578]|2[5689]|3[2-467]|5[4-7]|6[35]|73|8[2689]|9[2389])|5(?:[16][146-9]|2[14-8]|3[1346]|4[14-69]|5[46]|7[2-4]|8[2-8]|9[246])|6(?:1[1358]|2[2457]|3[2-4]|4[235-7]|5[2-689]|6[24578]|7[235689]|8[124-6])|7(?:1[013-9]|2[0235-9]|3[2679]|4[1-35689]|5[2-46-9]|[67][02-9]|8[013-7]|9[089])|8(?:1[1357-9]|2[235-8]|3[03-57-9]|4[0-24-9]|5\\d|6[2457-9]|7[1-6]|8[1256]|9[2-4]))\\d[2-7]\\d{5}", , , , "7410410123", , , [ 10 ], [ 6, 7, 8 ] ], [ , , "(?:61279|7(?:887[02-9]|9(?:313|79[07-9]))|8(?:079[04-9]|(?:84|91)7[02-8]))\\d{5}|(?:6(?:12|[2-47]1|5[17]|6[13]|80)[0189]|7(?:1(?:2[0189]|9[0-5])|2(?:[14][017-9]|8[0-59])|3(?:2[5-8]|[34][017-9]|9[016-9])|4(?:1[015-9]|[29][89]|39|8[389])|5(?:[15][017-9]|2[04-9]|9[7-9])|6(?:0[0-47]|1[0-257-9]|2[0-4]|3[19]|5[4589])|70[0289]|88[089]|97[02-8])|8(?:0(?:6[67]|7[02-8])|70[017-9]|84[01489]|91[0-289]))\\d{6}|(?:7(?:31|4[47])|8(?:16|2[014]|3[126]|6[136]|7[78]|83))(?:[0189]\\d|7[02-8])\\d{5}|(?:6(?:[09]\\d|1[04679]|2[03689]|3[05-9]|4[0489]|50|6[069]|7[07]|8[7-9])|7(?:0\\d|2[0235-79]|3[05-8]|40|5[0346-8]|6[6-9]|7[1-9]|8[0-79]|9[089])|8(?:0[01589]|1[0-57-9]|2[235-9]|3[03-57-9]|[45]\\d|6[02457-9]|7[1-69]|8[0-25-9]|9[02-9])|9\\d\\d)\\d{7}|(?:6(?:(?:1[1358]|2[2457]|3[2-4]|4[235-7]|5[2-689]|6[24578]|8[124-6])\\d|7(?:[235689]\\d|4[0189]))|7(?:1(?:[013-8]\\d|9[6-9])|28[6-8]|3(?:2[0-49]|9[2-5])|4(?:1[2-4]|[29][0-7]|3[0-8]|[56]\\d|8[0-24-7])|5(?:2[1-3]|9[0-6])|6(?:0[5689]|2[5-9]|3[02-8]|4\\d|5[0-367])|70[13-7]|881))[0189]\\d{5}", , , , "8123456789", , , [ 10 ] ], [ , , "000800\\d{7}|1(?:600\\d{6}|80(?:0\\d{4,9}|3\\d{9}))", , , , "1800123456" ], [ , , "186[12]\\d{9}", , , , "1861123456789", , , [ 13 ] ], [ , , "1860\\d{7}", , , , "18603451234", , , [ 11 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "IN", 91, "00", "0", , , "0", , , , [ [ , "(\\d{7})", "$1", [ "575" ] ], [ , "(\\d{8})", "$1", [ "5(?:0|2[23]|3[03]|[67]1|88)", "5(?:0|2(?:21|3)|3(?:0|3[23])|616|717|888)", "5(?:0|2(?:21|3)|3(?:0|3[23])|616|717|8888)" ], , , 1 ], [ , "(\\d{4})(\\d{4,5})", "$1 $2", [ "180", "1800" ], , , 1 ], [ , "(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", [ "140" ], , , 1 ], [ , "(\\d{2})(\\d{4})(\\d{4})", "$1 $2 $3", [ "11|2[02]|33|4[04]|79[1-7]|80[2-46]", "11|2[02]|33|4[04]|79(?:[1-6]|7[19])|80(?:[2-4]|6[0-589])", "11|2[02]|33|4[04]|79(?:[124-6]|3(?:[02-9]|1[0-24-9])|7(?:1|9[1-6]))|80(?:[2-4]|6[0-589])" ], "0$1", , 1 ], [ , "(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", [ "1(?:2[0-249]|3[0-25]|4[145]|[68]|7[1257])|2(?:1[257]|3[013]|4[01]|5[0137]|6[0158]|78|8[1568])|3(?:26|4[1-3]|5[34]|6[01489]|7[02-46]|8[159])|4(?:1[36]|2[1-47]|5[12]|6[0-26-9]|7[0-24-9]|8[013-57]|9[014-7])|5(?:1[025]|22|[36][25]|4[28]|5[12]|[78]1)|6(?:12|[2-4]1|5[17]|6[13]|80)|7(?:12|3[134]|4[47]|61|88)|8(?:16|2[014]|3[126]|6[136]|7[078]|8[34]|91)|(?:43|59|75)[15]|(?:1[59]|29|67|72)[14]", "1(?:2[0-24]|3[0-25]|4[145]|[59][14]|6[1-9]|7[1257]|8[1-57-9])|2(?:1[257]|3[013]|4[01]|5[0137]|6[058]|78|8[1568]|9[14])|3(?:26|4[1-3]|5[34]|6[01489]|7[02-46]|8[159])|4(?:1[36]|2[1-47]|3[15]|5[12]|6[0-26-9]|7[0-24-9]|8[013-57]|9[014-7])|5(?:1[025]|22|[36][25]|4[28]|[578]1|9[15])|674|7(?:(?:2[14]|3[34]|5[15])[2-6]|61[346]|88[0-8])|8(?:70[2-6]|84[235-7]|91[3-7])|(?:1(?:29|60|8[06])|261|552|6(?:12|[2-47]1|5[17]|6[13]|80)|7(?:12|31|4[47])|8(?:16|2[014]|3[126]|6[136]|7[78]|83))[2-7]", "1(?:2[0-24]|3[0-25]|4[145]|[59][14]|6[1-9]|7[1257]|8[1-57-9])|2(?:1[257]|3[013]|4[01]|5[0137]|6[058]|78|8[1568]|9[14])|3(?:26|4[1-3]|5[34]|6[01489]|7[02-46]|8[159])|4(?:1[36]|2[1-47]|3[15]|5[12]|6[0-26-9]|7[0-24-9]|8[013-57]|9[014-7])|5(?:1[025]|22|[36][25]|4[28]|[578]1|9[15])|6(?:12(?:[2-6]|7[0-8])|74[2-7])|7(?:(?:2[14]|5[15])[2-6]|3171|61[346]|88(?:[2-7]|82))|8(?:70[2-6]|84(?:[2356]|7[19])|91(?:[3-6]|7[19]))|73[134][2-6]|(?:74[47]|8(?:16|2[014]|3[126]|6[136]|7[78]|83))(?:[2-6]|7[19])|(?:1(?:29|60|8[06])|261|552|6(?:[2-4]1|5[17]|6[13]|7(?:1|4[0189])|80)|7(?:12|88[01]))[2-7]" ], "0$1", , 1 ], [ , "(\\d{4})(\\d{3})(\\d{3})", "$1 $2 $3", [ "1(?:[2-479]|5[0235-9])|[2-5]|6(?:1[1358]|2[2457-9]|3[2-5]|4[235-7]|5[2-689]|6[24578]|7[235689]|8[1-6])|7(?:1[013-9]|28|3[129]|4[1-35689]|5[29]|6[02-5]|70)|807", "1(?:[2-479]|5[0235-9])|[2-5]|6(?:1[1358]|2(?:[2457]|84|95)|3(?:[2-4]|55)|4[235-7]|5[2-689]|6[24578]|7[235689]|8[1-6])|7(?:1(?:[013-8]|9[6-9])|28[6-8]|3(?:17|2[0-49]|9[2-57])|4(?:1[2-4]|[29][0-7]|3[0-8]|[56]|8[0-24-7])|5(?:2[1-3]|9[0-6])|6(?:0[5689]|2[5-9]|3[02-8]|4|5[0-367])|70[13-7])|807[19]", "1(?:[2-479]|5(?:[0236-9]|5[013-9]))|[2-5]|6(?:2(?:84|95)|355|83)|73179|807(?:1|9[1-3])|(?:1552|6(?:1[1358]|2[2457]|3[2-4]|4[235-7]|5[2-689]|6[24578]|7[235689]|8[124-6])\\d|7(?:1(?:[013-8]\\d|9[6-9])|28[6-8]|3(?:2[0-49]|9[2-57])|4(?:1[2-4]|[29][0-7]|3[0-8]|[56]\\d|8[0-24-7])|5(?:2[1-3]|9[0-6])|6(?:0[5689]|2[5-9]|3[02-8]|4\\d|5[0-367])|70[13-7]))[2-7]" ], "0$1", , 1 ], [ , "(\\d{5})(\\d{5})", "$1 $2", [ "[6-9]" ], "0$1", , 1 ], [ , "(\\d{4})(\\d{2,4})(\\d{4})", "$1 $2 $3", [ "1(?:6|8[06])", "1(?:6|8[06]0)" ], , , 1 ], [ , "(\\d{3})(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3 $4", [ "0" ] ], [ , "(\\d{4})(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3 $4", [ "18" ], , , 1 ] ], [ [ , "(\\d{8})", "$1", [ "5(?:0|2[23]|3[03]|[67]1|88)", "5(?:0|2(?:21|3)|3(?:0|3[23])|616|717|888)", "5(?:0|2(?:21|3)|3(?:0|3[23])|616|717|8888)" ], , , 1 ], [ , "(\\d{4})(\\d{4,5})", "$1 $2", [ "180", "1800" ], , , 1 ], [ , "(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", [ "140" ], , , 1 ], [ , "(\\d{2})(\\d{4})(\\d{4})", "$1 $2 $3", [ "11|2[02]|33|4[04]|79[1-7]|80[2-46]", "11|2[02]|33|4[04]|79(?:[1-6]|7[19])|80(?:[2-4]|6[0-589])", "11|2[02]|33|4[04]|79(?:[124-6]|3(?:[02-9]|1[0-24-9])|7(?:1|9[1-6]))|80(?:[2-4]|6[0-589])" ], "0$1", , 1 ], [ , "(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", [ "1(?:2[0-249]|3[0-25]|4[145]|[68]|7[1257])|2(?:1[257]|3[013]|4[01]|5[0137]|6[0158]|78|8[1568])|3(?:26|4[1-3]|5[34]|6[01489]|7[02-46]|8[159])|4(?:1[36]|2[1-47]|5[12]|6[0-26-9]|7[0-24-9]|8[013-57]|9[014-7])|5(?:1[025]|22|[36][25]|4[28]|5[12]|[78]1)|6(?:12|[2-4]1|5[17]|6[13]|80)|7(?:12|3[134]|4[47]|61|88)|8(?:16|2[014]|3[126]|6[136]|7[078]|8[34]|91)|(?:43|59|75)[15]|(?:1[59]|29|67|72)[14]", "1(?:2[0-24]|3[0-25]|4[145]|[59][14]|6[1-9]|7[1257]|8[1-57-9])|2(?:1[257]|3[013]|4[01]|5[0137]|6[058]|78|8[1568]|9[14])|3(?:26|4[1-3]|5[34]|6[01489]|7[02-46]|8[159])|4(?:1[36]|2[1-47]|3[15]|5[12]|6[0-26-9]|7[0-24-9]|8[013-57]|9[014-7])|5(?:1[025]|22|[36][25]|4[28]|[578]1|9[15])|674|7(?:(?:2[14]|3[34]|5[15])[2-6]|61[346]|88[0-8])|8(?:70[2-6]|84[235-7]|91[3-7])|(?:1(?:29|60|8[06])|261|552|6(?:12|[2-47]1|5[17]|6[13]|80)|7(?:12|31|4[47])|8(?:16|2[014]|3[126]|6[136]|7[78]|83))[2-7]", "1(?:2[0-24]|3[0-25]|4[145]|[59][14]|6[1-9]|7[1257]|8[1-57-9])|2(?:1[257]|3[013]|4[01]|5[0137]|6[058]|78|8[1568]|9[14])|3(?:26|4[1-3]|5[34]|6[01489]|7[02-46]|8[159])|4(?:1[36]|2[1-47]|3[15]|5[12]|6[0-26-9]|7[0-24-9]|8[013-57]|9[014-7])|5(?:1[025]|22|[36][25]|4[28]|[578]1|9[15])|6(?:12(?:[2-6]|7[0-8])|74[2-7])|7(?:(?:2[14]|5[15])[2-6]|3171|61[346]|88(?:[2-7]|82))|8(?:70[2-6]|84(?:[2356]|7[19])|91(?:[3-6]|7[19]))|73[134][2-6]|(?:74[47]|8(?:16|2[014]|3[126]|6[136]|7[78]|83))(?:[2-6]|7[19])|(?:1(?:29|60|8[06])|261|552|6(?:[2-4]1|5[17]|6[13]|7(?:1|4[0189])|80)|7(?:12|88[01]))[2-7]" ], "0$1", , 1 ], [ , "(\\d{4})(\\d{3})(\\d{3})", "$1 $2 $3", [ "1(?:[2-479]|5[0235-9])|[2-5]|6(?:1[1358]|2[2457-9]|3[2-5]|4[235-7]|5[2-689]|6[24578]|7[235689]|8[1-6])|7(?:1[013-9]|28|3[129]|4[1-35689]|5[29]|6[02-5]|70)|807", "1(?:[2-479]|5[0235-9])|[2-5]|6(?:1[1358]|2(?:[2457]|84|95)|3(?:[2-4]|55)|4[235-7]|5[2-689]|6[24578]|7[235689]|8[1-6])|7(?:1(?:[013-8]|9[6-9])|28[6-8]|3(?:17|2[0-49]|9[2-57])|4(?:1[2-4]|[29][0-7]|3[0-8]|[56]|8[0-24-7])|5(?:2[1-3]|9[0-6])|6(?:0[5689]|2[5-9]|3[02-8]|4|5[0-367])|70[13-7])|807[19]", "1(?:[2-479]|5(?:[0236-9]|5[013-9]))|[2-5]|6(?:2(?:84|95)|355|83)|73179|807(?:1|9[1-3])|(?:1552|6(?:1[1358]|2[2457]|3[2-4]|4[235-7]|5[2-689]|6[24578]|7[235689]|8[124-6])\\d|7(?:1(?:[013-8]\\d|9[6-9])|28[6-8]|3(?:2[0-49]|9[2-57])|4(?:1[2-4]|[29][0-7]|3[0-8]|[56]\\d|8[0-24-7])|5(?:2[1-3]|9[0-6])|6(?:0[5689]|2[5-9]|3[02-8]|4\\d|5[0-367])|70[13-7]))[2-7]" ], "0$1", , 1 ], [ , "(\\d{5})(\\d{5})", "$1 $2", [ "[6-9]" ], "0$1", , 1 ], [ , "(\\d{4})(\\d{2,4})(\\d{4})", "$1 $2 $3", [ "1(?:6|8[06])", "1(?:6|8[06]0)" ], , , 1 ], [ , "(\\d{4})(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3 $4", [ "18" ], , , 1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , "1(?:600\\d{6}|800\\d{4,9})|(?:000800|18(?:03\\d\\d|6(?:0|[12]\\d\\d)))\\d{7}" ], [ , , "140\\d{7}", , , , "1409305260", , , [ 10 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            IO: [ , [ , , "3\\d{6}", , , , , , , [ 7 ] ], [ , , "37\\d{5}", , , , "3709100" ], [ , , "38\\d{5}", , , , "3801234" ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "IO", 246, "00", , , , , , , , [ [ , "(\\d{3})(\\d{4})", "$1 $2", [ "3" ] ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            IQ: [ , [ , , "(?:1|7\\d\\d)\\d{7}|[2-6]\\d{7,8}", , , , , , , [ 8, 9, 10 ], [ 6, 7 ] ], [ , , "1\\d{7}|(?:2[13-5]|3[02367]|4[023]|5[03]|6[026])\\d{6,7}", , , , "12345678", , , [ 8, 9 ], [ 6, 7 ] ], [ , , "7[3-9]\\d{8}", , , , "7912345678", , , [ 10 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "IQ", 964, "00", "0", , , "0", , , , [ [ , "(\\d)(\\d{3})(\\d{4})", "$1 $2 $3", [ "1" ], "0$1" ], [ , "(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", [ "[2-6]" ], "0$1" ], [ , "(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", [ "7" ], "0$1" ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            IR: [ , [ , , "[1-9]\\d{9}|(?:[1-8]\\d\\d|9)\\d{3,4}", , , , , , , [ 4, 5, 6, 7, 10 ], [ 8 ] ], [ , , "(?:1[137]|2[13-68]|3[1458]|4[145]|5[1468]|6[16]|7[1467]|8[13467])(?:[03-57]\\d{7}|[16]\\d{3}(?:\\d{4})?|[289]\\d{3}(?:\\d(?:\\d{3})?)?)|94(?:000[09]|2(?:121|[2689]0\\d)|30[0-2]\\d|4(?:111|40\\d))\\d{4}", , , , "2123456789", , , [ 6, 7, 10 ], [ 4, 5, 8 ] ], [ , , "9(?:(?:0(?:[0-35]\\d|4[4-6])|(?:[13]\\d|2[0-3])\\d)\\d|9(?:(?:[0-3]\\d|4[0145])\\d|5[15]0|8(?:1\\d|88)|9(?:0[013]|[19]\\d|21|77|8[7-9])))\\d{5}", , , , "9123456789", , , [ 10 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "IR", 98, "00", "0", , , "0", , , , [ [ , "(\\d{4,5})", "$1", [ "96" ], "0$1" ], [ , "(\\d{2})(\\d{4,5})", "$1 $2", [ "(?:1[137]|2[13-68]|3[1458]|4[145]|5[1468]|6[16]|7[1467]|8[13467])[12689]" ], "0$1" ], [ , "(\\d{3})(\\d{3})(\\d{3,4})", "$1 $2 $3", [ "9" ], "0$1" ], [ , "(\\d{2})(\\d{4})(\\d{4})", "$1 $2 $3", [ "[1-8]" ], "0$1" ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , "9(?:4440\\d{5}|6(?:0[12]|2[16-8]|3(?:08|[14]5|[23]|66)|4(?:0|80)|5[01]|6[89]|86|9[19]))", , , , , , , [ 4, 5, 10 ] ], [ , , "96(?:0[12]|2[16-8]|3(?:08|[14]5|[23]|66)|4(?:0|80)|5[01]|6[89]|86|9[19])", , , , "9601", , , [ 4, 5 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            IS: [ , [ , , "(?:38\\d|[4-9])\\d{6}", , , , , , , [ 7, 9 ] ], [ , , "(?:4(?:1[0-24-69]|2[0-7]|[37][0-8]|4[0-245]|5[0-68]|6\\d|8[0-36-8])|5(?:05|[156]\\d|2[02578]|3[0-579]|4[03-7]|7[0-2578]|8[0-35-9]|9[013-689])|872)\\d{4}", , , , "4101234", , , [ 7 ] ], [ , , "(?:38[589]\\d\\d|6(?:1[1-8]|2[0-6]|3[027-9]|4[014679]|5[0159]|6[0-69]|70|8[06-8]|9\\d)|7(?:5[057]|[6-9]\\d)|8(?:2[0-59]|[3-69]\\d|8[28]))\\d{4}", , , , "6111234" ], [ , , "80[08]\\d{4}", , , , "8001234", , , [ 7 ] ], [ , , "90(?:0\\d|1[5-79]|2[015-79]|3[135-79]|4[125-7]|5[25-79]|7[1-37]|8[0-35-7])\\d{3}", , , , "9001234", , , [ 7 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , "49[0-24-79]\\d{4}", , , , "4921234", , , [ 7 ] ], "IS", 354, "00|1(?:0(?:01|[12]0)|100)", , , , , , "00", , [ [ , "(\\d{3})(\\d{4})", "$1 $2", [ "[4-9]" ] ], [ , "(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", [ "3" ] ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , "809\\d{4}", , , , "8091234", , , [ 7 ] ], , , [ , , "(?:689|8(?:7[18]|80)|95[48])\\d{4}", , , , "6891234", , , [ 7 ] ] ],
            IT: [ , [ , , "0\\d{5,10}|1\\d{8,10}|3(?:[0-8]\\d{7,10}|9\\d{7,8})|55\\d{8}|8\\d{5}(?:\\d{2,4})?", , , , , , , [ 6, 7, 8, 9, 10, 11, 12 ] ], [ , , "0669[0-79]\\d{1,6}|0(?:1(?:[0159]\\d|[27][1-5]|31|4[1-4]|6[1356]|8[2-57])|2\\d\\d|3(?:[0159]\\d|2[1-4]|3[12]|[48][1-6]|6[2-59]|7[1-7])|4(?:[0159]\\d|[23][1-9]|4[245]|6[1-5]|7[1-4]|81)|5(?:[0159]\\d|2[1-5]|3[2-6]|4[1-79]|6[4-6]|7[1-578]|8[3-8])|6(?:[0-57-9]\\d|6[0-8])|7(?:[0159]\\d|2[12]|3[1-7]|4[2-46]|6[13569]|7[13-6]|8[1-59])|8(?:[0159]\\d|2[3-578]|3[1-356]|[6-8][1-5])|9(?:[0159]\\d|[238][1-5]|4[12]|6[1-8]|7[1-6]))\\d{2,7}", , , , "0212345678", , , [ 6, 7, 8, 9, 10, 11 ] ], [ , , "3[1-9]\\d{8}|3[2-9]\\d{7}", , , , "3123456789", , , [ 9, 10 ] ], [ , , "80(?:0\\d{3}|3)\\d{3}", , , , "800123456", , , [ 6, 9 ] ], [ , , "(?:0878\\d{3}|89(?:2\\d|3[04]|4(?:[0-4]|[5-9]\\d\\d)|5[0-4]))\\d\\d|(?:1(?:44|6[346])|89(?:38|5[5-9]|9))\\d{6}", , , , "899123456", , , [ 6, 8, 9, 10 ] ], [ , , "84(?:[08]\\d{3}|[17])\\d{3}", , , , "848123456", , , [ 6, 9 ] ], [ , , "1(?:78\\d|99)\\d{6}", , , , "1781234567", , , [ 9, 10 ] ], [ , , "55\\d{8}", , , , "5512345678", , , [ 10 ] ], "IT", 39, "00", , , , , , , , [ [ , "(\\d{4,5})", "$1", [ "1(?:0|9[246])", "1(?:0|9(?:2[2-9]|[46]))" ] ], [ , "(\\d{6})", "$1", [ "1(?:1|92)" ] ], [ , "(\\d{2})(\\d{4,6})", "$1 $2", [ "0[26]" ] ], [ , "(\\d{3})(\\d{3,6})", "$1 $2", [ "0[13-57-9][0159]|8(?:03|4[17]|9[2-5])", "0[13-57-9][0159]|8(?:03|4[17]|9(?:2|3[04]|[45][0-4]))" ] ], [ , "(\\d{4})(\\d{2,6})", "$1 $2", [ "0(?:[13-579][2-46-8]|8[236-8])" ] ], [ , "(\\d{4})(\\d{4})", "$1 $2", [ "894" ] ], [ , "(\\d{2})(\\d{3,4})(\\d{4})", "$1 $2 $3", [ "0[26]|5" ] ], [ , "(\\d{3})(\\d{3})(\\d{3,4})", "$1 $2 $3", [ "1(?:44|[679])|[38]" ] ], [ , "(\\d{3})(\\d{3,4})(\\d{4})", "$1 $2 $3", [ "0[13-57-9][0159]|14" ] ], [ , "(\\d{2})(\\d{4})(\\d{5})", "$1 $2 $3", [ "0[26]" ] ], [ , "(\\d{4})(\\d{3})(\\d{4})", "$1 $2 $3", [ "0" ] ], [ , "(\\d{3})(\\d{4})(\\d{4,5})", "$1 $2 $3", [ "3" ] ] ], [ [ , "(\\d{2})(\\d{4,6})", "$1 $2", [ "0[26]" ] ], [ , "(\\d{3})(\\d{3,6})", "$1 $2", [ "0[13-57-9][0159]|8(?:03|4[17]|9[2-5])", "0[13-57-9][0159]|8(?:03|4[17]|9(?:2|3[04]|[45][0-4]))" ] ], [ , "(\\d{4})(\\d{2,6})", "$1 $2", [ "0(?:[13-579][2-46-8]|8[236-8])" ] ], [ , "(\\d{4})(\\d{4})", "$1 $2", [ "894" ] ], [ , "(\\d{2})(\\d{3,4})(\\d{4})", "$1 $2 $3", [ "0[26]|5" ] ], [ , "(\\d{3})(\\d{3})(\\d{3,4})", "$1 $2 $3", [ "1(?:44|[679])|[38]" ] ], [ , "(\\d{3})(\\d{3,4})(\\d{4})", "$1 $2 $3", [ "0[13-57-9][0159]|14" ] ], [ , "(\\d{2})(\\d{4})(\\d{5})", "$1 $2 $3", [ "0[26]" ] ], [ , "(\\d{4})(\\d{3})(\\d{4})", "$1 $2 $3", [ "0" ] ], [ , "(\\d{3})(\\d{4})(\\d{4,5})", "$1 $2 $3", [ "3" ] ] ], [ , , , , , , , , , [ -1 ] ], 1, , [ , , "848\\d{6}", , , , , , , [ 9 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , "3[2-8]\\d{9,10}", , , , "33101234501", , , [ 11, 12 ] ] ],
            JE: [ , [ , , "1534\\d{6}|(?:[3578]\\d|90)\\d{8}", , , , , , , [ 10 ], [ 6 ] ], [ , , "1534[0-24-8]\\d{5}", , , , "1534456789", , , , [ 6 ] ], [ , , "7(?:(?:(?:50|82)9|937)\\d|7(?:00[378]|97[7-9]))\\d{5}", , , , "7797712345" ], [ , , "80(?:07(?:35|81)|8901)\\d{4}", , , , "8007354567" ], [ , , "(?:8(?:4(?:4(?:4(?:05|42|69)|703)|5(?:041|800))|7(?:0002|1206))|90(?:066[59]|1810|71(?:07|55)))\\d{4}", , , , "9018105678" ], [ , , , , , , , , , [ -1 ] ], [ , , "701511\\d{4}", , , , "7015115678" ], [ , , "56\\d{8}", , , , "5612345678" ], "JE", 44, "00", "0", , , "0|([0-24-8]\\d{5})$", "1534$1", , , , , [ , , "76(?:464|652)\\d{5}|76(?:0[0-2]|2[356]|34|4[01347]|5[49]|6[0-369]|77|81|9[139])\\d{6}", , , , "7640123456" ], , , [ , , , , , , , , , [ -1 ] ], [ , , "(?:3(?:0(?:07(?:35|81)|8901)|3\\d{4}|4(?:4(?:4(?:05|42|69)|703)|5(?:041|800))|7(?:0002|1206))|55\\d{4})\\d{4}", , , , "5512345678" ], , , [ , , , , , , , , , [ -1 ] ] ],
            JM: [ , [ , , "(?:[58]\\d\\d|658|900)\\d{7}", , , , , , , [ 10 ], [ 7 ] ], [ , , "8766060\\d{3}|(?:658(?:2(?:[0-8]\\d|9[0-46-9])|[3-9]\\d\\d)|876(?:52[35]|6(?:0[1-3579]|1[0237-9]|[23]\\d|40|5[06]|6[2-589]|7[05]|8[04]|9[4-9])|7(?:0[2-689]|[1-6]\\d|8[056]|9[45])|9(?:0[1-8]|1[02378]|[2-8]\\d|9[2-468])))\\d{4}", , , , "8765230123", , , , [ 7 ] ], [ , , "(?:658295|876(?:2(?:0[2-9]|[14-9]\\d|2[013-9]|3[3-9])|[348]\\d\\d|5(?:0[1-9]|[1-9]\\d)|6(?:4[89]|6[67])|7(?:0[07]|7\\d|8[1-47-9]|9[0-36-9])|9(?:[01]9|9[0579])))\\d{4}", , , , "8762101234", , , , [ 7 ] ], [ , , "8(?:00|33|44|55|66|77|88)[2-9]\\d{6}", , , , "8002123456" ], [ , , "900[2-9]\\d{6}", , , , "9002123456" ], [ , , , , , , , , , [ -1 ] ], [ , , "52(?:3(?:[2-46-9][02-9]\\d|5(?:[02-46-9]\\d|5[0-46-9]))|4(?:[2-478][02-9]\\d|5(?:[034]\\d|2[024-9]|5[0-46-9])|6(?:0[1-9]|[2-9]\\d)|9(?:[05-9]\\d|2[0-5]|49)))\\d{4}|52[34][2-9]1[02-9]\\d{4}|5(?:00|2[12]|33|44|66|77|88)[2-9]\\d{6}", , , , "5002345678" ], [ , , , , , , , , , [ -1 ] ], "JM", 1, "011", "1", , , "1", , , , , , [ , , , , , , , , , [ -1 ] ], , "658|876", [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            JO: [ , [ , , "(?:(?:[2689]|7\\d)\\d|32|53)\\d{6}", , , , , , , [ 8, 9 ] ], [ , , "87(?:000|90[01])\\d{3}|(?:2(?:6(?:2[0-35-9]|3[0-578]|4[24-7]|5[0-24-8]|[6-8][023]|9[0-3])|7(?:0[1-79]|10|2[014-7]|3[0-689]|4[019]|5[0-3578]))|32(?:0[1-69]|1[1-35-7]|2[024-7]|3\\d|4[0-3]|[5-7][023])|53(?:0[0-3]|[13][023]|2[0-59]|49|5[0-35-9]|6[15]|7[45]|8[1-6]|9[0-36-9])|6(?:2(?:[05]0|22)|3(?:00|33)|4(?:0[0-25]|1[2-7]|2[0569]|[38][07-9]|4[025689]|6[0-589]|7\\d|9[0-2])|5(?:[01][056]|2[034]|3[0-57-9]|4[178]|5[0-69]|6[0-35-9]|7[1-379]|8[0-68]|9[0239]))|87(?:20|7[078]|99))\\d{4}", , , , "62001234", , , [ 8 ] ], [ , , "7(?:[78][0-25-9]|9\\d)\\d{6}", , , , "790123456", , , [ 9 ] ], [ , , "80\\d{6}", , , , "80012345", , , [ 8 ] ], [ , , "9\\d{7}", , , , "90012345", , , [ 8 ] ], [ , , "85\\d{6}", , , , "85012345", , , [ 8 ] ], [ , , "70\\d{7}", , , , "700123456", , , [ 9 ] ], [ , , , , , , , , , [ -1 ] ], "JO", 962, "00", "0", , , "0", , , , [ [ , "(\\d)(\\d{3})(\\d{4})", "$1 $2 $3", [ "[2356]|87" ], "(0$1)" ], [ , "(\\d{3})(\\d{5,6})", "$1 $2", [ "[89]" ], "0$1" ], [ , "(\\d{2})(\\d{7})", "$1 $2", [ "70" ], "0$1" ], [ , "(\\d)(\\d{4})(\\d{4})", "$1 $2 $3", [ "7" ], "0$1" ] ], , [ , , "74(?:66|77)\\d{5}", , , , "746612345", , , [ 9 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , "8(?:10|8\\d)\\d{5}", , , , "88101234", , , [ 8 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            JP: [ , [ , , "00[1-9]\\d{6,14}|[257-9]\\d{9}|(?:00|[1-9]\\d\\d)\\d{6}", , , , , , , [ 8, 9, 10, 11, 12, 13, 14, 15, 16, 17 ] ], [ , , "(?:1(?:1[235-8]|2[3-6]|3[3-9]|4[2-6]|[58][2-8]|6[2-7]|7[2-9]|9[1-9])|(?:2[2-9]|[36][1-9])\\d|4(?:[2-578]\\d|6[02-8]|9[2-59])|5(?:[2-589]\\d|6[1-9]|7[2-8])|7(?:[25-9]\\d|3[4-9]|4[02-9])|8(?:[2679]\\d|3[2-9]|4[5-9]|5[1-9]|8[03-9])|9(?:[2-58]\\d|[679][1-9]))\\d{6}", , , , "312345678", , , [ 9 ] ], [ , , "[7-9]0[1-9]\\d{7}", , , , "9012345678", , , [ 10 ] ], [ , , "00777(?:[01]|5\\d)\\d\\d|(?:00(?:7778|882[1245])|(?:120|800\\d)\\d\\d)\\d{4}|00(?:37|66|78)\\d{6,13}", , , , "120123456" ], [ , , "990\\d{6}", , , , "990123456", , , [ 9 ] ], [ , , , , , , , , , [ -1 ] ], [ , , "60\\d{7}", , , , "601234567", , , [ 9 ] ], [ , , "50[1-9]\\d{7}", , , , "5012345678", , , [ 10 ] ], "JP", 81, "010", "0", , , "0", , , , [ [ , "(\\d{4})(\\d{4})", "$1-$2", [ "007", "0077", "00777", "00777[01]" ] ], [ , "(\\d{3})(\\d{3})(\\d{3})", "$1-$2-$3", [ "(?:12|57|99)0" ], "0$1" ], [ , "(\\d{4})(\\d)(\\d{4})", "$1-$2-$3", [ "1(?:26|3[79]|4[56]|5[4-68]|6[3-5])|499|5(?:76|97)|746|8(?:3[89]|47|51|63)|9(?:49|80|9[16])", "1(?:267|3(?:7[247]|9[278])|466|5(?:47|58|64)|6(?:3[245]|48|5[4-68]))|499[2468]|5(?:76|97)9|7468|8(?:3(?:8[7-9]|96)|477|51[2-9]|636)|9(?:496|802|9(?:1[23]|69))|1(?:45|58)[67]", "1(?:267|3(?:7[247]|9[278])|466|5(?:47|58|64)|6(?:3[245]|48|5[4-68]))|499[2468]|5(?:769|979[2-69])|7468|8(?:3(?:8[7-9]|96[2457-9])|477|51[2-9]|636[457-9])|9(?:496|802|9(?:1[23]|69))|1(?:45|58)[67]" ], "0$1" ], [ , "(\\d{2})(\\d{3})(\\d{4})", "$1-$2-$3", [ "60" ], "0$1" ], [ , "(\\d)(\\d{4})(\\d{4})", "$1-$2-$3", [ "[36]|4(?:2[09]|7[01])", "[36]|4(?:2(?:0|9[02-69])|7(?:0[019]|1))" ], "0$1" ], [ , "(\\d{2})(\\d{3})(\\d{4})", "$1-$2-$3", [ "1(?:1|5[45]|77|88|9[69])|2(?:2[1-37]|3[0-269]|4[59]|5|6[24]|7[1-358]|8[1369]|9[0-38])|4(?:[28][1-9]|3[0-57]|[45]|6[248]|7[2-579]|9[29])|5(?:2|3[045]|4[0-369]|5[29]|8[02389]|9[0-389])|7(?:2[02-46-9]|34|[58]|6[0249]|7[57]|9[2-6])|8(?:2[124589]|3[27-9]|49|51|6|7[0-468]|8[68]|9[019])|9(?:[23][1-9]|4[15]|5[138]|6[1-3]|7[156]|8[189]|9[1-489])", "1(?:1|5(?:4[018]|5[017])|77|88|9[69])|2(?:2(?:[127]|3[014-9])|3[0-269]|4[59]|5(?:[1-3]|5[0-69]|9[19])|62|7(?:[1-35]|8[0189])|8(?:[16]|3[0134]|9[0-5])|9(?:[028]|17))|4(?:2(?:[13-79]|8[014-6])|3[0-57]|[45]|6[248]|7[2-47]|8[1-9])|5(?:2|3[045]|4[0-369]|8[02389]|9[0-3])|7(?:2[02-46-9]|34|[58]|6[0249]|7[57]|9(?:[23]|4[0-59]|5[01569]|6[0167]))|8(?:2(?:[1258]|4[0-39]|9[0-2469])|49|51|6(?:[0-24]|36|5[0-3589]|72|9[01459])|7[0-468]|8[68])|9(?:[23][1-9]|4[15]|5[138]|6[1-3]|7[156]|8[189]|9(?:[1289]|3[34]|4[0178]))|(?:49|55|83)[29]|(?:264|837)[016-9]|2(?:57|93)[015-9]|(?:25[0468]|422|838)[01]|(?:47[59]|59[89]|8(?:6[68]|9))[019]", "1(?:1|5(?:4[018]|5[017])|77|88|9[69])|2(?:2[127]|3[0-269]|4[59]|5(?:[1-3]|5[0-69]|9(?:17|99))|6(?:2|4[016-9])|7(?:[1-35]|8[0189])|8(?:[16]|3[0134]|9[0-5])|9(?:[028]|17))|4(?:2(?:[13-79]|8[014-6])|3[0-57]|[45]|6[248]|7[2-47]|9[29])|5(?:2|3[045]|4[0-369]|5[29]|8[02389]|9[0-3])|7(?:2[02-46-9]|34|[58]|6[0249]|7[57]|9(?:[23]|4[0-59]|5[01569]|6[0167]))|8(?:2(?:[1258]|4[0-39]|9[0169])|3(?:[29]|7(?:[017-9]|6[6-8]))|49|51|6(?:[0-24]|36[23]|5(?:[0-389]|5[23])|6(?:[01]|9[178])|72|9[0145])|7[0-468]|8[68])|9(?:4[15]|5[138]|7[156]|8[189]|9(?:[1289]|3(?:31|4[357])|4[0178]))|(?:8294|96)[1-3]|2(?:57|93)[015-9]|(?:223|8699)[014-9]|(?:25[0468]|422|838)[01]|(?:48|8292|9[23])[1-9]|(?:47[59]|59[89]|8(?:68|9))[019]", "1(?:1|5(?:4[018]|5[017])|77|88|9[69])|2(?:2[127]|3[0-269]|4[59]|5(?:[1-3]|5[0-69]|7[015-9]|9(?:17|99))|6(?:2|4[016-9])|7(?:[1-35]|8[0189])|8(?:[16]|3[0134]|9[0-5])|9(?:[028]|17|3[015-9]))|4(?:2(?:[13-79]|8[014-6])|3[0-57]|[45]|6[248]|7[2-47]|9[29])|5(?:2|3[045]|4[0-369]|5[29]|8[02389]|9[0-3])|7(?:2[02-46-9]|34|[58]|6[0249]|7[57]|9(?:[23]|4[0-59]|5[01569]|6[0167]))|8(?:2(?:[1258]|4[0-39]|9(?:[019]|4[1-3]|6(?:[0-47-9]|5[01346-9])))|3(?:[29]|7(?:[017-9]|6[6-8]))|49|51|6(?:[0-24]|36[23]|5(?:[0-389]|5[23])|6(?:[01]|9[178])|72|9[0145])|7[0-468]|8[68])|9(?:4[15]|5[138]|6[1-3]|7[156]|8[189]|9(?:[1289]|3(?:31|4[357])|4[0178]))|(?:223|8699)[014-9]|(?:25[0468]|422|838)[01]|(?:48|829(?:2|66)|9[23])[1-9]|(?:47[59]|59[89]|8(?:68|9))[019]" ], "0$1" ], [ , "(\\d{3})(\\d{2})(\\d{4})", "$1-$2-$3", [ "[14]|[289][2-9]|5[3-9]|7[2-4679]" ], "0$1" ], [ , "(\\d{4})(\\d{2})(\\d{3,4})", "$1-$2-$3", [ "007", "0077" ] ], [ , "(\\d{4})(\\d{2})(\\d{4})", "$1-$2-$3", [ "008" ] ], [ , "(\\d{3})(\\d{3})(\\d{4})", "$1-$2-$3", [ "800" ], "0$1" ], [ , "(\\d{2})(\\d{4})(\\d{4})", "$1-$2-$3", [ "[257-9]" ], "0$1" ], [ , "(\\d{4})(\\d{3})(\\d{3,4})", "$1-$2-$3", [ "0" ] ], [ , "(\\d{4})(\\d{4})(\\d{4,5})", "$1-$2-$3", [ "0" ] ], [ , "(\\d{4})(\\d{5})(\\d{5,6})", "$1-$2-$3", [ "0" ] ], [ , "(\\d{4})(\\d{6})(\\d{6,7})", "$1-$2-$3", [ "0" ] ] ], [ [ , "(\\d{3})(\\d{3})(\\d{3})", "$1-$2-$3", [ "(?:12|57|99)0" ], "0$1" ], [ , "(\\d{4})(\\d)(\\d{4})", "$1-$2-$3", [ "1(?:26|3[79]|4[56]|5[4-68]|6[3-5])|499|5(?:76|97)|746|8(?:3[89]|47|51|63)|9(?:49|80|9[16])", "1(?:267|3(?:7[247]|9[278])|466|5(?:47|58|64)|6(?:3[245]|48|5[4-68]))|499[2468]|5(?:76|97)9|7468|8(?:3(?:8[7-9]|96)|477|51[2-9]|636)|9(?:496|802|9(?:1[23]|69))|1(?:45|58)[67]", "1(?:267|3(?:7[247]|9[278])|466|5(?:47|58|64)|6(?:3[245]|48|5[4-68]))|499[2468]|5(?:769|979[2-69])|7468|8(?:3(?:8[7-9]|96[2457-9])|477|51[2-9]|636[457-9])|9(?:496|802|9(?:1[23]|69))|1(?:45|58)[67]" ], "0$1" ], [ , "(\\d{2})(\\d{3})(\\d{4})", "$1-$2-$3", [ "60" ], "0$1" ], [ , "(\\d)(\\d{4})(\\d{4})", "$1-$2-$3", [ "[36]|4(?:2[09]|7[01])", "[36]|4(?:2(?:0|9[02-69])|7(?:0[019]|1))" ], "0$1" ], [ , "(\\d{2})(\\d{3})(\\d{4})", "$1-$2-$3", [ "1(?:1|5[45]|77|88|9[69])|2(?:2[1-37]|3[0-269]|4[59]|5|6[24]|7[1-358]|8[1369]|9[0-38])|4(?:[28][1-9]|3[0-57]|[45]|6[248]|7[2-579]|9[29])|5(?:2|3[045]|4[0-369]|5[29]|8[02389]|9[0-389])|7(?:2[02-46-9]|34|[58]|6[0249]|7[57]|9[2-6])|8(?:2[124589]|3[27-9]|49|51|6|7[0-468]|8[68]|9[019])|9(?:[23][1-9]|4[15]|5[138]|6[1-3]|7[156]|8[189]|9[1-489])", "1(?:1|5(?:4[018]|5[017])|77|88|9[69])|2(?:2(?:[127]|3[014-9])|3[0-269]|4[59]|5(?:[1-3]|5[0-69]|9[19])|62|7(?:[1-35]|8[0189])|8(?:[16]|3[0134]|9[0-5])|9(?:[028]|17))|4(?:2(?:[13-79]|8[014-6])|3[0-57]|[45]|6[248]|7[2-47]|8[1-9])|5(?:2|3[045]|4[0-369]|8[02389]|9[0-3])|7(?:2[02-46-9]|34|[58]|6[0249]|7[57]|9(?:[23]|4[0-59]|5[01569]|6[0167]))|8(?:2(?:[1258]|4[0-39]|9[0-2469])|49|51|6(?:[0-24]|36|5[0-3589]|72|9[01459])|7[0-468]|8[68])|9(?:[23][1-9]|4[15]|5[138]|6[1-3]|7[156]|8[189]|9(?:[1289]|3[34]|4[0178]))|(?:49|55|83)[29]|(?:264|837)[016-9]|2(?:57|93)[015-9]|(?:25[0468]|422|838)[01]|(?:47[59]|59[89]|8(?:6[68]|9))[019]", "1(?:1|5(?:4[018]|5[017])|77|88|9[69])|2(?:2[127]|3[0-269]|4[59]|5(?:[1-3]|5[0-69]|9(?:17|99))|6(?:2|4[016-9])|7(?:[1-35]|8[0189])|8(?:[16]|3[0134]|9[0-5])|9(?:[028]|17))|4(?:2(?:[13-79]|8[014-6])|3[0-57]|[45]|6[248]|7[2-47]|9[29])|5(?:2|3[045]|4[0-369]|5[29]|8[02389]|9[0-3])|7(?:2[02-46-9]|34|[58]|6[0249]|7[57]|9(?:[23]|4[0-59]|5[01569]|6[0167]))|8(?:2(?:[1258]|4[0-39]|9[0169])|3(?:[29]|7(?:[017-9]|6[6-8]))|49|51|6(?:[0-24]|36[23]|5(?:[0-389]|5[23])|6(?:[01]|9[178])|72|9[0145])|7[0-468]|8[68])|9(?:4[15]|5[138]|7[156]|8[189]|9(?:[1289]|3(?:31|4[357])|4[0178]))|(?:8294|96)[1-3]|2(?:57|93)[015-9]|(?:223|8699)[014-9]|(?:25[0468]|422|838)[01]|(?:48|8292|9[23])[1-9]|(?:47[59]|59[89]|8(?:68|9))[019]", "1(?:1|5(?:4[018]|5[017])|77|88|9[69])|2(?:2[127]|3[0-269]|4[59]|5(?:[1-3]|5[0-69]|7[015-9]|9(?:17|99))|6(?:2|4[016-9])|7(?:[1-35]|8[0189])|8(?:[16]|3[0134]|9[0-5])|9(?:[028]|17|3[015-9]))|4(?:2(?:[13-79]|8[014-6])|3[0-57]|[45]|6[248]|7[2-47]|9[29])|5(?:2|3[045]|4[0-369]|5[29]|8[02389]|9[0-3])|7(?:2[02-46-9]|34|[58]|6[0249]|7[57]|9(?:[23]|4[0-59]|5[01569]|6[0167]))|8(?:2(?:[1258]|4[0-39]|9(?:[019]|4[1-3]|6(?:[0-47-9]|5[01346-9])))|3(?:[29]|7(?:[017-9]|6[6-8]))|49|51|6(?:[0-24]|36[23]|5(?:[0-389]|5[23])|6(?:[01]|9[178])|72|9[0145])|7[0-468]|8[68])|9(?:4[15]|5[138]|6[1-3]|7[156]|8[189]|9(?:[1289]|3(?:31|4[357])|4[0178]))|(?:223|8699)[014-9]|(?:25[0468]|422|838)[01]|(?:48|829(?:2|66)|9[23])[1-9]|(?:47[59]|59[89]|8(?:68|9))[019]" ], "0$1" ], [ , "(\\d{3})(\\d{2})(\\d{4})", "$1-$2-$3", [ "[14]|[289][2-9]|5[3-9]|7[2-4679]" ], "0$1" ], [ , "(\\d{3})(\\d{3})(\\d{4})", "$1-$2-$3", [ "800" ], "0$1" ], [ , "(\\d{2})(\\d{4})(\\d{4})", "$1-$2-$3", [ "[257-9]" ], "0$1" ] ], [ , , "20\\d{8}", , , , "2012345678", , , [ 10 ] ], , , [ , , "00(?:777(?:[01]|(?:5|8\\d)\\d)|882[1245]\\d\\d)\\d\\d|00(?:37|66|78)\\d{6,13}" ], [ , , "570\\d{6}", , , , "570123456", , , [ 9 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            KE: [ , [ , , "(?:[17]\\d\\d|900)\\d{6}|(?:2|80)0\\d{6,7}|[4-6]\\d{6,8}", , , , , , , [ 7, 8, 9, 10 ] ], [ , , "(?:4[245]|5[1-79]|6[01457-9])\\d{5,7}|(?:4[136]|5[08]|62)\\d{7}|(?:[24]0|66)\\d{6,7}", , , , "202012345", , , [ 7, 8, 9 ] ], [ , , "(?:1(?:0[0-6]|1[0-5]|2[014])|7\\d\\d)\\d{6}", , , , "712123456", , , [ 9 ] ], [ , , "800[24-8]\\d{5,6}", , , , "800223456", , , [ 9, 10 ] ], [ , , "900[02-9]\\d{5}", , , , "900223456", , , [ 9 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "KE", 254, "000", "0", , , "0", , , , [ [ , "(\\d{2})(\\d{5,7})", "$1 $2", [ "[24-6]" ], "0$1" ], [ , "(\\d{3})(\\d{6})", "$1 $2", [ "[17]" ], "0$1" ], [ , "(\\d{3})(\\d{3})(\\d{3,4})", "$1 $2 $3", [ "[89]" ], "0$1" ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            KG: [ , [ , , "8\\d{9}|(?:[235-8]\\d|99)\\d{7}", , , , , , , [ 9, 10 ], [ 5, 6 ] ], [ , , "312(?:5[0-79]\\d|9(?:[0-689]\\d|7[0-24-9]))\\d{3}|(?:3(?:1(?:2[0-46-8]|3[1-9]|47|[56]\\d)|2(?:22|3[0-479]|6[0-7])|4(?:22|5[6-9]|6\\d)|5(?:22|3[4-7]|59|6\\d)|6(?:22|5[35-7]|6\\d)|7(?:22|3[468]|4[1-9]|59|[67]\\d)|9(?:22|4[1-8]|6\\d))|6(?:09|12|2[2-4])\\d)\\d{5}", , , , "312123456", , , [ 9 ], [ 5, 6 ] ], [ , , "312(?:58\\d|973)\\d{3}|(?:2(?:0[0-35]|2\\d)|5[0-24-7]\\d|7(?:[07]\\d|55)|880|99[05-9])\\d{6}", , , , "700123456", , , [ 9 ] ], [ , , "800\\d{6,7}", , , , "800123456" ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "KG", 996, "00", "0", , , "0", , , , [ [ , "(\\d{4})(\\d{5})", "$1 $2", [ "3(?:1[346]|[24-79])" ], "0$1" ], [ , "(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", [ "[235-79]|88" ], "0$1" ], [ , "(\\d{3})(\\d{3})(\\d)(\\d{2,3})", "$1 $2 $3 $4", [ "8" ], "0$1" ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            KH: [ , [ , , "1\\d{9}|[1-9]\\d{7,8}", , , , , , , [ 8, 9, 10 ], [ 6, 7 ] ], [ , , "23(?:4(?:[2-4]|[56]\\d)|[568]\\d\\d)\\d{4}|23[236-9]\\d{5}|(?:2[4-6]|3[2-6]|4[2-4]|[5-7][2-5])(?:(?:[237-9]|4[56]|5\\d)\\d{5}|6\\d{5,6})", , , , "23756789", , , [ 8, 9 ], [ 6, 7 ] ], [ , , "(?:(?:1[28]|3[18]|9[67])\\d|6[016-9]|7(?:[07-9]|[16]\\d)|8(?:[013-79]|8\\d))\\d{6}|(?:1\\d|9[0-57-9])\\d{6}|(?:2[3-6]|3[2-6]|4[2-4]|[5-7][2-5])48\\d{5}", , , , "91234567", , , [ 8, 9 ] ], [ , , "1800(?:1\\d|2[019])\\d{4}", , , , "1800123456", , , [ 10 ] ], [ , , "1900(?:1\\d|2[09])\\d{4}", , , , "1900123456", , , [ 10 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "KH", 855, "00[14-9]", "0", , , "0", , , , [ [ , "(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", [ "[1-9]" ], "0$1" ], [ , "(\\d{4})(\\d{3})(\\d{3})", "$1 $2 $3", [ "1" ] ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            KI: [ , [ , , "(?:[37]\\d|6[0-79])\\d{6}|(?:[2-48]\\d|50)\\d{3}", , , , , , , [ 5, 8 ] ], [ , , "(?:[24]\\d|3[1-9]|50|65(?:02[12]|12[56]|22[89]|[3-5]00)|7(?:27\\d\\d|3100|5(?:02[12]|12[56]|22[89]|[34](?:00|81)|500))|8[0-5])\\d{3}", , , , "31234" ], [ , , "(?:63\\d{3}|73(?:0[0-5]\\d|140))\\d{3}|[67]200[01]\\d{3}", , , , "72001234", , , [ 8 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , "30(?:0[01]\\d\\d|12(?:11|20))\\d\\d", , , , "30010000", , , [ 8 ] ], "KI", 686, "00", "0", , , "0", , , , , , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            KM: [ , [ , , "[3478]\\d{6}", , , , , , , [ 7 ], [ 4 ] ], [ , , "7[4-7]\\d{5}", , , , "7712345", , , , [ 4 ] ], [ , , "[34]\\d{6}", , , , "3212345" ], [ , , , , , , , , , [ -1 ] ], [ , , "8\\d{6}", , , , "8001234" ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "KM", 269, "00", , , , , , , , [ [ , "(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3", [ "[3478]" ] ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            KN: [ , [ , , "(?:[58]\\d\\d|900)\\d{7}", , , , , , , [ 10 ], [ 7 ] ], [ , , "869(?:2(?:29|36)|302|4(?:6[015-9]|70)|56[5-7])\\d{4}", , , , "8692361234", , , , [ 7 ] ], [ , , "869(?:48[89]|55[6-8]|66\\d|76[02-7])\\d{4}", , , , "8697652917", , , , [ 7 ] ], [ , , "8(?:00|33|44|55|66|77|88)[2-9]\\d{6}", , , , "8002123456" ], [ , , "900[2-9]\\d{6}", , , , "9002123456" ], [ , , , , , , , , , [ -1 ] ], [ , , "52(?:3(?:[2-46-9][02-9]\\d|5(?:[02-46-9]\\d|5[0-46-9]))|4(?:[2-478][02-9]\\d|5(?:[034]\\d|2[024-9]|5[0-46-9])|6(?:0[1-9]|[2-9]\\d)|9(?:[05-9]\\d|2[0-5]|49)))\\d{4}|52[34][2-9]1[02-9]\\d{4}|5(?:00|2[12]|33|44|66|77|88)[2-9]\\d{6}", , , , "5002345678" ], [ , , , , , , , , , [ -1 ] ], "KN", 1, "011", "1", , , "1|([2-7]\\d{6})$", "869$1", , , , , [ , , , , , , , , , [ -1 ] ], , "869", [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            KP: [ , [ , , "85\\d{6}|(?:19\\d|[2-7])\\d{7}", , , , , , , [ 8, 10 ], [ 6, 7 ] ], [ , , "(?:(?:195|2)\\d|3[19]|4[159]|5[37]|6[17]|7[39]|85)\\d{6}", , , , "21234567", , , , [ 6, 7 ] ], [ , , "19[1-3]\\d{7}", , , , "1921234567", , , [ 10 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "KP", 850, "00|99", "0", , , "0", , , , [ [ , "(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", [ "8" ], "0$1" ], [ , "(\\d)(\\d{3})(\\d{4})", "$1 $2 $3", [ "[2-7]" ], "0$1" ], [ , "(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", [ "1" ], "0$1" ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , "238[02-9]\\d{4}|2(?:[0-24-9]\\d|3[0-79])\\d{5}", , , , , , , [ 8 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            KR: [ , [ , , "00[1-9]\\d{8,11}|(?:[12]|5\\d{3})\\d{7}|[13-6]\\d{9}|(?:[1-6]\\d|80)\\d{7}|[3-6]\\d{4,5}|(?:00|7)0\\d{8}", , , , , , , [ 5, 6, 8, 9, 10, 11, 12, 13, 14 ], [ 3, 4, 7 ] ], [ , , "(?:2|3[1-3]|[46][1-4]|5[1-5])[1-9]\\d{6,7}|(?:3[1-3]|[46][1-4]|5[1-5])1\\d{2,3}", , , , "22123456", , , [ 5, 6, 8, 9, 10 ], [ 3, 4, 7 ] ], [ , , "1(?:05(?:[0-8]\\d|9[0-6])|22[13]\\d)\\d{4,5}|1(?:0[1-46-9]|[16-9]\\d|2[013-9])\\d{6,7}", , , , "1020000000", , , [ 9, 10 ] ], [ , , "00(?:308\\d{6,7}|798\\d{7,9})|(?:00368|80)\\d{7}", , , , "801234567", , , [ 9, 11, 12, 13, 14 ] ], [ , , "60[2-9]\\d{6}", , , , "602345678", , , [ 9 ] ], [ , , , , , , , , , [ -1 ] ], [ , , "50\\d{8,9}", , , , "5012345678", , , [ 10, 11 ] ], [ , , "70\\d{8}", , , , "7012345678", , , [ 10 ] ], "KR", 82, "00(?:[125689]|3(?:[46]5|91)|7(?:00|27|3|55|6[126]))", "0", , , "0(8(?:[1-46-8]|5\\d\\d))?", , , , [ [ , "(\\d{5})", "$1", [ "1[016-9]1", "1[016-9]11", "1[016-9]114" ], "0$1" ], [ , "(\\d{2})(\\d{3,4})", "$1-$2", [ "(?:3[1-3]|[46][1-4]|5[1-5])1" ], "0$1", "0$CC-$1" ], [ , "(\\d{4})(\\d{4})", "$1-$2", [ "1" ] ], [ , "(\\d)(\\d{3,4})(\\d{4})", "$1-$2-$3", [ "2" ], "0$1", "0$CC-$1" ], [ , "(\\d{2})(\\d{3})(\\d{4})", "$1-$2-$3", [ "60|8" ], "0$1", "0$CC-$1" ], [ , "(\\d{2})(\\d{3,4})(\\d{4})", "$1-$2-$3", [ "[1346]|5[1-5]" ], "0$1", "0$CC-$1" ], [ , "(\\d{2})(\\d{4})(\\d{4})", "$1-$2-$3", [ "[57]" ], "0$1", "0$CC-$1" ], [ , "(\\d{5})(\\d{3})(\\d{3})", "$1 $2 $3", [ "003", "0030" ] ], [ , "(\\d{2})(\\d{5})(\\d{4})", "$1-$2-$3", [ "5" ], "0$1", "0$CC-$1" ], [ , "(\\d{5})(\\d{3,4})(\\d{4})", "$1 $2 $3", [ "0" ] ], [ , "(\\d{5})(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3 $4", [ "0" ] ] ], [ [ , "(\\d{2})(\\d{3,4})", "$1-$2", [ "(?:3[1-3]|[46][1-4]|5[1-5])1" ], "0$1", "0$CC-$1" ], [ , "(\\d{4})(\\d{4})", "$1-$2", [ "1" ] ], [ , "(\\d)(\\d{3,4})(\\d{4})", "$1-$2-$3", [ "2" ], "0$1", "0$CC-$1" ], [ , "(\\d{2})(\\d{3})(\\d{4})", "$1-$2-$3", [ "60|8" ], "0$1", "0$CC-$1" ], [ , "(\\d{2})(\\d{3,4})(\\d{4})", "$1-$2-$3", [ "[1346]|5[1-5]" ], "0$1", "0$CC-$1" ], [ , "(\\d{2})(\\d{4})(\\d{4})", "$1-$2-$3", [ "[57]" ], "0$1", "0$CC-$1" ], [ , "(\\d{2})(\\d{5})(\\d{4})", "$1-$2-$3", [ "5" ], "0$1", "0$CC-$1" ] ], [ , , "15\\d{7,8}", , , , "1523456789", , , [ 9, 10 ] ], , , [ , , "00(?:3(?:08\\d{6,7}|68\\d{7})|798\\d{7,9})", , , , , , , [ 11, 12, 13, 14 ] ], [ , , "1(?:5(?:22|33|44|66|77|88|99)|6(?:[07]0|44|6[16]|88)|8(?:00|33|55|77|99))\\d{4}", , , , "15441234", , , [ 8 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            KW: [ , [ , , "18\\d{5}|(?:[2569]\\d|41)\\d{6}", , , , , , , [ 7, 8 ] ], [ , , "2(?:[23]\\d\\d|4(?:[1-35-9]\\d|44)|5(?:0[034]|[2-46]\\d|5[1-3]|7[1-7]))\\d{4}", , , , "22345678", , , [ 8 ] ], [ , , "(?:41\\d\\d|5(?:(?:[05]\\d|1[0-7]|6[56])\\d|2(?:22|5[25])|7(?:55|77)|88[58])|6(?:(?:0[034679]|5[015-9]|6\\d)\\d|222|333|444|7(?:0[013-9]|[67]\\d)|888|9(?:[069]\\d|3[039]))|9(?:(?:0[09]|22|[4679]\\d|8[057-9])\\d|1(?:1[01]|99)|3(?:00|33)|5(?:00|5\\d)))\\d{4}", , , , "50012345", , , [ 8 ] ], [ , , "18\\d{5}", , , , "1801234", , , [ 7 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "KW", 965, "00", , , , , , , , [ [ , "(\\d{4})(\\d{3,4})", "$1 $2", [ "[169]|2(?:[235]|4[1-35-9])|52" ] ], [ , "(\\d{3})(\\d{5})", "$1 $2", [ "[245]" ] ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            KY: [ , [ , , "(?:345|[58]\\d\\d|900)\\d{7}", , , , , , , [ 10 ], [ 7 ] ], [ , , "345(?:2(?:22|3[23]|44|66)|333|444|6(?:23|38|40)|7(?:30|4[35-79]|6[6-9]|77)|8(?:00|1[45]|25|[48]8)|9(?:14|4[035-9]))\\d{4}", , , , "3452221234", , , , [ 7 ] ], [ , , "345(?:32[1-9]|42[0-4]|5(?:1[67]|2[5-79]|4[6-9]|50|76)|649|9(?:1[679]|2[2-9]|3[06-9]|90))\\d{4}", , , , "3453231234", , , , [ 7 ] ], [ , , "8(?:00|33|44|55|66|77|88)[2-9]\\d{6}", , , , "8002345678" ], [ , , "(?:345976|900[2-9]\\d\\d)\\d{4}", , , , "9002345678" ], [ , , , , , , , , , [ -1 ] ], [ , , "52(?:3(?:[2-46-9][02-9]\\d|5(?:[02-46-9]\\d|5[0-46-9]))|4(?:[2-478][02-9]\\d|5(?:[034]\\d|2[024-9]|5[0-46-9])|6(?:0[1-9]|[2-9]\\d)|9(?:[05-9]\\d|2[0-5]|49)))\\d{4}|52[34][2-9]1[02-9]\\d{4}|5(?:00|2[12]|33|44|66|77|88)[2-9]\\d{6}", , , , "5002345678" ], [ , , , , , , , , , [ -1 ] ], "KY", 1, "011", "1", , , "1|([2-9]\\d{6})$", "345$1", , , , , [ , , "345849\\d{4}", , , , "3458491234" ], , "345", [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            KZ: [ , [ , , "(?:33622|8\\d{8})\\d{5}|[78]\\d{9}", , , , , , , [ 10, 14 ], [ 5, 6, 7 ] ], [ , , "(?:33622|7(?:1(?:0(?:[23]\\d|4[0-3]|59|63)|1(?:[23]\\d|4[0-79]|59)|2(?:[23]\\d|59)|3(?:2\\d|3[0-79]|4[0-35-9]|59)|4(?:[24]\\d|3[013-9]|5[1-9])|5(?:2\\d|3[1-9]|4[0-7]|59)|6(?:[2-4]\\d|5[19]|61)|72\\d|8(?:[27]\\d|3[1-46-9]|4[0-5]))|2(?:1(?:[23]\\d|4[46-9]|5[3469])|2(?:2\\d|3[0679]|46|5[12679])|3(?:[2-4]\\d|5[139])|4(?:2\\d|3[1-35-9]|59)|5(?:[23]\\d|4[0-246-8]|59|61)|6(?:2\\d|3[1-9]|4[0-4]|59)|7(?:[2379]\\d|40|5[279])|8(?:[23]\\d|4[0-3]|59)|9(?:2\\d|3[124578]|59))))\\d{5}", , , , "7123456789", , , [ 10 ], [ 5, 6, 7 ] ], [ , , "7(?:0[0-25-8]|47|6[0-4]|7[15-8]|85)\\d{7}", , , , "7710009998", , , [ 10 ] ], [ , , "8(?:00|108\\d{3})\\d{7}", , , , "8001234567" ], [ , , "809\\d{7}", , , , "8091234567", , , [ 10 ] ], [ , , , , , , , , , [ -1 ] ], [ , , "808\\d{7}", , , , "8081234567", , , [ 10 ] ], [ , , "751\\d{7}", , , , "7511234567", , , [ 10 ] ], "KZ", 7, "810", "8", , , "8", , "8~10", , , , [ , , , , , , , , , [ -1 ] ], , "33|7", [ , , "751\\d{7}", , , , , , , [ 10 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            LA: [ , [ , , "[23]\\d{9}|3\\d{8}|(?:[235-8]\\d|41)\\d{6}", , , , , , , [ 8, 9, 10 ], [ 6 ] ], [ , , "(?:2[13]|[35-7][14]|41|8[1468])\\d{6}", , , , "21212862", , , [ 8 ], [ 6 ] ], [ , , "(?:20(?:[239]\\d|5[24-9]|7[6-8])|302\\d)\\d{6}", , , , "2023123456", , , [ 10 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "LA", 856, "00", "0", , , "0", , , , [ [ , "(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", [ "2[13]|3[14]|[4-8]" ], "0$1" ], [ , "(\\d{2})(\\d{2})(\\d{2})(\\d{3})", "$1 $2 $3 $4", [ "30[013-9]" ], "0$1" ], [ , "(\\d{2})(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3 $4", [ "[23]" ], "0$1" ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , "30[013-9]\\d{6}", , , , "301234567", , , [ 9 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            LB: [ , [ , , "[27-9]\\d{7}|[13-9]\\d{6}", , , , , , , [ 7, 8 ] ], [ , , "7(?:62|8[0-7]|9[04-9])\\d{4}|(?:[14-69]\\d|2(?:[14-69]\\d|[78][1-9])|7[2-57]|8[02-9])\\d{5}", , , , "1123456" ], [ , , "793(?:[01]\\d|2[0-4])\\d{3}|(?:(?:3|81)\\d|7(?:[01]\\d|6[013-9]|8[89]|9[12]))\\d{5}", , , , "71123456" ], [ , , , , , , , , , [ -1 ] ], [ , , "9[01]\\d{6}", , , , "90123456", , , [ 8 ] ], [ , , "80\\d{6}", , , , "80123456", , , [ 8 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "LB", 961, "00", "0", , , "0", , , , [ [ , "(\\d)(\\d{3})(\\d{3})", "$1 $2 $3", [ "[13-69]|7(?:[2-57]|62|8[0-7]|9[04-9])|8[02-9]" ], "0$1" ], [ , "(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", [ "[27-9]" ] ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            LC: [ , [ , , "(?:[58]\\d\\d|758|900)\\d{7}", , , , , , , [ 10 ], [ 7 ] ], [ , , "758(?:234|4(?:30|5\\d|6[2-9]|8[0-2])|57[0-2]|(?:63|75)8)\\d{4}", , , , "7584305678", , , , [ 7 ] ], [ , , "758(?:28[4-7]|384|4(?:6[01]|8[4-9])|5(?:1[89]|20|84)|7(?:1[2-9]|2\\d|3[0-3])|812)\\d{4}", , , , "7582845678", , , , [ 7 ] ], [ , , "8(?:00|33|44|55|66|77|88)[2-9]\\d{6}", , , , "8002123456" ], [ , , "900[2-9]\\d{6}", , , , "9002123456" ], [ , , , , , , , , , [ -1 ] ], [ , , "52(?:3(?:[2-46-9][02-9]\\d|5(?:[02-46-9]\\d|5[0-46-9]))|4(?:[2-478][02-9]\\d|5(?:[034]\\d|2[024-9]|5[0-46-9])|6(?:0[1-9]|[2-9]\\d)|9(?:[05-9]\\d|2[0-5]|49)))\\d{4}|52[34][2-9]1[02-9]\\d{4}|5(?:00|2[12]|33|44|66|77|88)[2-9]\\d{6}", , , , "5002345678" ], [ , , , , , , , , , [ -1 ] ], "LC", 1, "011", "1", , , "1|([2-8]\\d{6})$", "758$1", , , , , [ , , , , , , , , , [ -1 ] ], , "758", [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            LI: [ , [ , , "[68]\\d{8}|(?:[2378]\\d|90)\\d{5}", , , , , , , [ 7, 9 ] ], [ , , "(?:2(?:01|1[27]|2[02]|3\\d|6[02-578]|96)|3(?:[24]0|33|7[0135-7]|8[048]|9[0269]))\\d{4}", , , , "2345678", , , [ 7 ] ], [ , , "(?:6(?:4(?:5[4-9]|[6-9]\\d)|5[0-4]\\d|6(?:[0245]\\d|[17]0|3[7-9]))\\d|7(?:[37-9]\\d|42|56))\\d{4}", , , , "660234567" ], [ , , "8002[28]\\d\\d|80(?:05\\d|9)\\d{4}", , , , "8002222" ], [ , , "90(?:02[258]|1(?:23|3[14])|66[136])\\d\\d", , , , "9002222", , , [ 7 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "LI", 423, "00", "0", , , "0|(1001)", , , , [ [ , "(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3", [ "[2379]|8(?:0[09]|7)", "[2379]|8(?:0(?:02|9)|7)" ], , "$CC $1" ], [ , "(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", [ "8" ] ], [ , "(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", [ "69" ], , "$CC $1" ], [ , "(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", [ "6" ], , "$CC $1" ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , "870(?:28|87)\\d\\d", , , , "8702812", , , [ 7 ] ], , , [ , , "697(?:42|56|[78]\\d)\\d{4}", , , , "697861234", , , [ 9 ] ] ],
            LK: [ , [ , , "[1-9]\\d{8}", , , , , , , [ 9 ], [ 7 ] ], [ , , "(?:12[2-9]|602|8[12]\\d|9(?:1\\d|22|9[245]))\\d{6}|(?:11|2[13-7]|3[1-8]|4[157]|5[12457]|6[35-7])[2-57]\\d{6}", , , , "112345678", , , , [ 7 ] ], [ , , "7(?:[0-25-8]\\d|4[0-4])\\d{6}", , , , "712345678" ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "LK", 94, "00", "0", , , "0", , , , [ [ , "(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", [ "7" ], "0$1" ], [ , "(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", [ "[1-689]" ], "0$1" ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , "1973\\d{5}", , , , "197312345" ], , , [ , , , , , , , , , [ -1 ] ] ],
            LR: [ , [ , , "(?:2|33|5\\d|77|88)\\d{7}|[4-6]\\d{6}", , , , , , , [ 7, 8, 9 ] ], [ , , "(?:2\\d{3}|33333)\\d{4}", , , , "21234567", , , [ 8, 9 ] ], [ , , "(?:(?:330|555|(?:77|88)\\d)\\d|4[67])\\d{5}|[56]\\d{6}", , , , "770123456", , , [ 7, 9 ] ], [ , , , , , , , , , [ -1 ] ], [ , , "332(?:02|[34]\\d)\\d{4}", , , , "332021234", , , [ 9 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "LR", 231, "00", "0", , , "0", , , , [ [ , "(\\d)(\\d{3})(\\d{3})", "$1 $2 $3", [ "[4-6]" ], "0$1" ], [ , "(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", [ "2" ], "0$1" ], [ , "(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", [ "[3578]" ], "0$1" ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            LS: [ , [ , , "(?:[256]\\d\\d|800)\\d{5}", , , , , , , [ 8 ] ], [ , , "2\\d{7}", , , , "22123456" ], [ , , "[56]\\d{7}", , , , "50123456" ], [ , , "800[256]\\d{4}", , , , "80021234" ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "LS", 266, "00", , , , , , , , [ [ , "(\\d{4})(\\d{4})", "$1 $2", [ "[2568]" ] ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            LT: [ , [ , , "(?:[3469]\\d|52|[78]0)\\d{6}", , , , , , , [ 8 ] ], [ , , "(?:3[1478]|4[124-6]|52)\\d{6}", , , , "31234567" ], [ , , "6\\d{7}", , , , "61234567" ], [ , , "80[02]\\d{5}", , , , "80012345" ], [ , , "9(?:0[0239]|10)\\d{5}", , , , "90012345" ], [ , , "808\\d{5}", , , , "80812345" ], [ , , "70[05]\\d{5}", , , , "70012345" ], [ , , "[89]01\\d{5}", , , , "80123456" ], "LT", 370, "00", "8", , , "[08]", , , , [ [ , "(\\d)(\\d{3})(\\d{4})", "$1 $2 $3", [ "52[0-7]" ], "(8-$1)", , 1 ], [ , "(\\d{3})(\\d{2})(\\d{3})", "$1 $2 $3", [ "[7-9]" ], "8 $1", , 1 ], [ , "(\\d{2})(\\d{6})", "$1 $2", [ "37|4(?:[15]|6[1-8])" ], "(8-$1)", , 1 ], [ , "(\\d{3})(\\d{5})", "$1 $2", [ "[3-6]" ], "(8-$1)", , 1 ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , "70[67]\\d{5}", , , , "70712345" ], , , [ , , , , , , , , , [ -1 ] ] ],
            LU: [ , [ , , "35[013-9]\\d{4,8}|6\\d{8}|35\\d{2,4}|(?:[2457-9]\\d|3[0-46-9])\\d{2,9}", , , , , , , [ 4, 5, 6, 7, 8, 9, 10, 11 ] ], [ , , "(?:35[013-9]|80[2-9]|90[89])\\d{1,8}|(?:2[2-9]|3[0-46-9]|[457]\\d|8[13-9]|9[2-579])\\d{2,9}", , , , "27123456" ], [ , , "6(?:[269][18]|5[1568]|7[189]|81)\\d{6}", , , , "628123456", , , [ 9 ] ], [ , , "800\\d{5}", , , , "80012345", , , [ 8 ] ], [ , , "90[015]\\d{5}", , , , "90012345", , , [ 8 ] ], [ , , "801\\d{5}", , , , "80112345", , , [ 8 ] ], [ , , , , , , , , , [ -1 ] ], [ , , "20(?:1\\d{5}|[2-689]\\d{1,7})", , , , "20201234", , , [ 4, 5, 6, 7, 8, 9, 10 ] ], "LU", 352, "00", , , , "(15(?:0[06]|1[12]|[35]5|4[04]|6[26]|77|88|99)\\d)", , , , [ [ , "(\\d{2})(\\d{3})", "$1 $2", [ "2(?:0[2-689]|[2-9])|[3-57]|8(?:0[2-9]|[13-9])|9(?:0[89]|[2-579])" ], , "$CC $1" ], [ , "(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3", [ "2(?:0[2-689]|[2-9])|[3-57]|8(?:0[2-9]|[13-9])|9(?:0[89]|[2-579])" ], , "$CC $1" ], [ , "(\\d{2})(\\d{2})(\\d{3})", "$1 $2 $3", [ "20[2-689]" ], , "$CC $1" ], [ , "(\\d{2})(\\d{2})(\\d{2})(\\d{1,2})", "$1 $2 $3 $4", [ "2(?:[0367]|4[3-8])" ], , "$CC $1" ], [ , "(\\d{3})(\\d{2})(\\d{3})", "$1 $2 $3", [ "80[01]|90[015]" ], , "$CC $1" ], [ , "(\\d{2})(\\d{2})(\\d{2})(\\d{3})", "$1 $2 $3 $4", [ "20" ], , "$CC $1" ], [ , "(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", [ "6" ], , "$CC $1" ], [ , "(\\d{2})(\\d{2})(\\d{2})(\\d{2})(\\d{1,2})", "$1 $2 $3 $4 $5", [ "2(?:[0367]|4[3-8])" ], , "$CC $1" ], [ , "(\\d{2})(\\d{2})(\\d{2})(\\d{1,5})", "$1 $2 $3 $4", [ "[3-57]|8[13-9]|9(?:0[89]|[2-579])|(?:2|80)[2-9]" ], , "$CC $1" ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            LV: [ , [ , , "(?:[268]\\d|90)\\d{6}", , , , , , , [ 8 ] ], [ , , "6\\d{7}", , , , "63123456" ], [ , , "2\\d{7}", , , , "21234567" ], [ , , "80\\d{6}", , , , "80123456" ], [ , , "90\\d{6}", , , , "90123456" ], [ , , "81\\d{6}", , , , "81123456" ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "LV", 371, "00", , , , , , , , [ [ , "(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", [ "[269]|8[01]" ] ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            LY: [ , [ , , "[2-9]\\d{8}", , , , , , , [ 9 ], [ 7 ] ], [ , , "(?:2(?:0[56]|[1-6]\\d|7[124579]|8[124])|3(?:1\\d|2[2356])|4(?:[17]\\d|2[1-357]|5[2-4]|8[124])|5(?:[1347]\\d|2[1-469]|5[13-5]|8[1-4])|6(?:[1-479]\\d|5[2-57]|8[1-5])|7(?:[13]\\d|2[13-79])|8(?:[124]\\d|5[124]|84))\\d{6}", , , , "212345678", , , , [ 7 ] ], [ , , "9[1-6]\\d{7}", , , , "912345678" ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "LY", 218, "00", "0", , , "0", , , , [ [ , "(\\d{2})(\\d{7})", "$1-$2", [ "[2-9]" ], "0$1" ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            MA: [ , [ , , "[5-8]\\d{8}", , , , , , , [ 9 ] ], [ , , "5(?:29(?:[189][05]|2[29]|3[01])|38[89][05])\\d{4}|5(?:2(?:[0-25-7]\\d|3[1-578]|4[02-46-8]|8[0235-7]|90)|3(?:[0-47]\\d|5[02-9]|6[02-8]|80|9[3-9])|(?:4[067]|5[03])\\d)\\d{5}", , , , "520123456" ], [ , , "(?:6(?:[0-79]\\d|8[0-247-9])|7(?:[01]\\d|6[1267]|7[0-57]))\\d{6}", , , , "650123456" ], [ , , "80\\d{7}", , , , "801234567" ], [ , , "89\\d{7}", , , , "891234567" ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , "592(?:4[0-2]|93)\\d{4}", , , , "592401234" ], "MA", 212, "00", "0", , , "0", , , , [ [ , "(\\d{5})(\\d{4})", "$1-$2", [ "5(?:29|38)", "5(?:29|38)[89]", "5(?:29|38)[89]0" ], "0$1" ], [ , "(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", [ "5[45]" ], "0$1" ], [ , "(\\d{4})(\\d{5})", "$1-$2", [ "5(?:2[2-489]|3[5-9]|9)|892", "5(?:2(?:[2-49]|8[235-9])|3[5-9]|9)|892" ], "0$1" ], [ , "(\\d{2})(\\d{7})", "$1-$2", [ "8" ], "0$1" ], [ , "(\\d{3})(\\d{6})", "$1-$2", [ "[5-7]" ], "0$1" ] ], , [ , , , , , , , , , [ -1 ] ], 1, , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            MC: [ , [ , , "(?:[3489]|6\\d)\\d{7}", , , , , , , [ 8, 9 ] ], [ , , "(?:870|9[2-47-9]\\d)\\d{5}", , , , "99123456", , , [ 8 ] ], [ , , "4(?:[46]\\d|5[1-9])\\d{5}|(?:3|6\\d)\\d{7}", , , , "612345678" ], [ , , "(?:800|90\\d)\\d{5}", , , , "90123456", , , [ 8 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "MC", 377, "00", "0", , , "0", , , , [ [ , "(\\d{3})(\\d{3})(\\d{2})", "$1 $2 $3", [ "87" ] ], [ , "(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", [ "4" ], "0$1" ], [ , "(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", [ "[389]" ] ], [ , "(\\d)(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4 $5", [ "6" ], "0$1" ] ], [ [ , "(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", [ "4" ], "0$1" ], [ , "(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", [ "[389]" ] ], [ , "(\\d)(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4 $5", [ "6" ], "0$1" ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , "8[07]0\\d{5}", , , , , , , [ 8 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            MD: [ , [ , , "(?:[235-7]\\d|[89]0)\\d{6}", , , , , , , [ 8 ] ], [ , , "(?:(?:2[1-9]|3[1-79])\\d|5(?:33|5[257]))\\d{5}", , , , "22212345" ], [ , , "562\\d{5}|(?:6\\d|7[16-9])\\d{6}", , , , "62112345" ], [ , , "800\\d{5}", , , , "80012345" ], [ , , "90[056]\\d{5}", , , , "90012345" ], [ , , "808\\d{5}", , , , "80812345" ], [ , , , , , , , , , [ -1 ] ], [ , , "3[08]\\d{6}", , , , "30123456" ], "MD", 373, "00", "0", , , "0", , , , [ [ , "(\\d{3})(\\d{5})", "$1 $2", [ "[89]" ], "0$1" ], [ , "(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", [ "22|3" ], "0$1" ], [ , "(\\d{3})(\\d{2})(\\d{3})", "$1 $2 $3", [ "[25-7]" ], "0$1" ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , "803\\d{5}", , , , "80312345" ], , , [ , , , , , , , , , [ -1 ] ] ],
            ME: [ , [ , , "(?:20|[3-79]\\d)\\d{6}|80\\d{6,7}", , , , , , , [ 8, 9 ], [ 6 ] ], [ , , "(?:20[2-8]|3(?:[0-2][2-7]|3[24-7])|4(?:0[2-467]|1[2467])|5(?:0[2467]|1[24-7]|2[2-467]))\\d{5}", , , , "30234567", , , [ 8 ], [ 6 ] ], [ , , "6(?:[07-9]\\d|3[024]|6[0-25])\\d{5}", , , , "67622901", , , [ 8 ] ], [ , , "80(?:[0-2578]|9\\d)\\d{5}", , , , "80080002" ], [ , , "9(?:4[1568]|5[178])\\d{5}", , , , "94515151", , , [ 8 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , "78[1-49]\\d{5}", , , , "78108780", , , [ 8 ] ], "ME", 382, "00", "0", , , "0", , , , [ [ , "(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", [ "[2-9]" ], "0$1" ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , "77[1-9]\\d{5}", , , , "77273012", , , [ 8 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            MF: [ , [ , , "(?:590|(?:69|80)\\d|976)\\d{6}", , , , , , , [ 9 ] ], [ , , "590(?:0[079]|[14]3|[27][79]|30|5[0-268]|87)\\d{4}", , , , "590271234" ], [ , , "69(?:0\\d\\d|1(?:2[2-9]|3[0-5]))\\d{4}", , , , "690001234" ], [ , , "80[0-5]\\d{6}", , , , "800012345" ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , "976[01]\\d{5}", , , , "976012345" ], "MF", 590, "00", "0", , , "0", , , , , , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            MG: [ , [ , , "[23]\\d{8}", , , , , , , [ 9 ], [ 7 ] ], [ , , "2072[29]\\d{4}|20(?:2\\d|4[47]|5[3467]|6[279]|7[35]|8[268]|9[245])\\d{5}", , , , "202123456", , , , [ 7 ] ], [ , , "3[2-489]\\d{7}", , , , "321234567" ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , "22\\d{7}", , , , "221234567" ], "MG", 261, "00", "0", , , "0|([24-9]\\d{6})$", "20$1", , , [ [ , "(\\d{2})(\\d{2})(\\d{3})(\\d{2})", "$1 $2 $3 $4", [ "[23]" ], "0$1" ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            MH: [ , [ , , "329\\d{4}|(?:[256]\\d|45)\\d{5}", , , , , , , [ 7 ] ], [ , , "(?:247|528|625)\\d{4}", , , , "2471234" ], [ , , "(?:(?:23|54)5|329|45[56])\\d{4}", , , , "2351234" ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , "635\\d{4}", , , , "6351234" ], "MH", 692, "011", "1", , , "1", , , , [ [ , "(\\d{3})(\\d{4})", "$1-$2", [ "[2-6]" ] ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            MK: [ , [ , , "[2-578]\\d{7}", , , , , , , [ 8 ], [ 6, 7 ] ], [ , , "(?:2(?:[23]\\d|5[0-24578]|6[01]|82)|3(?:1[3-68]|[23][2-68]|4[23568])|4(?:[23][2-68]|4[3-68]|5[2568]|6[25-8]|7[24-68]|8[4-68]))\\d{5}", , , , "22012345", , , , [ 6, 7 ] ], [ , , "7(?:3555|4(?:60\\d|747)|94(?:[01]\\d|2[0-4]))\\d{3}|7(?:[0-25-8]\\d|3[2-4]|42|9[23])\\d{5}", , , , "72345678" ], [ , , "800\\d{5}", , , , "80012345" ], [ , , "5[02-9]\\d{6}", , , , "50012345" ], [ , , "8(?:0[1-9]|[1-9]\\d)\\d{5}", , , , "80123456" ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "MK", 389, "00", "0", , , "0", , , , [ [ , "(\\d)(\\d{3})(\\d{4})", "$1 $2 $3", [ "2" ], "0$1" ], [ , "(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", [ "[347]" ], "0$1" ], [ , "(\\d{3})(\\d)(\\d{2})(\\d{2})", "$1 $2 $3 $4", [ "[58]" ], "0$1" ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            ML: [ , [ , , "[24-9]\\d{7}", , , , , , , [ 8 ] ], [ , , "2(?:07[0-8]|12[67])\\d{4}|(?:2(?:02|1[4-689])|4(?:0[0-4]|4[1-39]))\\d{5}", , , , "20212345" ], [ , , "2(?:0(?:01|79)|17\\d)\\d{4}|(?:5[01]|[679]\\d|8[239])\\d{6}", , , , "65012345" ], [ , , "80\\d{6}", , , , "80012345" ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "ML", 223, "00", , , , , , , , [ [ , "(\\d{4})", "$1", [ "67[057-9]|74[045]", "67(?:0[09]|[59]9|77|8[89])|74(?:0[02]|44|55)" ] ], [ , "(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", [ "[24-9]" ] ] ], [ [ , "(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", [ "[24-9]" ] ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , "80\\d{6}" ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            MM: [ , [ , , "1\\d{5,7}|95\\d{6}|(?:[4-7]|9[0-46-9])\\d{6,8}|(?:2|8\\d)\\d{5,8}", , , , , , , [ 6, 7, 8, 9, 10 ], [ 5 ] ], [ , , "(?:1(?:(?:2\\d|3[56]|[89][0-6])\\d|4(?:2[2-469]|39|46|6[25]|7[0-3]|83)|6)|2(?:2(?:00|8[34])|4(?:0\\d|2[246]|39|46|62|7[0-3]|83)|51\\d\\d)|4(?:2(?:2\\d\\d|48[0-3])|3(?:20\\d|4(?:70|83)|56)|420\\d|5470)|6(?:0(?:[23]|88\\d)|(?:124|[56]2\\d)\\d|247[23]|3(?:20\\d|470)|4(?:2[04]\\d|47[23])|7(?:(?:3\\d|8[01459])\\d|4(?:39|60|7[013]))))\\d{4}|5(?:2(?:2\\d{5,6}|47[023]\\d{4})|(?:347[23]|4(?:2(?:1|86)|470)|522\\d|6(?:20\\d|483)|7(?:20\\d|48[0-2])|8(?:20\\d|47[02])|9(?:20\\d|47[01]))\\d{4})|7(?:(?:0470|4(?:25\\d|470)|5(?:202|470|96\\d))\\d{4}|1(?:20\\d{4,5}|4(?:70|83)\\d{4}))|8(?:1(?:2\\d{5,6}|4(?:10|7[01]\\d)\\d{3})|2(?:2\\d{5,6}|(?:320|490\\d)\\d{3})|(?:3(?:2\\d\\d|470)|4[24-7]|5(?:2\\d|4[1-9]|51)\\d|6[23])\\d{4})|(?:1[2-6]\\d|4(?:2[24-8]|3[2-7]|[46][2-6]|5[3-5])|5(?:[27][2-8]|3[2-68]|4[24-8]|5[23]|6[2-4]|8[24-7]|9[2-7])|6(?:[19]20|42[03-6]|(?:52|7[45])\\d)|7(?:[04][24-8]|[15][2-7]|22|3[2-4])|8(?:1[2-689]|2[2-8]|[35]2\\d))\\d{4}|25\\d{5,6}|(?:2[2-9]|6(?:1[2356]|[24][2-6]|3[24-6]|5[2-4]|6[2-8]|7[235-7]|8[245]|9[24])|8(?:3[24]|5[245]))\\d{4}", , , , "1234567", , , [ 6, 7, 8, 9 ], [ 5 ] ], [ , , "(?:17[01]|9(?:2(?:[0-4]|[56]\\d\\d)|(?:3(?:[0-36]|4\\d)|(?:6\\d|8[89]|9[4-8])\\d|7(?:3|40|[5-9]\\d))\\d|4(?:(?:[0245]\\d|[1379])\\d|88)|5[0-6])\\d)\\d{4}|9[69]1\\d{6}|9(?:[68]\\d|9[089])\\d{5}", , , , "92123456", , , [ 7, 8, 9, 10 ] ], [ , , "80080(?:[01][1-9]|2\\d)\\d{3}", , , , "8008001234", , , [ 10 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , "1333\\d{4}|[12]468\\d{4}", , , , "13331234", , , [ 8 ] ], "MM", 95, "00", "0", , , "0", , , , [ [ , "(\\d)(\\d{2})(\\d{3})", "$1 $2 $3", [ "16|2" ], "0$1" ], [ , "(\\d{2})(\\d{2})(\\d{3})", "$1 $2 $3", [ "[45]|6(?:0[23]|[1-689]|7[235-7])|7(?:[0-4]|5[2-7])|8[1-6]" ], "0$1" ], [ , "(\\d)(\\d{3})(\\d{3,4})", "$1 $2 $3", [ "[12]" ], "0$1" ], [ , "(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", [ "[4-7]|8[1-35]" ], "0$1" ], [ , "(\\d)(\\d{3})(\\d{4,6})", "$1 $2 $3", [ "9(?:2[0-4]|[35-9]|4[137-9])" ], "0$1" ], [ , "(\\d)(\\d{4})(\\d{4})", "$1 $2 $3", [ "2" ], "0$1" ], [ , "(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", [ "8" ], "0$1" ], [ , "(\\d)(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3 $4", [ "92" ], "0$1" ], [ , "(\\d)(\\d{5})(\\d{4})", "$1 $2 $3", [ "9" ], "0$1" ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            MN: [ , [ , , "[12]\\d{7,9}|[57-9]\\d{7}", , , , , , , [ 8, 9, 10 ], [ 4, 5, 6 ] ], [ , , "[12]2[1-3]\\d{5,6}|7(?:0[0-5]\\d|128)\\d{4}|(?:[12](?:1|27)|5[368])\\d{6}|[12](?:3[2-8]|4[2-68]|5[1-4689])\\d{6,7}", , , , "53123456", , , , [ 4, 5, 6 ] ], [ , , "(?:83[01]|920)\\d{5}|(?:5[05]|8[05689]|9[013-9])\\d{6}", , , , "88123456", , , [ 8 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , "712[0-79]\\d{4}|7(?:1[013-9]|[5-8]\\d)\\d{5}", , , , "75123456", , , [ 8 ] ], "MN", 976, "001", "0", , , "0", , , , [ [ , "(\\d{2})(\\d{2})(\\d{4})", "$1 $2 $3", [ "[12]1" ], "0$1" ], [ , "(\\d{4})(\\d{4})", "$1 $2", [ "[57-9]" ] ], [ , "(\\d{3})(\\d{5,6})", "$1 $2", [ "[12]2[1-3]" ], "0$1" ], [ , "(\\d{4})(\\d{5,6})", "$1 $2", [ "[12](?:27|3[2-8]|4[2-68]|5[1-4689])", "[12](?:27|3[2-8]|4[2-68]|5[1-4689])[0-3]" ], "0$1" ], [ , "(\\d{5})(\\d{4,5})", "$1 $2", [ "[12]" ], "0$1" ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            MO: [ , [ , , "0800\\d{3}|(?:28|[68]\\d)\\d{6}", , , , , , , [ 7, 8 ] ], [ , , "(?:28[2-9]|8(?:11|[2-57-9]\\d))\\d{5}", , , , "28212345", , , [ 8 ] ], [ , , "6800[0-79]\\d{3}|6(?:[235]\\d\\d|6(?:0[0-5]|[1-9]\\d)|8(?:0[1-9]|[14-8]\\d|2[5-9]|[39][0-4]))\\d{4}", , , , "66123456", , , [ 8 ] ], [ , , "0800\\d{3}", , , , "0800501", , , [ 7 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "MO", 853, "00", , , , , , , , [ [ , "(\\d{4})(\\d{3})", "$1 $2", [ "0" ] ], [ , "(\\d{4})(\\d{4})", "$1 $2", [ "[268]" ] ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            MP: [ , [ , , "[58]\\d{9}|(?:67|90)0\\d{7}", , , , , , , [ 10 ], [ 7 ] ], [ , , "670(?:2(?:3[3-7]|56|8[4-8])|32[1-38]|4(?:33|8[348])|5(?:32|55|88)|6(?:64|70|82)|78[3589]|8[3-9]8|989)\\d{4}", , , , "6702345678", , , , [ 7 ] ], [ , , "670(?:2(?:3[3-7]|56|8[4-8])|32[1-38]|4(?:33|8[348])|5(?:32|55|88)|6(?:64|70|82)|78[3589]|8[3-9]8|989)\\d{4}", , , , "6702345678", , , , [ 7 ] ], [ , , "8(?:00|33|44|55|66|77|88)[2-9]\\d{6}", , , , "8002123456" ], [ , , "900[2-9]\\d{6}", , , , "9002123456" ], [ , , , , , , , , , [ -1 ] ], [ , , "52(?:3(?:[2-46-9][02-9]\\d|5(?:[02-46-9]\\d|5[0-46-9]))|4(?:[2-478][02-9]\\d|5(?:[034]\\d|2[024-9]|5[0-46-9])|6(?:0[1-9]|[2-9]\\d)|9(?:[05-9]\\d|2[0-5]|49)))\\d{4}|52[34][2-9]1[02-9]\\d{4}|5(?:00|2[12]|33|44|66|77|88)[2-9]\\d{6}", , , , "5002345678" ], [ , , , , , , , , , [ -1 ] ], "MP", 1, "011", "1", , , "1|([2-9]\\d{6})$", "670$1", , 1, , , [ , , , , , , , , , [ -1 ] ], , "670", [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            MQ: [ , [ , , "(?:69|80)\\d{7}|(?:59|97)6\\d{6}", , , , , , , [ 9 ] ], [ , , "596(?:[04-7]\\d|10|2[7-9]|3[04-9]|8[09]|9[4-9])\\d{4}", , , , "596301234" ], [ , , "69(?:6(?:[0-46-9]\\d|5[0-6])|727)\\d{4}", , , , "696201234" ], [ , , "80[0-5]\\d{6}", , , , "800012345" ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , "976(?:6\\d|7[0-367])\\d{4}", , , , "976612345" ], "MQ", 596, "00", "0", , , "0", , , , [ [ , "(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", [ "[569]" ], "0$1" ], [ , "(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", [ "8" ], "0$1" ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            MR: [ , [ , , "(?:[2-4]\\d\\d|800)\\d{5}", , , , , , , [ 8 ] ], [ , , "(?:25[08]|35\\d|45[1-7])\\d{5}", , , , "35123456" ], [ , , "[2-4][0-46-9]\\d{6}", , , , "22123456" ], [ , , "800\\d{5}", , , , "80012345" ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "MR", 222, "00", , , , , , , , [ [ , "(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", [ "[2-48]" ] ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            MS: [ , [ , , "(?:[58]\\d\\d|664|900)\\d{7}", , , , , , , [ 10 ], [ 7 ] ], [ , , "6644(?:1[0-3]|91)\\d{4}", , , , "6644912345", , , , [ 7 ] ], [ , , "664(?:3(?:49|9[1-6])|49[2-6])\\d{4}", , , , "6644923456", , , , [ 7 ] ], [ , , "8(?:00|33|44|55|66|77|88)[2-9]\\d{6}", , , , "8002123456" ], [ , , "900[2-9]\\d{6}", , , , "9002123456" ], [ , , , , , , , , , [ -1 ] ], [ , , "52(?:3(?:[2-46-9][02-9]\\d|5(?:[02-46-9]\\d|5[0-46-9]))|4(?:[2-478][02-9]\\d|5(?:[034]\\d|2[024-9]|5[0-46-9])|6(?:0[1-9]|[2-9]\\d)|9(?:[05-9]\\d|2[0-5]|49)))\\d{4}|52[34][2-9]1[02-9]\\d{4}|5(?:00|2[12]|33|44|66|77|88)[2-9]\\d{6}", , , , "5002345678" ], [ , , , , , , , , , [ -1 ] ], "MS", 1, "011", "1", , , "1|([34]\\d{6})$", "664$1", , , , , [ , , , , , , , , , [ -1 ] ], , "664", [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            MT: [ , [ , , "3550\\d{4}|(?:[2579]\\d\\d|800)\\d{5}", , , , , , , [ 8 ] ], [ , , "20(?:3[1-4]|6[059])\\d{4}|2(?:0[19]|[1-357]\\d|60)\\d{5}", , , , "21001234" ], [ , , "(?:7(?:210|[79]\\d\\d)|9(?:[29]\\d\\d|69[67]|8(?:1[1-3]|89|97)))\\d{4}", , , , "96961234" ], [ , , "800[3467]\\d{4}", , , , "80071234" ], [ , , "5(?:0(?:0(?:37|43)|(?:6\\d|70|9[0168])\\d)|[12]\\d0[1-5])\\d{3}", , , , "50037123" ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , "3550\\d{4}", , , , "35501234" ], "MT", 356, "00", , , , , , , , [ [ , "(\\d{4})(\\d{4})", "$1 $2", [ "[2357-9]" ] ] ], , [ , , "7117\\d{4}", , , , "71171234" ], , , [ , , , , , , , , , [ -1 ] ], [ , , "501\\d{5}", , , , "50112345" ], , , [ , , , , , , , , , [ -1 ] ] ],
            MU: [ , [ , , "(?:5|8\\d\\d)\\d{7}|[2-468]\\d{6}", , , , , , , [ 7, 8, 10 ] ], [ , , "(?:2(?:[0346-8]\\d|1[0-7])|4(?:[013568]\\d|2[4-7])|54(?:[3-5]\\d|71)|6\\d\\d|8(?:14|3[129]))\\d{4}", , , , "54480123", , , [ 7, 8 ] ], [ , , "5(?:4(?:2[1-389]|7[1-9])|87[15-8])\\d{4}|5(?:2[5-9]|4[3-589]|[57]\\d|8[0-689]|9[0-8])\\d{5}", , , , "52512345", , , [ 8 ] ], [ , , "802\\d{7}|80[0-2]\\d{4}", , , , "8001234", , , [ 7, 10 ] ], [ , , "30\\d{5}", , , , "3012345", , , [ 7 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , "3(?:20|9\\d)\\d{4}", , , , "3201234", , , [ 7 ] ], "MU", 230, "0(?:0|[24-7]0|3[03])", , , , , , "020", , [ [ , "(\\d{3})(\\d{4})", "$1 $2", [ "[2-46]|8[013]" ] ], [ , "(\\d{4})(\\d{4})", "$1 $2", [ "5" ] ], [ , "(\\d{5})(\\d{5})", "$1 $2", [ "8" ] ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            MV: [ , [ , , "(?:800|9[0-57-9]\\d)\\d{7}|[34679]\\d{6}", , , , , , , [ 7, 10 ] ], [ , , "(?:3(?:0[0-3]|3[0-59])|6(?:[57][02468]|6[024-68]|8[024689]))\\d{4}", , , , "6701234", , , [ 7 ] ], [ , , "46[46]\\d{4}|(?:7\\d|9[13-9])\\d{5}", , , , "7712345", , , [ 7 ] ], [ , , "800\\d{7}", , , , "8001234567", , , [ 10 ] ], [ , , "900\\d{7}", , , , "9001234567", , , [ 10 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "MV", 960, "0(?:0|19)", , , , , , "00", , [ [ , "(\\d{3})(\\d{4})", "$1-$2", [ "[3467]|9[13-9]" ] ], [ , "(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", [ "[89]" ] ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , "4[05]0\\d{4}", , , , "4001234", , , [ 7 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            MW: [ , [ , , "(?:[19]\\d|[23]1|77|88)\\d{7}|1\\d{6}", , , , , , , [ 7, 9 ] ], [ , , "(?:1[2-9]|21\\d\\d)\\d{5}", , , , "1234567" ], [ , , "111\\d{6}|(?:31|77|88|9[89])\\d{7}", , , , "991234567", , , [ 9 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "MW", 265, "00", "0", , , "0", , , , [ [ , "(\\d)(\\d{3})(\\d{3})", "$1 $2 $3", [ "1[2-9]" ], "0$1" ], [ , "(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", [ "2" ], "0$1" ], [ , "(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", [ "[137-9]" ], "0$1" ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            MX: [ , [ , , "1(?:(?:44|99)[1-9]|65[0-689])\\d{7}|(?:1(?:[017]\\d|[235][1-9]|4[0-35-9]|6[0-46-9]|8[1-79]|9[1-8])|[2-9]\\d)\\d{8}", , , , , , , [ 10, 11 ], [ 7, 8 ] ], [ , , "6571\\d{6}|(?:2(?:0[01]|2[1-9]|3[1-35-8]|4[13-9]|7[1-689]|8[1-578]|9[467])|3(?:1[1-79]|[2458][1-9]|3\\d|7[1-8]|9[1-5])|4(?:1[1-57-9]|[25-7][1-9]|3[1-8]|4\\d|8[1-35-9]|9[2-689])|5(?:[56]\\d|88|9[1-79])|6(?:1[2-68]|[2-4][1-9]|5[1-3689]|6[1-57-9]|7[1-7]|8[67]|9[4-8])|7(?:[1-467][1-9]|5[13-9]|8[1-69]|9[17])|8(?:1\\d|2[13-689]|3[1-6]|4[124-6]|6[1246-9]|7[1-378]|9[12479])|9(?:1[346-9]|2[1-4]|3[2-46-8]|5[1348]|6[1-9]|7[12]|8[1-8]|9\\d))\\d{7}", , , , "2001234567", , , [ 10 ], [ 7, 8 ] ], [ , , "6571\\d{6}|(?:1(?:2(?:2[1-9]|3[1-35-8]|4[13-9]|7[1-689]|8[1-578]|9[467])|3(?:1[1-79]|[2458][1-9]|3\\d|7[1-8]|9[1-5])|4(?:1[1-57-9]|[24-7][1-9]|3[1-8]|8[1-35-9]|9[2-689])|5(?:[56]\\d|88|9[1-79])|6(?:1[2-68]|[2-4][1-9]|5[1-3689]|6[1-57-9]|7[1-7]|8[67]|9[4-8])|7(?:[1-467][1-9]|5[13-9]|8[1-69]|9[17])|8(?:1\\d|2[13-689]|3[1-6]|4[124-6]|6[1246-9]|7[1-378]|9[12479])|9(?:1[346-9]|2[1-4]|3[2-46-8]|5[1348]|[69][1-9]|7[12]|8[1-8]))|2(?:2[1-9]|3[1-35-8]|4[13-9]|7[1-689]|8[1-578]|9[467])|3(?:1[1-79]|[2458][1-9]|3\\d|7[1-8]|9[1-5])|4(?:1[1-57-9]|[25-7][1-9]|3[1-8]|4\\d|8[1-35-9]|9[2-689])|5(?:[56]\\d|88|9[1-79])|6(?:1[2-68]|[2-4][1-9]|5[1-3689]|6[1-57-9]|7[1-7]|8[67]|9[4-8])|7(?:[1-467][1-9]|5[13-9]|8[1-69]|9[17])|8(?:1\\d|2[13-689]|3[1-6]|4[124-6]|6[1246-9]|7[1-378]|9[12479])|9(?:1[346-9]|2[1-4]|3[2-46-8]|5[1348]|6[1-9]|7[12]|8[1-8]|9\\d))\\d{7}", , , , "12221234567", , , , [ 7, 8 ] ], [ , , "8(?:00|88)\\d{7}", , , , "8001234567", , , [ 10 ] ], [ , , "900\\d{7}", , , , "9001234567", , , [ 10 ] ], [ , , "300\\d{7}", , , , "3001234567", , , [ 10 ] ], [ , , "500\\d{7}", , , , "5001234567", , , [ 10 ] ], [ , , , , , , , , , [ -1 ] ], "MX", 52, "0[09]", "01", , , "0(?:[12]|4[45])|1", , "00", , [ [ , "(\\d{5})", "$1", [ "53" ] ], [ , "(\\d{2})(\\d{4})(\\d{4})", "$1 $2 $3", [ "33|5[56]|81" ], , , 1 ], [ , "(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", [ "[2-9]" ], , , 1 ], [ , "(\\d)(\\d{2})(\\d{4})(\\d{4})", "$2 $3 $4", [ "1(?:33|5[56]|81)" ], , , 1 ], [ , "(\\d)(\\d{3})(\\d{3})(\\d{4})", "$2 $3 $4", [ "1" ], , , 1 ] ], [ [ , "(\\d{2})(\\d{4})(\\d{4})", "$1 $2 $3", [ "33|5[56]|81" ], , , 1 ], [ , "(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", [ "[2-9]" ], , , 1 ], [ , "(\\d)(\\d{2})(\\d{4})(\\d{4})", "$2 $3 $4", [ "1(?:33|5[56]|81)" ], , , 1 ], [ , "(\\d)(\\d{3})(\\d{3})(\\d{4})", "$2 $3 $4", [ "1" ], , , 1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            MY: [ , [ , , "1\\d{8,9}|(?:3\\d|[4-9])\\d{7}", , , , , , , [ 8, 9, 10 ], [ 6, 7 ] ], [ , , "(?:3(?:2[0-36-9]|3[0-368]|4[0-278]|5[0-24-8]|6[0-467]|7[1246-9]|8\\d|9[0-57])\\d|4(?:2[0-689]|[3-79]\\d|8[1-35689])|5(?:2[0-589]|[3468]\\d|5[0-489]|7[1-9]|9[23])|6(?:2[2-9]|3[1357-9]|[46]\\d|5[0-6]|7[0-35-9]|85|9[015-8])|7(?:[2579]\\d|3[03-68]|4[0-8]|6[5-9]|8[0-35-9])|8(?:[24][2-8]|3[2-5]|5[2-7]|6[2-589]|7[2-578]|[89][2-9])|9(?:0[57]|13|[25-7]\\d|[3489][0-8]))\\d{5}", , , , "323856789", , , [ 8, 9 ], [ 6, 7 ] ], [ , , "1(?:1888[69]|4400|8(?:47|8[27])[0-4])\\d{4}|1(?:0(?:[23568]\\d|4[0-6]|7[016-9]|9[0-8])|1(?:[1-5]\\d\\d|6(?:0[5-9]|[1-9]\\d)|7(?:[0134]\\d|2[1-9]|5[0-6]))|(?:(?:[269]|59)\\d|[37][1-9]|4[235-9])\\d|8(?:1[23]|[236]\\d|4[06]|5[7-9]|7[016-9]|8[01]|9[0-8]))\\d{5}", , , , "123456789", , , [ 9, 10 ] ], [ , , "1[378]00\\d{6}", , , , "1300123456", , , [ 10 ] ], [ , , "1600\\d{6}", , , , "1600123456", , , [ 10 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , "15(?:4(?:6[0-4]\\d|8(?:0[125]|[17]\\d|21|3[01]|4[01589]|5[014]|6[02]))|6(?:32[0-6]|78\\d))\\d{4}", , , , "1546012345", , , [ 10 ] ], "MY", 60, "00", "0", , , "0", , , , [ [ , "(\\d)(\\d{3})(\\d{4})", "$1-$2 $3", [ "[4-79]" ], "0$1" ], [ , "(\\d{2})(\\d{3})(\\d{3,4})", "$1-$2 $3", [ "1(?:[02469]|[378][1-9])|8" ], "0$1" ], [ , "(\\d)(\\d{4})(\\d{4})", "$1-$2 $3", [ "3" ], "0$1" ], [ , "(\\d)(\\d{3})(\\d{2})(\\d{4})", "$1-$2-$3-$4", [ "1[36-8]" ] ], [ , "(\\d{3})(\\d{3})(\\d{4})", "$1-$2 $3", [ "15" ], "0$1" ], [ , "(\\d{2})(\\d{4})(\\d{4})", "$1-$2 $3", [ "1" ], "0$1" ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            MZ: [ , [ , , "(?:2|8\\d)\\d{7}", , , , , , , [ 8, 9 ] ], [ , , "2(?:[1346]\\d|5[0-2]|[78][12]|93)\\d{5}", , , , "21123456", , , [ 8 ] ], [ , , "8[2-79]\\d{7}", , , , "821234567", , , [ 9 ] ], [ , , "800\\d{6}", , , , "800123456", , , [ 9 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "MZ", 258, "00", , , , , , , , [ [ , "(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", [ "2|8[2-79]" ] ], [ , "(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", [ "8" ] ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            NA: [ , [ , , "[68]\\d{7,8}", , , , , , , [ 8, 9 ] ], [ , , "64426\\d{3}|6(?:1(?:2[2-7]|3[01378]|4[0-4])|254|32[0237]|4(?:27|41|5[25])|52[236-8]|626|7(?:2[2-4]|30))\\d{4,5}|6(?:1(?:(?:0\\d|2[0189]|3[24-69]|4[5-9])\\d|17|69|7[014])|2(?:17|5[0-36-8]|69|70)|3(?:17|2[14-689]|34|6[289]|7[01]|81)|4(?:17|2[0-2]|4[06]|5[0137]|69|7[01])|5(?:17|2[0459]|69|7[01])|6(?:17|25|38|42|69|7[01])|7(?:17|2[569]|3[13]|6[89]|7[01]))\\d{4}", , , , "61221234" ], [ , , "(?:60|8[1245])\\d{7}", , , , "811234567", , , [ 9 ] ], [ , , "80\\d{7}", , , , "800123456", , , [ 9 ] ], [ , , "8701\\d{5}", , , , "870123456", , , [ 9 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , "8(?:3\\d\\d|86)\\d{5}", , , , "88612345" ], "NA", 264, "00", "0", , , "0", , , , [ [ , "(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", [ "88" ], "0$1" ], [ , "(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", [ "6" ], "0$1" ], [ , "(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", [ "87" ], "0$1" ], [ , "(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", [ "8" ], "0$1" ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            NC: [ , [ , , "[2-57-9]\\d{5}", , , , , , , [ 6 ] ], [ , , "(?:2[03-9]|3[0-5]|4[1-7]|88)\\d{4}", , , , "201234" ], [ , , "(?:5[0-4]|[79]\\d|8[0-79])\\d{4}", , , , "751234" ], [ , , , , , , , , , [ -1 ] ], [ , , "36\\d{4}", , , , "366711" ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "NC", 687, "00", , , , , , , , [ [ , "(\\d{3})", "$1", [ "5[6-8]" ] ], [ , "(\\d{2})(\\d{2})(\\d{2})", "$1.$2.$3", [ "[2-57-9]" ] ] ], [ [ , "(\\d{2})(\\d{2})(\\d{2})", "$1.$2.$3", [ "[2-57-9]" ] ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            NE: [ , [ , , "[027-9]\\d{7}", , , , , , , [ 8 ] ], [ , , "2(?:0(?:20|3[1-8]|4[13-5]|5[14]|6[14578]|7[1-578])|1(?:4[145]|5[14]|6[14-68]|7[169]|88))\\d{4}", , , , "20201234" ], [ , , "(?:23|7[04]|[89]\\d)\\d{6}", , , , "93123456" ], [ , , "08\\d{6}", , , , "08123456" ], [ , , "09\\d{6}", , , , "09123456" ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "NE", 227, "00", , , , , , , , [ [ , "(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", [ "08" ] ], [ , "(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", [ "[089]|2[013]|7[04]" ] ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            NF: [ , [ , , "[13]\\d{5}", , , , , , , [ 6 ], [ 5 ] ], [ , , "(?:1(?:06|17|28|39)|3[0-2]\\d)\\d{3}", , , , "106609", , , , [ 5 ] ], [ , , "(?:14|3[58])\\d{4}", , , , "381234", , , , [ 5 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "NF", 672, "00", , , , "([0-258]\\d{4})$", "3$1", , , [ [ , "(\\d{2})(\\d{4})", "$1 $2", [ "1[0-3]" ] ], [ , "(\\d)(\\d{5})", "$1 $2", [ "[13]" ] ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            NG: [ , [ , , "(?:[124-7]|9\\d{3})\\d{6}|[1-9]\\d{7}|[78]\\d{9,13}", , , , , , , [ 7, 8, 10, 11, 12, 13, 14 ], [ 5, 6 ] ], [ , , "(?:(?:[1-356]\\d|4[02-8]|8[2-9])\\d|9(?:0[3-9]|[1-9]\\d))\\d{5}|7(?:0(?:[013-689]\\d|2[0-24-9])\\d{3,4}|[1-79]\\d{6})|(?:[12]\\d|4[147]|5[14579]|6[1578]|7[1-3578])\\d{5}", , , , "18040123", , , [ 7, 8 ], [ 5, 6 ] ], [ , , "(?:702[0-24-9]|8(?:01|19)[01])\\d{6}|(?:70[13-689]|8(?:0[2-9]|1[0-8])|9(?:0[1-9]|1[2356]))\\d{7}", , , , "8021234567", , , [ 10 ] ], [ , , "800\\d{7,11}", , , , "80017591759", , , [ 10, 11, 12, 13, 14 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "NG", 234, "009", "0", , , "0", , , , [ [ , "(\\d{2})(\\d{2})(\\d{3})", "$1 $2 $3", [ "78" ], "0$1" ], [ , "(\\d)(\\d{3})(\\d{3,4})", "$1 $2 $3", [ "[12]|9(?:0[3-9]|[1-9])" ], "0$1" ], [ , "(\\d{2})(\\d{3})(\\d{2,3})", "$1 $2 $3", [ "[3-7]|8[2-9]" ], "0$1" ], [ , "(\\d{3})(\\d{3})(\\d{3,4})", "$1 $2 $3", [ "[7-9]" ], "0$1" ], [ , "(\\d{3})(\\d{4})(\\d{4,5})", "$1 $2 $3", [ "[78]" ], "0$1" ], [ , "(\\d{3})(\\d{5})(\\d{5,6})", "$1 $2 $3", [ "[78]" ], "0$1" ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , "700\\d{7,11}", , , , "7001234567", , , [ 10, 11, 12, 13, 14 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            NI: [ , [ , , "(?:1800|[25-8]\\d{3})\\d{4}", , , , , , , [ 8 ] ], [ , , "2\\d{7}", , , , "21234567" ], [ , , "(?:5(?:5[0-7]|[78]\\d)|6(?:20|3[035]|4[045]|5[05]|77|8[1-9]|9[059])|(?:7[5-8]|8\\d)\\d)\\d{5}", , , , "81234567" ], [ , , "1800\\d{4}", , , , "18001234" ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "NI", 505, "00", , , , , , , , [ [ , "(\\d{4})(\\d{4})", "$1 $2", [ "[125-8]" ] ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            NL: [ , [ , , "(?:[124-7]\\d\\d|3(?:[02-9]\\d|1[0-8]))\\d{6}|[89]\\d{6,9}|1\\d{4,5}", , , , , , , [ 5, 6, 7, 8, 9, 10 ] ], [ , , "(?:1(?:[035]\\d|1[13-578]|6[124-8]|7[24]|8[0-467])|2(?:[0346]\\d|2[2-46-9]|5[125]|9[479])|3(?:[03568]\\d|1[3-8]|2[01]|4[1-8])|4(?:[0356]\\d|1[1-368]|7[58]|8[15-8]|9[23579])|5(?:[0358]\\d|[19][1-9]|2[1-57-9]|4[13-8]|6[126]|7[0-3578])|7\\d\\d)\\d{6}", , , , "101234567", , , [ 9 ] ], [ , , "6[1-58]\\d{7}", , , , "612345678", , , [ 9 ] ], [ , , "800\\d{4,7}", , , , "8001234", , , [ 7, 8, 9, 10 ] ], [ , , "90[069]\\d{4,7}", , , , "9061234", , , [ 7, 8, 9, 10 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , "(?:85|91)\\d{7}", , , , "851234567", , , [ 9 ] ], "NL", 31, "00", "0", , , "0", , , , [ [ , "(\\d{4})", "$1", [ "1[238]|[34]" ] ], [ , "(\\d{2})(\\d{3,4})", "$1 $2", [ "14" ] ], [ , "(\\d{6})", "$1", [ "1" ] ], [ , "(\\d{3})(\\d{4,7})", "$1 $2", [ "[89]0" ], "0$1" ], [ , "(\\d{2})(\\d{7})", "$1 $2", [ "66" ], "0$1" ], [ , "(\\d)(\\d{8})", "$1 $2", [ "6" ], "0$1" ], [ , "(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", [ "1[16-8]|2[259]|3[124]|4[17-9]|5[124679]" ], "0$1" ], [ , "(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", [ "[1-57-9]" ], "0$1" ] ], [ [ , "(\\d{3})(\\d{4,7})", "$1 $2", [ "[89]0" ], "0$1" ], [ , "(\\d{2})(\\d{7})", "$1 $2", [ "66" ], "0$1" ], [ , "(\\d)(\\d{8})", "$1 $2", [ "6" ], "0$1" ], [ , "(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", [ "1[16-8]|2[259]|3[124]|4[17-9]|5[124679]" ], "0$1" ], [ , "(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", [ "[1-57-9]" ], "0$1" ] ], [ , , "66\\d{7}", , , , "662345678", , , [ 9 ] ], , , [ , , "140(?:1[035]|2[0346]|3[03568]|4[0356]|5[0358]|8[458])|140(?:1[16-8]|2[259]|3[124]|4[17-9]|5[124679]|7)\\d", , , , , , , [ 5, 6 ] ], [ , , "140(?:1[035]|2[0346]|3[03568]|4[0356]|5[0358]|8[458])|(?:140(?:1[16-8]|2[259]|3[124]|4[17-9]|5[124679]|7)|8[478]\\d{6})\\d", , , , "14020", , , [ 5, 6, 9 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            NO: [ , [ , , "(?:0|[2-9]\\d{3})\\d{4}", , , , , , , [ 5, 8 ] ], [ , , "(?:2[1-4]|3[1-3578]|5[1-35-7]|6[1-4679]|7[0-8])\\d{6}", , , , "21234567", , , [ 8 ] ], [ , , "(?:4[015-8]|59|9\\d)\\d{6}", , , , "40612345", , , [ 8 ] ], [ , , "80[01]\\d{5}", , , , "80012345", , , [ 8 ] ], [ , , "82[09]\\d{5}", , , , "82012345", , , [ 8 ] ], [ , , "810(?:0[0-6]|[2-8]\\d)\\d{3}", , , , "81021234", , , [ 8 ] ], [ , , "880\\d{5}", , , , "88012345", , , [ 8 ] ], [ , , "85[0-5]\\d{5}", , , , "85012345", , , [ 8 ] ], "NO", 47, "00", , , , , , , , [ [ , "(\\d{3})(\\d{2})(\\d{3})", "$1 $2 $3", [ "[489]|59" ] ], [ , "(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", [ "[235-7]" ] ] ], , [ , , , , , , , , , [ -1 ] ], 1, "[02-689]|7[0-8]", [ , , , , , , , , , [ -1 ] ], [ , , "(?:0[2-9]|81(?:0(?:0[7-9]|1\\d)|5\\d\\d))\\d{3}", , , , "02000" ], , , [ , , "81[23]\\d{5}", , , , "81212345", , , [ 8 ] ] ],
            NP: [ , [ , , "(?:1\\d|9)\\d{9}|[1-9]\\d{7}", , , , , , , [ 8, 10, 11 ], [ 6, 7 ] ], [ , , "(?:1[0-6]\\d|99[02-6])\\d{5}|(?:2[13-79]|3[135-8]|4[146-9]|5[135-7]|6[13-9]|7[15-9]|8[1-46-9]|9[1-7])[2-6]\\d{5}", , , , "14567890", , , [ 8 ], [ 6, 7 ] ], [ , , "9(?:6[0-3]|7[245]|8[0-24-68])\\d{7}", , , , "9841234567", , , [ 10 ] ], [ , , "1(?:66001|800\\d\\d)\\d{5}", , , , "16600101234", , , [ 11 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "NP", 977, "00", "0", , , "0", , , , [ [ , "(\\d)(\\d{7})", "$1-$2", [ "1[2-6]" ], "0$1" ], [ , "(\\d{2})(\\d{6})", "$1-$2", [ "1[01]|[2-8]|9(?:[1-579]|6[2-6])" ], "0$1" ], [ , "(\\d{3})(\\d{7})", "$1-$2", [ "9" ] ], [ , "(\\d{4})(\\d{2})(\\d{5})", "$1-$2-$3", [ "1" ] ] ], [ [ , "(\\d)(\\d{7})", "$1-$2", [ "1[2-6]" ], "0$1" ], [ , "(\\d{2})(\\d{6})", "$1-$2", [ "1[01]|[2-8]|9(?:[1-579]|6[2-6])" ], "0$1" ], [ , "(\\d{3})(\\d{7})", "$1-$2", [ "9" ] ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            NR: [ , [ , , "(?:444|(?:55|8\\d)\\d|666)\\d{4}", , , , , , , [ 7 ] ], [ , , "444\\d{4}", , , , "4441234" ], [ , , "(?:55[3-9]|666|8\\d\\d)\\d{4}", , , , "5551234" ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "NR", 674, "00", , , , , , , , [ [ , "(\\d{3})(\\d{4})", "$1 $2", [ "[4-68]" ] ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            NU: [ , [ , , "(?:[47]|888\\d)\\d{3}", , , , , , , [ 4, 7 ] ], [ , , "[47]\\d{3}", , , , "7012", , , [ 4 ] ], [ , , "888[4-9]\\d{3}", , , , "8884012", , , [ 7 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "NU", 683, "00", , , , , , , , [ [ , "(\\d{3})(\\d{4})", "$1 $2", [ "8" ] ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            NZ: [ , [ , , "[29]\\d{7,9}|50\\d{5}(?:\\d{2,3})?|6[0-35-9]\\d{6}|7\\d{7,8}|8\\d{4,9}|(?:11\\d|[34])\\d{7}", , , , , , , [ 5, 6, 7, 8, 9, 10 ] ], [ , , "24099\\d{3}|(?:3[2-79]|[49][2-9]|6[235-9]|7[2-57-9])\\d{6}", , , , "32345678", , , [ 8 ], [ 7 ] ], [ , , "2[0-27-9]\\d{7,8}|21\\d{6}", , , , "211234567", , , [ 8, 9, 10 ] ], [ , , "508\\d{6,7}|80\\d{6,8}", , , , "800123456", , , [ 8, 9, 10 ] ], [ , , "(?:11\\d{5}|50(?:0[08]|30|66|77|88))\\d{3}|90\\d{6,8}", , , , "900123456", , , [ 7, 8, 9, 10 ] ], [ , , , , , , , , , [ -1 ] ], [ , , "70\\d{7}", , , , "701234567", , , [ 9 ] ], [ , , , , , , , , , [ -1 ] ], "NZ", 64, "0(?:0|161)", "0", , , "0", , "00", , [ [ , "(\\d{2})(\\d{3,8})", "$1 $2", [ "8[1-579]" ], "0$1" ], [ , "(\\d{3})(\\d{2})(\\d{2,3})", "$1 $2 $3", [ "50[036-8]|[89]0", "50(?:[0367]|88)|[89]0" ], "0$1" ], [ , "(\\d)(\\d{3})(\\d{4})", "$1-$2 $3", [ "24|[346]|7[2-57-9]|9[2-9]" ], "0$1" ], [ , "(\\d{3})(\\d{3})(\\d{3,4})", "$1 $2 $3", [ "2(?:10|74)|[59]|80" ], "0$1" ], [ , "(\\d{2})(\\d{3,4})(\\d{4})", "$1 $2 $3", [ "1|2[028]" ], "0$1" ], [ , "(\\d{2})(\\d{3})(\\d{3,5})", "$1 $2 $3", [ "2(?:[169]|7[0-35-9])|7|86" ], "0$1" ] ], , [ , , "[28]6\\d{6,7}", , , , "26123456", , , [ 8, 9 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , "8(?:1[6-9]|22|3\\d|4[045]|5[459]|7[0-3579]|90)\\d{2,7}", , , , "83012378" ], , , [ , , , , , , , , , [ -1 ] ] ],
            OM: [ , [ , , "(?:1505|[279]\\d{3}|500)\\d{4}|800\\d{5,6}", , , , , , , [ 7, 8, 9 ] ], [ , , "2[2-6]\\d{6}", , , , "23123456", , , [ 8 ] ], [ , , "1505\\d{4}|(?:7(?:[1289]\\d|70)|9(?:0[1-9]|[1-9]\\d))\\d{5}", , , , "92123456", , , [ 8 ] ], [ , , "8007\\d{4,5}|(?:500|800[05])\\d{4}", , , , "80071234" ], [ , , "900\\d{5}", , , , "90012345", , , [ 8 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "OM", 968, "00", , , , , , , , [ [ , "(\\d{3})(\\d{4,6})", "$1 $2", [ "[58]" ] ], [ , "(\\d{2})(\\d{6})", "$1 $2", [ "2" ] ], [ , "(\\d{4})(\\d{4})", "$1 $2", [ "[179]" ] ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            PA: [ , [ , , "(?:00800|8\\d{3})\\d{6}|[68]\\d{7}|[1-57-9]\\d{6}", , , , , , , [ 7, 8, 10, 11 ] ], [ , , "(?:1(?:0\\d|1[479]|2[37]|3[0137]|4[17]|5[05]|6[58]|7[0167]|8[258]|9[1389])|2(?:[0235-79]\\d|1[0-7]|4[013-9]|8[02-9])|3(?:[089]\\d|1[0-7]|2[0-5]|33|4[0-79]|5[05]|6[068]|7[0-8])|4(?:00|3[0-579]|4\\d|7[0-57-9])|5(?:[01]\\d|2[0-7]|[56]0|79)|7(?:0[09]|2[0-26-8]|3[03]|4[04]|5[05-9]|6[056]|7[0-24-9]|8[6-9]|90)|8(?:09|2[89]|3\\d|4[0-24-689]|5[014]|8[02])|9(?:0[5-9]|1[0135-8]|2[036-9]|3[35-79]|40|5[0457-9]|6[05-9]|7[04-9]|8[35-8]|9\\d))\\d{4}", , , , "2001234", , , [ 7 ] ], [ , , "(?:1[16]1|21[89]|6(?:[02-9]\\d|1[0-8])\\d|8(?:1[01]|7[23]))\\d{4}", , , , "61234567", , , [ 7, 8 ] ], [ , , "800\\d{4,5}|(?:00800|800\\d)\\d{6}", , , , "8001234" ], [ , , "(?:8(?:22|55|60|7[78]|86)|9(?:00|81))\\d{4}", , , , "8601234", , , [ 7 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "PA", 507, "00", , , , , , , , [ [ , "(\\d{3})(\\d{4})", "$1-$2", [ "[1-57-9]" ] ], [ , "(\\d{4})(\\d{4})", "$1-$2", [ "[68]" ] ], [ , "(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", [ "8" ] ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            PE: [ , [ , , "(?:[14-8]|9\\d)\\d{7}", , , , , , , [ 8, 9 ], [ 6, 7 ] ], [ , , "(?:(?:4[34]|5[14])[0-8]\\d|7(?:173|3[0-8]\\d)|8(?:10[05689]|6(?:0[06-9]|1[6-9]|29)|7(?:0[569]|[56]0)))\\d{4}|(?:1[0-8]|4[12]|5[236]|6[1-7]|7[246]|8[2-4])\\d{6}", , , , "11234567", , , [ 8 ], [ 6, 7 ] ], [ , , "9\\d{8}", , , , "912345678", , , [ 9 ] ], [ , , "800\\d{5}", , , , "80012345", , , [ 8 ] ], [ , , "805\\d{5}", , , , "80512345", , , [ 8 ] ], [ , , "801\\d{5}", , , , "80112345", , , [ 8 ] ], [ , , "80[24]\\d{5}", , , , "80212345", , , [ 8 ] ], [ , , , , , , , , , [ -1 ] ], "PE", 51, "19(?:1[124]|77|90)00", "0", " Anexo ", , "0", , , , [ [ , "(\\d{3})(\\d{5})", "$1 $2", [ "80" ], "(0$1)" ], [ , "(\\d)(\\d{7})", "$1 $2", [ "1" ], "(0$1)" ], [ , "(\\d{2})(\\d{6})", "$1 $2", [ "[4-8]" ], "(0$1)" ], [ , "(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", [ "9" ] ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            PF: [ , [ , , "4\\d{5}(?:\\d{2})?|8\\d{7,8}", , , , , , , [ 6, 8, 9 ] ], [ , , "4(?:0[4-689]|9[4-68])\\d{5}", , , , "40412345", , , [ 8 ] ], [ , , "8[7-9]\\d{6}", , , , "87123456", , , [ 8 ] ], [ , , "80[0-5]\\d{6}", , , , "800012345", , , [ 9 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , "499\\d{5}", , , , "49901234", , , [ 8 ] ], "PF", 689, "00", , , , , , , , [ [ , "(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3", [ "44" ] ], [ , "(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", [ "4|8[7-9]" ] ], [ , "(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", [ "8" ] ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , "44\\d{4}", , , , , , , [ 6 ] ], [ , , "44\\d{4}", , , , "440123", , , [ 6 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            PG: [ , [ , , "(?:180|[78]\\d{3})\\d{4}|(?:[2-589]\\d|64)\\d{5}", , , , , , , [ 7, 8 ] ], [ , , "(?:(?:3[0-2]|4[257]|5[34]|9[78])\\d|64[1-9]|85[02-46-9])\\d{4}", , , , "3123456", , , [ 7 ] ], [ , , "(?:7\\d|8[18])\\d{6}", , , , "70123456", , , [ 8 ] ], [ , , "180\\d{4}", , , , "1801234", , , [ 7 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , "2(?:0[0-47]|7[568])\\d{4}", , , , "2751234", , , [ 7 ] ], "PG", 675, "00|140[1-3]", , , , , , "00", , [ [ , "(\\d{3})(\\d{4})", "$1 $2", [ "18|[2-69]|85" ] ], [ , "(\\d{4})(\\d{4})", "$1 $2", [ "[78]" ] ] ], , [ , , "27[01]\\d{4}", , , , "2700123", , , [ 7 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            PH: [ , [ , , "(?:[2-7]|9\\d)\\d{8}|2\\d{5}|(?:1800|8)\\d{7,9}", , , , , , , [ 6, 8, 9, 10, 11, 12, 13 ], [ 4, 5, 7 ] ], [ , , "(?:(?:2[3-8]|3[2-68]|4[2-9]|5[2-6]|6[2-58]|7[24578])\\d{3}|88(?:22\\d\\d|42))\\d{4}|(?:2|8[2-8]\\d\\d)\\d{5}", , , , "232345678", , , [ 6, 8, 9, 10 ], [ 4, 5, 7 ] ], [ , , "(?:8(?:1[37]|9[5-8])|9(?:0[5-9]|1[0-24-9]|[235-7]\\d|4[2-9]|8[135-9]|9[1-9]))\\d{7}", , , , "9051234567", , , [ 10 ] ], [ , , "1800\\d{7,9}", , , , "180012345678", , , [ 11, 12, 13 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "PH", 63, "00", "0", , , "0", , , , [ [ , "(\\d)(\\d{5})", "$1 $2", [ "2" ], "(0$1)" ], [ , "(\\d{4})(\\d{4,6})", "$1 $2", [ "3(?:23|39|46)|4(?:2[3-6]|[35]9|4[26]|76)|544|88[245]|(?:52|64|86)2", "3(?:230|397|461)|4(?:2(?:35|[46]4|51)|396|4(?:22|63)|59[347]|76[15])|5(?:221|446)|642[23]|8(?:622|8(?:[24]2|5[13]))" ], "(0$1)" ], [ , "(\\d{5})(\\d{4})", "$1 $2", [ "346|4(?:27|9[35])|883", "3469|4(?:279|9(?:30|56))|8834" ], "(0$1)" ], [ , "(\\d)(\\d{4})(\\d{4})", "$1 $2 $3", [ "2" ], "(0$1)" ], [ , "(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", [ "[3-7]|8[2-8]" ], "(0$1)" ], [ , "(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", [ "[89]" ], "0$1" ], [ , "(\\d{4})(\\d{3})(\\d{4})", "$1 $2 $3", [ "1" ] ], [ , "(\\d{4})(\\d{1,2})(\\d{3})(\\d{4})", "$1 $2 $3 $4", [ "1" ] ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            PK: [ , [ , , "122\\d{6}|[24-8]\\d{10,11}|9(?:[013-9]\\d{8,10}|2(?:[01]\\d\\d|2(?:[06-8]\\d|1[01]))\\d{7})|(?:[2-8]\\d{3}|92(?:[0-7]\\d|8[1-9]))\\d{6}|[24-9]\\d{8}|[89]\\d{7}", , , , , , , [ 8, 9, 10, 11, 12 ], [ 5, 6, 7 ] ], [ , , "(?:(?:21|42)[2-9]|58[126])\\d{7}|(?:2[25]|4[0146-9]|5[1-35-7]|6[1-8]|7[14]|8[16]|91)[2-9]\\d{6,7}|(?:2(?:3[2358]|4[2-4]|9[2-8])|45[3479]|54[2-467]|60[468]|72[236]|8(?:2[2-689]|3[23578]|4[3478]|5[2356])|9(?:2[2-8]|3[27-9]|4[2-6]|6[3569]|9[25-8]))[2-9]\\d{5,6}", , , , "2123456789", , , [ 9, 10 ], [ 5, 6, 7, 8 ] ], [ , , "3(?:[014]\\d|2[0-5]|3[0-7]|55|64)\\d{7}", , , , "3012345678", , , [ 10 ] ], [ , , "800\\d{5}(?:\\d{3})?", , , , "80012345", , , [ 8, 11 ] ], [ , , "900\\d{5}", , , , "90012345", , , [ 8 ] ], [ , , , , , , , , , [ -1 ] ], [ , , "122\\d{6}", , , , "122044444", , , [ 9 ] ], [ , , , , , , , , , [ -1 ] ], "PK", 92, "00", "0", , , "0", , , , [ [ , "(\\d{3})(\\d{3})(\\d{2,7})", "$1 $2 $3", [ "[89]0" ], "0$1" ], [ , "(\\d{4})(\\d{5})", "$1 $2", [ "1" ] ], [ , "(\\d{3})(\\d{6,7})", "$1 $2", [ "2(?:3[2358]|4[2-4]|9[2-8])|45[3479]|54[2-467]|60[468]|72[236]|8(?:2[2-689]|3[23578]|4[3478]|5[2356])|9(?:2[2-8]|3[27-9]|4[2-6]|6[3569]|9[25-8])", "9(?:2[3-8]|98)|(?:2(?:3[2358]|4[2-4]|9[2-8])|45[3479]|54[2-467]|60[468]|72[236]|8(?:2[2-689]|3[23578]|4[3478]|5[2356])|9(?:22|3[27-9]|4[2-6]|6[3569]|9[25-7]))[2-9]" ], "(0$1)" ], [ , "(\\d{2})(\\d{7,8})", "$1 $2", [ "(?:2[125]|4[0-246-9]|5[1-35-7]|6[1-8]|7[14]|8[16]|91)[2-9]" ], "(0$1)" ], [ , "(\\d{5})(\\d{5})", "$1 $2", [ "58" ], "(0$1)" ], [ , "(\\d{3})(\\d{7})", "$1 $2", [ "3" ], "0$1" ], [ , "(\\d{2})(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3 $4", [ "2[125]|4[0-246-9]|5[1-35-7]|6[1-8]|7[14]|8[16]|91" ], "(0$1)" ], [ , "(\\d{3})(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3 $4", [ "[24-9]" ], "(0$1)" ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , "(?:2(?:[125]|3[2358]|4[2-4]|9[2-8])|4(?:[0-246-9]|5[3479])|5(?:[1-35-7]|4[2-467])|6(?:0[468]|[1-8])|7(?:[14]|2[236])|8(?:[16]|2[2-689]|3[23578]|4[3478]|5[2356])|9(?:1|22|3[27-9]|4[2-6]|6[3569]|9[2-7]))111\\d{6}", , , , "21111825888", , , [ 11, 12 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            PL: [ , [ , , "6\\d{5}(?:\\d{2})?|8\\d{9}|[1-9]\\d{6}(?:\\d{2})?", , , , , , , [ 6, 7, 8, 9, 10 ] ], [ , , "47\\d{7}|(?:1[2-8]|2[2-69]|3[2-4]|4[1-468]|5[24-689]|6[1-3578]|7[14-7]|8[1-79]|9[145])(?:[02-9]\\d{6}|1(?:[0-8]\\d{5}|9\\d{3}(?:\\d{2})?))", , , , "123456789", , , [ 7, 9 ] ], [ , , "211(?:1\\d|3[1-5])\\d{4}|(?:45|5[0137]|6[069]|7[2389]|88)\\d{7}", , , , "512345678", , , [ 9 ] ], [ , , "800\\d{6,7}", , , , "800123456", , , [ 9, 10 ] ], [ , , "70[01346-8]\\d{6}", , , , "701234567", , , [ 9 ] ], [ , , "801\\d{6}", , , , "801234567", , , [ 9 ] ], [ , , , , , , , , , [ -1 ] ], [ , , "39\\d{7}", , , , "391234567", , , [ 9 ] ], "PL", 48, "00", , , , , , , , [ [ , "(\\d{5})", "$1", [ "19" ] ], [ , "(\\d{3})(\\d{3})", "$1 $2", [ "11|64" ] ], [ , "(\\d{2})(\\d{2})(\\d{3})", "$1 $2 $3", [ "(?:1[2-8]|2[2-69]|3[2-4]|4[1-468]|5[24-689]|6[1-3578]|7[14-7]|8[1-79]|9[145])1", "(?:1[2-8]|2[2-69]|3[2-4]|4[1-468]|5[24-689]|6[1-3578]|7[14-7]|8[1-79]|9[145])19" ] ], [ , "(\\d{3})(\\d{2})(\\d{2,3})", "$1 $2 $3", [ "64" ] ], [ , "(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", [ "21|39|45|5[0137]|6[0469]|7[02389]|8(?:0[14]|8)" ] ], [ , "(\\d{2})(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3 $4", [ "1[2-8]|[2-7]|8[1-79]|9[145]" ] ], [ , "(\\d{3})(\\d{3})(\\d{3,4})", "$1 $2 $3", [ "8" ] ] ], , [ , , "64\\d{4,7}", , , , "641234567", , , [ 6, 7, 8, 9 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , "804\\d{6}", , , , "804123456", , , [ 9 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            PM: [ , [ , , "(?:[45]|80\\d\\d)\\d{5}", , , , , , , [ 6, 9 ] ], [ , , "(?:4[1-3]|50)\\d{4}", , , , "430123", , , [ 6 ] ], [ , , "(?:4[02-4]|5[05])\\d{4}", , , , "551234", , , [ 6 ] ], [ , , "80[0-5]\\d{6}", , , , "800012345", , , [ 9 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "PM", 508, "00", "0", , , "0", , , , [ [ , "(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3", [ "[45]" ], "0$1" ], [ , "(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", [ "8" ], "0$1" ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            PR: [ , [ , , "(?:[589]\\d\\d|787)\\d{7}", , , , , , , [ 10 ], [ 7 ] ], [ , , "(?:787|939)[2-9]\\d{6}", , , , "7872345678", , , , [ 7 ] ], [ , , "(?:787|939)[2-9]\\d{6}", , , , "7872345678", , , , [ 7 ] ], [ , , "8(?:00|33|44|55|66|77|88)[2-9]\\d{6}", , , , "8002345678" ], [ , , "900[2-9]\\d{6}", , , , "9002345678" ], [ , , , , , , , , , [ -1 ] ], [ , , "52(?:3(?:[2-46-9][02-9]\\d|5(?:[02-46-9]\\d|5[0-46-9]))|4(?:[2-478][02-9]\\d|5(?:[034]\\d|2[024-9]|5[0-46-9])|6(?:0[1-9]|[2-9]\\d)|9(?:[05-9]\\d|2[0-5]|49)))\\d{4}|52[34][2-9]1[02-9]\\d{4}|5(?:00|2[12]|33|44|66|77|88)[2-9]\\d{6}", , , , "5002345678" ], [ , , , , , , , , , [ -1 ] ], "PR", 1, "011", "1", , , "1", , , 1, , , [ , , , , , , , , , [ -1 ] ], , "787|939", [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            PS: [ , [ , , "[2489]2\\d{6}|(?:1\\d|5)\\d{8}", , , , , , , [ 8, 9, 10 ], [ 7 ] ], [ , , "(?:22[2-47-9]|42[45]|82[014-68]|92[3569])\\d{5}", , , , "22234567", , , [ 8 ], [ 7 ] ], [ , , "5[69]\\d{7}", , , , "599123456", , , [ 9 ] ], [ , , "1800\\d{6}", , , , "1800123456", , , [ 10 ] ], [ , , , , , , , , , [ -1 ] ], [ , , "1700\\d{6}", , , , "1700123456", , , [ 10 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "PS", 970, "00", "0", , , "0", , , , [ [ , "(\\d)(\\d{3})(\\d{4})", "$1 $2 $3", [ "[2489]" ], "0$1" ], [ , "(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", [ "5" ], "0$1" ], [ , "(\\d{4})(\\d{3})(\\d{3})", "$1 $2 $3", [ "1" ] ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            PT: [ , [ , , "1693\\d{5}|(?:[26-9]\\d|30)\\d{7}", , , , , , , [ 9 ] ], [ , , "2(?:[12]\\d|[35][1-689]|4[1-59]|6[1-35689]|7[1-9]|8[1-69]|9[1256])\\d{6}", , , , "212345678" ], [ , , "6[0356]92(?:30|9\\d)\\d{3}|(?:(?:16|6[0356])93|9(?:[1-36]\\d\\d|480))\\d{5}", , , , "912345678" ], [ , , "80[02]\\d{6}", , , , "800123456" ], [ , , "(?:6(?:0[178]|4[68])\\d|76(?:0[1-57]|1[2-47]|2[237]))\\d{5}", , , , "760123456" ], [ , , "80(?:8\\d|9[1579])\\d{5}", , , , "808123456" ], [ , , "884[0-4689]\\d{5}", , , , "884123456" ], [ , , "30\\d{7}", , , , "301234567" ], "PT", 351, "00", , , , , , , , [ [ , "(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", [ "2[12]" ] ], [ , "(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", [ "16|[236-9]" ] ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , "70(?:7\\d|8[17])\\d{5}", , , , "707123456" ], , , [ , , "600\\d{6}", , , , "600110000" ] ],
            PW: [ , [ , , "(?:[24-8]\\d\\d|345|900)\\d{4}", , , , , , , [ 7 ] ], [ , , "(?:2(?:55|77)|345|488|5(?:35|44|87)|6(?:22|54|79)|7(?:33|47)|8(?:24|55|76)|900)\\d{4}", , , , "2771234" ], [ , , "(?:46[0-5]|6[2-4689]0)\\d{4}|(?:45|77|88)\\d{5}", , , , "6201234" ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "PW", 680, "01[12]", , , , , , , , [ [ , "(\\d{3})(\\d{4})", "$1 $2", [ "[2-9]" ] ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            PY: [ , [ , , "59\\d{4,6}|9\\d{5,10}|(?:[2-46-8]\\d|5[0-8])\\d{4,7}", , , , , , , [ 6, 7, 8, 9, 10, 11 ], [ 5 ] ], [ , , "(?:[26]1|3[289]|4[1246-8]|7[1-3]|8[1-36])\\d{5,7}|(?:2(?:2[4-68]|[4-68]\\d|7[15]|9[1-5])|3(?:18|3[167]|4[2357]|51|[67]\\d)|4(?:3[12]|5[13]|9[1-47])|5(?:[1-4]\\d|5[02-4])|6(?:3[1-3]|44|7[1-8])|7(?:4[0-4]|5\\d|6[1-578]|75|8[0-8])|858)\\d{5,6}", , , , "212345678", , , [ 7, 8, 9 ], [ 5, 6 ] ], [ , , "9(?:51|6[129]|[78][1-6]|9[1-5])\\d{6}", , , , "961456789", , , [ 9 ] ], [ , , "9800\\d{5,7}", , , , "98000123456", , , [ 9, 10, 11 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , "8700[0-4]\\d{4}", , , , "870012345", , , [ 9 ] ], "PY", 595, "00", "0", , , "0", , , , [ [ , "(\\d{3})(\\d{3,6})", "$1 $2", [ "[2-9]0" ], "0$1" ], [ , "(\\d{2})(\\d{5})", "$1 $2", [ "[26]1|3[289]|4[1246-8]|7[1-3]|8[1-36]" ], "(0$1)" ], [ , "(\\d{3})(\\d{4,5})", "$1 $2", [ "2[279]|3[13-5]|4[359]|5|6(?:[34]|7[1-46-8])|7[46-8]|85" ], "(0$1)" ], [ , "(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", [ "2[14-68]|3[26-9]|4[1246-8]|6(?:1|75)|7[1-35]|8[1-36]" ], "(0$1)" ], [ , "(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", [ "87" ] ], [ , "(\\d{3})(\\d{6})", "$1 $2", [ "9(?:[5-79]|8[1-6])" ], "0$1" ], [ , "(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", [ "[2-8]" ], "0$1" ], [ , "(\\d{4})(\\d{3})(\\d{4})", "$1 $2 $3", [ "9" ] ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , "[2-9]0\\d{4,7}", , , , "201234567", , , [ 6, 7, 8, 9 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            QA: [ , [ , , "[2-7]\\d{7}|800\\d{4}(?:\\d{2})?|2\\d{6}", , , , , , , [ 7, 8, 9 ] ], [ , , "4141\\d{4}|(?:23|4[04])\\d{6}", , , , "44123456", , , [ 8 ] ], [ , , "(?:28|[35-7]\\d)\\d{6}", , , , "33123456", , , [ 8 ] ], [ , , "800\\d{4}(?:\\d{2})?", , , , "8001234", , , [ 7, 9 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "QA", 974, "00", , , , , , , , [ [ , "(\\d{3})(\\d{4})", "$1 $2", [ "2[126]|8" ] ], [ , "(\\d{4})(\\d{4})", "$1 $2", [ "[2-7]" ] ] ], , [ , , "2(?:[12]\\d|61)\\d{4}", , , , "2123456", , , [ 7 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            RE: [ , [ , , "9769\\d{5}|(?:26|[68]\\d)\\d{7}", , , , , , , [ 9 ] ], [ , , "26(?:2\\d\\d|30[0-5])\\d{4}", , , , "262161234" ], [ , , "(?:69(?:2\\d\\d|3(?:[06][0-46]|1[013]|2[0-2]|3[0-39]|4\\d|5[0-5]|7[0-27]|8[0-8]|9[0-479]))|9769\\d)\\d{4}", , , , "692123456" ], [ , , "80\\d{7}", , , , "801234567" ], [ , , "89[1-37-9]\\d{6}", , , , "891123456" ], [ , , "8(?:1[019]|2[0156]|84|90)\\d{6}", , , , "810123456" ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "RE", 262, "00", "0", , , "0", , , , [ [ , "(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", [ "[2689]" ], "0$1" ] ], , [ , , , , , , , , , [ -1 ] ], 1, "26[23]|69|[89]", [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            RO: [ , [ , , "(?:[2378]\\d|90)\\d{7}|[23]\\d{5}", , , , , , , [ 6, 9 ] ], [ , , "[23][13-6]\\d{7}|(?:2(?:19\\d|[3-6]\\d9)|31\\d\\d)\\d\\d", , , , "211234567" ], [ , , "7020\\d{5}|7(?:0[013-9]|1[0-3]|[2-7]\\d|8[03-8]|9[019])\\d{6}", , , , "712034567", , , [ 9 ] ], [ , , "800\\d{6}", , , , "800123456", , , [ 9 ] ], [ , , "90[0136]\\d{6}", , , , "900123456", , , [ 9 ] ], [ , , "801\\d{6}", , , , "801123456", , , [ 9 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "RO", 40, "00", "0", " int ", , "0", , , , [ [ , "(\\d{3})(\\d{3})", "$1 $2", [ "2[3-6]", "2[3-6]\\d9" ], "0$1" ], [ , "(\\d{2})(\\d{4})", "$1 $2", [ "219|31" ], "0$1" ], [ , "(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", [ "[23]1" ], "0$1" ], [ , "(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", [ "[237-9]" ], "0$1" ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , "(?:37\\d|80[578])\\d{6}", , , , "372123456", , , [ 9 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            RS: [ , [ , , "38[02-9]\\d{6,9}|6\\d{7,9}|90\\d{4,8}|38\\d{5,6}|(?:7\\d\\d|800)\\d{3,9}|(?:[12]\\d|3[0-79])\\d{5,10}", , , , , , , [ 6, 7, 8, 9, 10, 11, 12 ], [ 4, 5 ] ], [ , , "(?:11[1-9]\\d|(?:2[389]|39)(?:0[2-9]|[2-9]\\d))\\d{3,8}|(?:1[02-9]|2[0-24-7]|3[0-8])[2-9]\\d{4,9}", , , , "10234567", , , [ 7, 8, 9, 10, 11, 12 ], [ 4, 5, 6 ] ], [ , , "6(?:[0-689]|7\\d)\\d{6,7}", , , , "601234567", , , [ 8, 9, 10 ] ], [ , , "800\\d{3,9}", , , , "80012345" ], [ , , "(?:78\\d|90[0169])\\d{3,7}", , , , "90012345", , , [ 6, 7, 8, 9, 10 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "RS", 381, "00", "0", , , "0", , , , [ [ , "(\\d{3})(\\d{3,9})", "$1 $2", [ "(?:2[389]|39)0|[7-9]" ], "0$1" ], [ , "(\\d{2})(\\d{5,10})", "$1 $2", [ "[1-36]" ], "0$1" ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , "7[06]\\d{4,10}", , , , "700123456" ], , , [ , , , , , , , , , [ -1 ] ] ],
            RU: [ , [ , , "8\\d{13}|[347-9]\\d{9}", , , , , , , [ 10, 14 ], [ 7 ] ], [ , , "(?:3(?:0[12]|4[1-35-79]|5[1-3]|65|8[1-58]|9[0145])|4(?:01|1[1356]|2[13467]|7[1-5]|8[1-7]|9[1-689])|8(?:1[1-8]|2[01]|3[13-6]|4[0-8]|5[15]|6[1-35-79]|7[1-37-9]))\\d{7}", , , , "3011234567", , , [ 10 ], [ 7 ] ], [ , , "9\\d{9}", , , , "9123456789", , , [ 10 ] ], [ , , "8(?:0[04]|108\\d{3})\\d{7}", , , , "8001234567" ], [ , , "80[39]\\d{7}", , , , "8091234567", , , [ 10 ] ], [ , , , , , , , , , [ -1 ] ], [ , , "808\\d{7}", , , , "8081234567", , , [ 10 ] ], [ , , , , , , , , , [ -1 ] ], "RU", 7, "810", "8", , , "8", , "8~10", , [ [ , "(\\d{3})(\\d{2})(\\d{2})", "$1-$2-$3", [ "[0-79]" ] ], [ , "(\\d{4})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", [ "7(?:1[0-8]|2[1-9])", "7(?:1(?:[0-6]2|7|8[27])|2(?:1[23]|[2-9]2))", "7(?:1(?:[0-6]2|7|8[27])|2(?:13[03-69]|62[013-9]))|72[1-57-9]2" ], "8 ($1)", , 1 ], [ , "(\\d{5})(\\d)(\\d{2})(\\d{2})", "$1 $2 $3 $4", [ "7(?:1[0-68]|2[1-9])", "7(?:1(?:[06][3-6]|[18]|2[35]|[3-5][3-5])|2(?:[13][3-5]|[24-689]|7[457]))", "7(?:1(?:0(?:[356]|4[023])|[18]|2(?:3[013-9]|5)|3[45]|43[013-79]|5(?:3[1-8]|4[1-7]|5)|6(?:3[0-35-9]|[4-6]))|2(?:1(?:3[178]|[45])|[24-689]|3[35]|7[457]))|7(?:14|23)4[0-8]|71(?:33|45)[1-79]" ], "8 ($1)", , 1 ], [ , "(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", [ "7" ], "8 ($1)", , 1 ], [ , "(\\d{3})(\\d{3})(\\d{2})(\\d{2})", "$1 $2-$3-$4", [ "[349]|8(?:[02-7]|1[1-8])" ], "8 ($1)", , 1 ], [ , "(\\d{4})(\\d{4})(\\d{3})(\\d{3})", "$1 $2 $3 $4", [ "8" ], "8 ($1)" ] ], [ [ , "(\\d{4})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", [ "7(?:1[0-8]|2[1-9])", "7(?:1(?:[0-6]2|7|8[27])|2(?:1[23]|[2-9]2))", "7(?:1(?:[0-6]2|7|8[27])|2(?:13[03-69]|62[013-9]))|72[1-57-9]2" ], "8 ($1)", , 1 ], [ , "(\\d{5})(\\d)(\\d{2})(\\d{2})", "$1 $2 $3 $4", [ "7(?:1[0-68]|2[1-9])", "7(?:1(?:[06][3-6]|[18]|2[35]|[3-5][3-5])|2(?:[13][3-5]|[24-689]|7[457]))", "7(?:1(?:0(?:[356]|4[023])|[18]|2(?:3[013-9]|5)|3[45]|43[013-79]|5(?:3[1-8]|4[1-7]|5)|6(?:3[0-35-9]|[4-6]))|2(?:1(?:3[178]|[45])|[24-689]|3[35]|7[457]))|7(?:14|23)4[0-8]|71(?:33|45)[1-79]" ], "8 ($1)", , 1 ], [ , "(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", [ "7" ], "8 ($1)", , 1 ], [ , "(\\d{3})(\\d{3})(\\d{2})(\\d{2})", "$1 $2-$3-$4", [ "[349]|8(?:[02-7]|1[1-8])" ], "8 ($1)", , 1 ], [ , "(\\d{4})(\\d{4})(\\d{3})(\\d{3})", "$1 $2 $3 $4", [ "8" ], "8 ($1)" ] ], [ , , , , , , , , , [ -1 ] ], 1, "3[04-689]|[489]", [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            RW: [ , [ , , "(?:06|[27]\\d\\d|[89]00)\\d{6}", , , , , , , [ 8, 9 ] ], [ , , "(?:06|2[23568]\\d)\\d{6}", , , , "250123456" ], [ , , "7[2389]\\d{7}", , , , "720123456", , , [ 9 ] ], [ , , "800\\d{6}", , , , "800123456", , , [ 9 ] ], [ , , "900\\d{6}", , , , "900123456", , , [ 9 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "RW", 250, "00", "0", , , "0", , , , [ [ , "(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", [ "0" ] ], [ , "(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", [ "[7-9]" ], "0$1" ], [ , "(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", [ "2" ] ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            SA: [ , [ , , "92\\d{7}|(?:[15]|8\\d)\\d{8}", , , , , , , [ 9, 10 ], [ 7 ] ], [ , , "1(?:1\\d|2[24-8]|3[35-8]|4[3-68]|6[2-5]|7[235-7])\\d{6}", , , , "112345678", , , [ 9 ], [ 7 ] ], [ , , "579[01]\\d{5}|5(?:[013-689]\\d|7[0-36-8])\\d{6}", , , , "512345678", , , [ 9 ] ], [ , , "800\\d{7}", , , , "8001234567", , , [ 10 ] ], [ , , "925\\d{6}", , , , "925012345", , , [ 9 ] ], [ , , "920\\d{6}", , , , "920012345", , , [ 9 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "SA", 966, "00", "0", , , "0", , , , [ [ , "(\\d{4})(\\d{5})", "$1 $2", [ "9" ] ], [ , "(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", [ "1" ], "0$1" ], [ , "(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", [ "5" ], "0$1" ], [ , "(\\d{3})(\\d{3})(\\d{3,4})", "$1 $2 $3", [ "81" ], "0$1" ], [ , "(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", [ "8" ] ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , "811\\d{7}", , , , "8110123456", , , [ 10 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            SB: [ , [ , , "(?:[1-6]|[7-9]\\d\\d)\\d{4}", , , , , , , [ 5, 7 ] ], [ , , "(?:1[4-79]|[23]\\d|4[0-2]|5[03]|6[0-37])\\d{3}", , , , "40123", , , [ 5 ] ], [ , , "48\\d{3}|(?:(?:7[1-9]|8[4-9])\\d|9(?:1[2-9]|2[013-9]|3[0-2]|[46]\\d|5[0-46-9]|7[0-689]|8[0-79]|9[0-8]))\\d{4}", , , , "7421234" ], [ , , "1[38]\\d{3}", , , , "18123", , , [ 5 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , "5[12]\\d{3}", , , , "51123", , , [ 5 ] ], "SB", 677, "0[01]", , , , , , , , [ [ , "(\\d{2})(\\d{5})", "$1 $2", [ "7|8[4-9]|9(?:[1-8]|9[0-8])" ] ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            SC: [ , [ , , "8000\\d{3}|(?:[249]\\d|64)\\d{5}", , , , , , , [ 7 ] ], [ , , "4[2-46]\\d{5}", , , , "4217123" ], [ , , "2[5-8]\\d{5}", , , , "2510123" ], [ , , "8000\\d{3}", , , , "8000000" ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , "971\\d{4}|(?:64|95)\\d{5}", , , , "6412345" ], "SC", 248, "010|0[0-2]", , , , , , "00", , [ [ , "(\\d)(\\d{3})(\\d{3})", "$1 $2 $3", [ "[246]|9[57]" ] ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            SD: [ , [ , , "[19]\\d{8}", , , , , , , [ 9 ] ], [ , , "1(?:5\\d|8[35-7])\\d{6}", , , , "153123456" ], [ , , "(?:1[0-2]|9[0-3569])\\d{7}", , , , "911231234" ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "SD", 249, "00", "0", , , "0", , , , [ [ , "(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", [ "[19]" ], "0$1" ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            SE: [ , [ , , "(?:[26]\\d\\d|9)\\d{9}|[1-9]\\d{8}|[1-689]\\d{7}|[1-4689]\\d{6}|2\\d{5}", , , , , , , [ 6, 7, 8, 9, 10, 12 ] ], [ , , "(?:(?:[12][136]|3[356]|4[0246]|6[03]|8\\d)\\d|90[1-9])\\d{4,6}|(?:1(?:2[0-35]|4[0-4]|5[0-25-9]|7[13-6]|[89]\\d)|2(?:2[0-7]|4[0136-8]|5[0138]|7[018]|8[01]|9[0-57])|3(?:0[0-4]|1\\d|2[0-25]|4[056]|7[0-2]|8[0-3]|9[023])|4(?:1[013-8]|3[0135]|5[14-79]|7[0-246-9]|8[0156]|9[0-689])|5(?:0[0-6]|[15][0-5]|2[0-68]|3[0-4]|4\\d|6[03-5]|7[013]|8[0-79]|9[01])|6(?:1[1-3]|2[0-4]|4[02-57]|5[0-37]|6[0-3]|7[0-2]|8[0247]|9[0-356])|9(?:1[0-68]|2\\d|3[02-5]|4[0-3]|5[0-4]|[68][01]|7[0135-8]))\\d{5,6}", , , , "8123456", , , [ 7, 8, 9 ] ], [ , , "7[02369]\\d{7}", , , , "701234567", , , [ 9 ] ], [ , , "20\\d{4,7}", , , , "20123456", , , [ 6, 7, 8, 9 ] ], [ , , "649\\d{6}|9(?:00|39|44)[1-8]\\d{3,6}", , , , "9001234567", , , [ 7, 8, 9, 10 ] ], [ , , "77[0-7]\\d{6}", , , , "771234567", , , [ 9 ] ], [ , , "75[1-8]\\d{6}", , , , "751234567", , , [ 9 ] ], [ , , , , , , , , , [ -1 ] ], "SE", 46, "00", "0", , , "0", , , , [ [ , "(\\d{2})(\\d{2,3})(\\d{2})", "$1-$2 $3", [ "20" ], "0$1" ], [ , "(\\d{3})(\\d{4})", "$1-$2", [ "9(?:00|39|44)" ], "0$1" ], [ , "(\\d{2})(\\d{3})(\\d{2})", "$1-$2 $3", [ "[12][136]|3[356]|4[0246]|6[03]|90[1-9]" ], "0$1" ], [ , "(\\d)(\\d{2,3})(\\d{2})(\\d{2})", "$1-$2 $3 $4", [ "8" ], "0$1" ], [ , "(\\d{3})(\\d{2,3})(\\d{2})", "$1-$2 $3", [ "1[2457]|2(?:[247-9]|5[0138])|3[0247-9]|4[1357-9]|5[0-35-9]|6(?:[125689]|4[02-57]|7[0-2])|9(?:[125-8]|3[02-5]|4[0-3])" ], "0$1" ], [ , "(\\d{3})(\\d{2,3})(\\d{3})", "$1-$2 $3", [ "9(?:00|39|44)" ], "0$1" ], [ , "(\\d{2})(\\d{2,3})(\\d{2})(\\d{2})", "$1-$2 $3 $4", [ "1[13689]|2[0136]|3[1356]|4[0246]|54|6[03]|90[1-9]" ], "0$1" ], [ , "(\\d{2})(\\d{3})(\\d{2})(\\d{2})", "$1-$2 $3 $4", [ "10|7" ], "0$1" ], [ , "(\\d)(\\d{3})(\\d{3})(\\d{2})", "$1-$2 $3 $4", [ "8" ], "0$1" ], [ , "(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1-$2 $3 $4", [ "[13-5]|2(?:[247-9]|5[0138])|6(?:[124-689]|7[0-2])|9(?:[125-8]|3[02-5]|4[0-3])" ], "0$1" ], [ , "(\\d{3})(\\d{2})(\\d{2})(\\d{3})", "$1-$2 $3 $4", [ "9" ], "0$1" ], [ , "(\\d{3})(\\d{2})(\\d{3})(\\d{2})(\\d{2})", "$1-$2 $3 $4 $5", [ "[26]" ], "0$1" ] ], [ [ , "(\\d{2})(\\d{2,3})(\\d{2})", "$1 $2 $3", [ "20" ] ], [ , "(\\d{3})(\\d{4})", "$1 $2", [ "9(?:00|39|44)" ] ], [ , "(\\d{2})(\\d{3})(\\d{2})", "$1 $2 $3", [ "[12][136]|3[356]|4[0246]|6[03]|90[1-9]" ] ], [ , "(\\d)(\\d{2,3})(\\d{2})(\\d{2})", "$1 $2 $3 $4", [ "8" ] ], [ , "(\\d{3})(\\d{2,3})(\\d{2})", "$1 $2 $3", [ "1[2457]|2(?:[247-9]|5[0138])|3[0247-9]|4[1357-9]|5[0-35-9]|6(?:[125689]|4[02-57]|7[0-2])|9(?:[125-8]|3[02-5]|4[0-3])" ] ], [ , "(\\d{3})(\\d{2,3})(\\d{3})", "$1 $2 $3", [ "9(?:00|39|44)" ] ], [ , "(\\d{2})(\\d{2,3})(\\d{2})(\\d{2})", "$1 $2 $3 $4", [ "1[13689]|2[0136]|3[1356]|4[0246]|54|6[03]|90[1-9]" ] ], [ , "(\\d{2})(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3 $4", [ "10|7" ] ], [ , "(\\d)(\\d{3})(\\d{3})(\\d{2})", "$1 $2 $3 $4", [ "8" ] ], [ , "(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", [ "[13-5]|2(?:[247-9]|5[0138])|6(?:[124-689]|7[0-2])|9(?:[125-8]|3[02-5]|4[0-3])" ] ], [ , "(\\d{3})(\\d{2})(\\d{2})(\\d{3})", "$1 $2 $3 $4", [ "9" ] ], [ , "(\\d{3})(\\d{2})(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3 $4 $5", [ "[26]" ] ] ], [ , , "74[02-9]\\d{6}", , , , "740123456", , , [ 9 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , "10[1-8]\\d{6}", , , , "102345678", , , [ 9 ] ], , , [ , , "(?:25[245]|67[3-68])\\d{9}", , , , "254123456789", , , [ 12 ] ] ],
            SG: [ , [ , , "(?:(?:1\\d|8)\\d\\d|7000)\\d{7}|[3689]\\d{7}", , , , , , , [ 8, 10, 11 ] ], [ , , "662[0-24-9]\\d{4}|6(?:[1-578]\\d|6[013-57-9]|9[0-35-9])\\d{5}", , , , "61234567", , , [ 8 ] ], [ , , "895[0-2]\\d{4}|(?:8(?:0[1-4]|[1-8]\\d|9[0-4])|9[0-8]\\d)\\d{5}", , , , "81234567", , , [ 8 ] ], [ , , "(?:18|8)00\\d{7}", , , , "18001234567", , , [ 10, 11 ] ], [ , , "1900\\d{7}", , , , "19001234567", , , [ 11 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , "(?:3[12]\\d|666)\\d{5}", , , , "31234567", , , [ 8 ] ], "SG", 65, "0[0-3]\\d", , , , , , , , [ [ , "(\\d{4,5})", "$1", [ "1[013-9]|77", "1(?:[013-8]|9(?:0[1-9]|[1-9]))|77" ] ], [ , "(\\d{4})(\\d{4})", "$1 $2", [ "[369]|8(?:0[1-4]|[1-9])" ] ], [ , "(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", [ "8" ] ], [ , "(\\d{4})(\\d{4})(\\d{3})", "$1 $2 $3", [ "7" ] ], [ , "(\\d{4})(\\d{3})(\\d{4})", "$1 $2 $3", [ "1" ] ] ], [ [ , "(\\d{4})(\\d{4})", "$1 $2", [ "[369]|8(?:0[1-4]|[1-9])" ] ], [ , "(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", [ "8" ] ], [ , "(\\d{4})(\\d{4})(\\d{3})", "$1 $2 $3", [ "7" ] ], [ , "(\\d{4})(\\d{3})(\\d{4})", "$1 $2 $3", [ "1" ] ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , "7000\\d{7}", , , , "70001234567", , , [ 11 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            SH: [ , [ , , "(?:[256]\\d|8)\\d{3}", , , , , , , [ 4, 5 ] ], [ , , "2(?:[0-57-9]\\d|6[4-9])\\d\\d", , , , "22158" ], [ , , "[56]\\d{4}", , , , "51234", , , [ 5 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , "262\\d\\d", , , , "26212", , , [ 5 ] ], "SH", 290, "00", , , , , , , , , , [ , , , , , , , , , [ -1 ] ], 1, "[256]", [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            SI: [ , [ , , "[1-7]\\d{7}|8\\d{4,7}|90\\d{4,6}", , , , , , , [ 5, 6, 7, 8 ] ], [ , , "(?:[1-357][2-8]|4[24-8])\\d{6}", , , , "12345678", , , [ 8 ], [ 7 ] ], [ , , "65(?:1\\d|55|[67]0)\\d{4}|(?:[37][01]|4[0139]|51|6[489])\\d{6}", , , , "31234567", , , [ 8 ] ], [ , , "80\\d{4,6}", , , , "80123456", , , [ 6, 7, 8 ] ], [ , , "89[1-3]\\d{2,5}|90\\d{4,6}", , , , "90123456" ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , "(?:59\\d\\d|8(?:1(?:[67]\\d|8[0-489])|2(?:0\\d|2[0-37-9]|8[0-2489])|3[389]\\d))\\d{4}", , , , "59012345", , , [ 8 ] ], "SI", 386, "00|10(?:22|66|88|99)", "0", , , "0", , "00", , [ [ , "(\\d{2})(\\d{3,6})", "$1 $2", [ "8[09]|9" ], "0$1" ], [ , "(\\d{3})(\\d{5})", "$1 $2", [ "59|8" ], "0$1" ], [ , "(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", [ "[37][01]|4[0139]|51|6" ], "0$1" ], [ , "(\\d)(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3 $4", [ "[1-57]" ], "(0$1)" ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            SJ: [ , [ , , "0\\d{4}|(?:[489]\\d|[57]9)\\d{6}", , , , , , , [ 5, 8 ] ], [ , , "79\\d{6}", , , , "79123456", , , [ 8 ] ], [ , , "(?:4[015-8]|59|9\\d)\\d{6}", , , , "41234567", , , [ 8 ] ], [ , , "80[01]\\d{5}", , , , "80012345", , , [ 8 ] ], [ , , "82[09]\\d{5}", , , , "82012345", , , [ 8 ] ], [ , , "810(?:0[0-6]|[2-8]\\d)\\d{3}", , , , "81021234", , , [ 8 ] ], [ , , "880\\d{5}", , , , "88012345", , , [ 8 ] ], [ , , "85[0-5]\\d{5}", , , , "85012345", , , [ 8 ] ], "SJ", 47, "00", , , , , , , , , , [ , , , , , , , , , [ -1 ] ], , "79", [ , , , , , , , , , [ -1 ] ], [ , , "(?:0[2-9]|81(?:0(?:0[7-9]|1\\d)|5\\d\\d))\\d{3}", , , , "02000" ], , , [ , , "81[23]\\d{5}", , , , "81212345", , , [ 8 ] ] ],
            SK: [ , [ , , "[2-689]\\d{8}|[2-59]\\d{6}|[2-5]\\d{5}", , , , , , , [ 6, 7, 9 ] ], [ , , "(?:2(?:16|[2-9]\\d{3})|(?:(?:[3-5][1-8]\\d|819)\\d|601[1-5])\\d)\\d{4}|(?:2|[3-5][1-8])1[67]\\d{3}|[3-5][1-8]16\\d\\d", , , , "221234567" ], [ , , "909[1-9]\\d{5}|9(?:0[1-8]|1[0-24-9]|4[03-57-9]|5\\d)\\d{6}", , , , "912123456", , , [ 9 ] ], [ , , "800\\d{6}", , , , "800123456", , , [ 9 ] ], [ , , "9(?:00|[78]\\d)\\d{6}", , , , "900123456", , , [ 9 ] ], [ , , "8[5-9]\\d{7}", , , , "850123456", , , [ 9 ] ], [ , , , , , , , , , [ -1 ] ], [ , , "6(?:02|5[0-4]|9[0-6])\\d{6}", , , , "690123456", , , [ 9 ] ], "SK", 421, "00", "0", , , "0", , , , [ [ , "(\\d)(\\d{2})(\\d{3,4})", "$1 $2 $3", [ "21" ], "0$1" ], [ , "(\\d{2})(\\d{2})(\\d{2,3})", "$1 $2 $3", [ "[3-5][1-8]1", "[3-5][1-8]1[67]" ], "0$1" ], [ , "(\\d{4})(\\d{3})", "$1 $2", [ "909", "9090" ], "0$1" ], [ , "(\\d)(\\d{3})(\\d{3})(\\d{2})", "$1/$2 $3 $4", [ "2" ], "0$1" ], [ , "(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", [ "[689]" ], "0$1" ], [ , "(\\d{2})(\\d{3})(\\d{2})(\\d{2})", "$1/$2 $3 $4", [ "[3-5]" ], "0$1" ] ], [ [ , "(\\d)(\\d{2})(\\d{3,4})", "$1 $2 $3", [ "21" ], "0$1" ], [ , "(\\d{2})(\\d{2})(\\d{2,3})", "$1 $2 $3", [ "[3-5][1-8]1", "[3-5][1-8]1[67]" ], "0$1" ], [ , "(\\d)(\\d{3})(\\d{3})(\\d{2})", "$1/$2 $3 $4", [ "2" ], "0$1" ], [ , "(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", [ "[689]" ], "0$1" ], [ , "(\\d{2})(\\d{3})(\\d{2})(\\d{2})", "$1/$2 $3 $4", [ "[3-5]" ], "0$1" ] ], [ , , "9090\\d{3}", , , , "9090123", , , [ 7 ] ], , , [ , , "9090\\d{3}|(?:602|8(?:00|[5-9]\\d)|9(?:00|[78]\\d))\\d{6}", , , , , , , [ 7, 9 ] ], [ , , "96\\d{7}", , , , "961234567", , , [ 9 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            SL: [ , [ , , "(?:[237-9]\\d|66)\\d{6}", , , , , , , [ 8 ], [ 6 ] ], [ , , "22[2-4][2-9]\\d{4}", , , , "22221234", , , , [ 6 ] ], [ , , "(?:25|3[0-5]|66|7[3-9]|8[08]|9[09])\\d{6}", , , , "25123456" ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "SL", 232, "00", "0", , , "0", , , , [ [ , "(\\d{2})(\\d{6})", "$1 $2", [ "[236-9]" ], "(0$1)" ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            SM: [ , [ , , "(?:0549|[5-7]\\d)\\d{6}", , , , , , , [ 8, 10 ], [ 6 ] ], [ , , "0549(?:8[0157-9]|9\\d)\\d{4}", , , , "0549886377", , , [ 10 ], [ 6 ] ], [ , , "6[16]\\d{6}", , , , "66661212", , , [ 8 ] ], [ , , , , , , , , , [ -1 ] ], [ , , "7[178]\\d{6}", , , , "71123456", , , [ 8 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , "5[158]\\d{6}", , , , "58001110", , , [ 8 ] ], "SM", 378, "00", , , , "([89]\\d{5})$", "0549$1", , , [ [ , "(\\d{6})", "$1", [ "[89]" ] ], [ , "(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", [ "[5-7]" ] ], [ , "(\\d{4})(\\d{6})", "$1 $2", [ "0" ] ] ], [ [ , "(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", [ "[5-7]" ] ], [ , "(\\d{4})(\\d{6})", "$1 $2", [ "0" ] ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            SN: [ , [ , , "(?:[378]\\d|93)\\d{7}", , , , , , , [ 9 ] ], [ , , "3(?:0(?:1[0-2]|80)|282|3(?:8[1-9]|9[3-9])|611)\\d{5}", , , , "301012345" ], [ , , "75(?:01|[38]3)\\d{5}|7(?:[06-8]\\d|21|5[4-7]|90)\\d{6}", , , , "701234567" ], [ , , "800\\d{6}", , , , "800123456" ], [ , , "88[4689]\\d{6}", , , , "884123456" ], [ , , "81[02468]\\d{6}", , , , "810123456" ], [ , , , , , , , , , [ -1 ] ], [ , , "(?:3(?:392|9[01]\\d)\\d|93(?:3[13]0|929))\\d{4}", , , , "933301234" ], "SN", 221, "00", , , , , , , , [ [ , "(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", [ "8" ] ], [ , "(\\d{2})(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3 $4", [ "[379]" ] ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            SO: [ , [ , , "[346-9]\\d{8}|[12679]\\d{7}|[1-5]\\d{6}|[1348]\\d{5}", , , , , , , [ 6, 7, 8, 9 ] ], [ , , "(?:1\\d|2[0-79]|3[0-46-8]|4[0-7]|5[57-9])\\d{5}|(?:[134]\\d|8[125])\\d{4}", , , , "4012345", , , [ 6, 7 ] ], [ , , "(?:(?:15|(?:3[59]|4[89]|79|8[08])\\d|6(?:0[5-7]|[1-9]\\d)|9(?:0\\d|[2-9]))\\d|2(?:4\\d|8))\\d{5}|(?:6\\d|7[1-9])\\d{6}", , , , "71123456", , , [ 7, 8, 9 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "SO", 252, "00", "0", , , "0", , , , [ [ , "(\\d{2})(\\d{4})", "$1 $2", [ "8[125]" ] ], [ , "(\\d{6})", "$1", [ "[134]" ] ], [ , "(\\d)(\\d{6})", "$1 $2", [ "[15]|2[0-79]|3[0-46-8]|4[0-7]" ] ], [ , "(\\d)(\\d{7})", "$1 $2", [ "24|[67]" ] ], [ , "(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", [ "[3478]|64|90" ] ], [ , "(\\d{2})(\\d{5,7})", "$1 $2", [ "1|28|6(?:0[5-7]|[1-35-9])|9[2-9]" ] ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            SR: [ , [ , , "(?:[2-5]|68|[78]\\d)\\d{5}", , , , , , , [ 6, 7 ] ], [ , , "(?:2[1-3]|3[0-7]|(?:4|68)\\d|5[2-58])\\d{4}", , , , "211234" ], [ , , "(?:7[124-7]|8[124-9])\\d{5}", , , , "7412345", , , [ 7 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , "56\\d{4}", , , , "561234", , , [ 6 ] ], "SR", 597, "00", , , , , , , , [ [ , "(\\d{2})(\\d{2})(\\d{2})", "$1-$2-$3", [ "56" ] ], [ , "(\\d{3})(\\d{3})", "$1-$2", [ "[2-5]" ] ], [ , "(\\d{3})(\\d{4})", "$1-$2", [ "[6-8]" ] ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            SS: [ , [ , , "[19]\\d{8}", , , , , , , [ 9 ] ], [ , , "1[89]\\d{7}", , , , "181234567" ], [ , , "(?:12|9[1257-9])\\d{7}", , , , "977123456" ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "SS", 211, "00", "0", , , "0", , , , [ [ , "(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", [ "[19]" ], "0$1" ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            ST: [ , [ , , "(?:22|9\\d)\\d{5}", , , , , , , [ 7 ] ], [ , , "22\\d{5}", , , , "2221234" ], [ , , "900[5-9]\\d{3}|9(?:0[1-9]|[89]\\d)\\d{4}", , , , "9812345" ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "ST", 239, "00", , , , , , , , [ [ , "(\\d{3})(\\d{4})", "$1 $2", [ "[29]" ] ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            SV: [ , [ , , "[267]\\d{7}|[89]00\\d{4}(?:\\d{4})?", , , , , , , [ 7, 8, 11 ] ], [ , , "2(?:[1-6]\\d{3}|[79]90[034]|890[0245])\\d{3}", , , , "21234567", , , [ 8 ] ], [ , , "66(?:[02-9]\\d\\d|1(?:[02-9]\\d|16))\\d{3}|(?:6[0-57-9]|7\\d)\\d{6}", , , , "70123456", , , [ 8 ] ], [ , , "800\\d{4}(?:\\d{4})?", , , , "8001234", , , [ 7, 11 ] ], [ , , "900\\d{4}(?:\\d{4})?", , , , "9001234", , , [ 7, 11 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "SV", 503, "00", , , , , , , , [ [ , "(\\d{3})(\\d{4})", "$1 $2", [ "[89]" ] ], [ , "(\\d{4})(\\d{4})", "$1 $2", [ "[267]" ] ], [ , "(\\d{3})(\\d{4})(\\d{4})", "$1 $2 $3", [ "[89]" ] ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            SX: [ , [ , , "7215\\d{6}|(?:[58]\\d\\d|900)\\d{7}", , , , , , , [ 10 ], [ 7 ] ], [ , , "7215(?:4[2-8]|8[239]|9[056])\\d{4}", , , , "7215425678", , , , [ 7 ] ], [ , , "7215(?:1[02]|2\\d|5[034679]|8[014-8])\\d{4}", , , , "7215205678", , , , [ 7 ] ], [ , , "8(?:00|33|44|55|66|77|88)[2-9]\\d{6}", , , , "8002123456" ], [ , , "900[2-9]\\d{6}", , , , "9002123456" ], [ , , , , , , , , , [ -1 ] ], [ , , "52(?:3(?:[2-46-9][02-9]\\d|5(?:[02-46-9]\\d|5[0-46-9]))|4(?:[2-478][02-9]\\d|5(?:[034]\\d|2[024-9]|5[0-46-9])|6(?:0[1-9]|[2-9]\\d)|9(?:[05-9]\\d|2[0-5]|49)))\\d{4}|52[34][2-9]1[02-9]\\d{4}|5(?:00|2[12]|33|44|66|77|88)[2-9]\\d{6}", , , , "5002345678" ], [ , , , , , , , , , [ -1 ] ], "SX", 1, "011", "1", , , "1|(5\\d{6})$", "721$1", , , , , [ , , , , , , , , , [ -1 ] ], , "721", [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            SY: [ , [ , , "[1-39]\\d{8}|[1-5]\\d{7}", , , , , , , [ 8, 9 ], [ 6, 7 ] ], [ , , "21\\d{6,7}|(?:1(?:[14]\\d|[2356])|2[235]|3(?:[13]\\d|4)|4[134]|5[1-3])\\d{6}", , , , "112345678", , , , [ 6, 7 ] ], [ , , "9(?:22|[3-689]\\d)\\d{6}", , , , "944567890", , , [ 9 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "SY", 963, "00", "0", , , "0", , , , [ [ , "(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", [ "[1-5]" ], "0$1", , 1 ], [ , "(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", [ "9" ], "0$1", , 1 ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            SZ: [ , [ , , "0800\\d{4}|(?:[237]\\d|900)\\d{6}", , , , , , , [ 8, 9 ] ], [ , , "[23][2-5]\\d{6}", , , , "22171234", , , [ 8 ] ], [ , , "7[6-9]\\d{6}", , , , "76123456", , , [ 8 ] ], [ , , "0800\\d{4}", , , , "08001234", , , [ 8 ] ], [ , , "900\\d{6}", , , , "900012345", , , [ 9 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , "70\\d{6}", , , , "70012345", , , [ 8 ] ], "SZ", 268, "00", , , , , , , , [ [ , "(\\d{4})(\\d{4})", "$1 $2", [ "[0237]" ] ], [ , "(\\d{5})(\\d{4})", "$1 $2", [ "9" ] ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , "0800\\d{4}", , , , , , , [ 8 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            TA: [ , [ , , "8\\d{3}", , , , , , , [ 4 ] ], [ , , "8\\d{3}", , , , "8999" ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "TA", 290, "00", , , , , , , , , , [ , , , , , , , , , [ -1 ] ], , "8", [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            TC: [ , [ , , "(?:[58]\\d\\d|649|900)\\d{7}", , , , , , , [ 10 ], [ 7 ] ], [ , , "649(?:266|712|9(?:4\\d|50))\\d{4}", , , , "6497121234", , , , [ 7 ] ], [ , , "649(?:2(?:3[129]|4[1-79])|3\\d\\d|4[34][1-3])\\d{4}", , , , "6492311234", , , , [ 7 ] ], [ , , "8(?:00|33|44|55|66|77|88)[2-9]\\d{6}", , , , "8002345678" ], [ , , "900[2-9]\\d{6}", , , , "9002345678" ], [ , , , , , , , , , [ -1 ] ], [ , , "52(?:3(?:[2-46-9][02-9]\\d|5(?:[02-46-9]\\d|5[0-46-9]))|4(?:[2-478][02-9]\\d|5(?:[034]\\d|2[024-9]|5[0-46-9])|6(?:0[1-9]|[2-9]\\d)|9(?:[05-9]\\d|2[0-5]|49)))\\d{4}|52[34][2-9]1[02-9]\\d{4}|5(?:00|2[12]|33|44|66|77|88)[2-9]\\d{6}", , , , "5002345678" ], [ , , "649(?:71[01]|966)\\d{4}", , , , "6497101234", , , , [ 7 ] ], "TC", 1, "011", "1", , , "1|([2-479]\\d{6})$", "649$1", , , , , [ , , , , , , , , , [ -1 ] ], , "649", [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            TD: [ , [ , , "(?:22|[69]\\d|77)\\d{6}", , , , , , , [ 8 ] ], [ , , "22(?:[37-9]0|5[0-5]|6[89])\\d{4}", , , , "22501234" ], [ , , "(?:6[023568]|77|9\\d)\\d{6}", , , , "63012345" ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "TD", 235, "00|16", , , , , , "00", , [ [ , "(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", [ "[2679]" ] ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            TG: [ , [ , , "[279]\\d{7}", , , , , , , [ 8 ] ], [ , , "2(?:2[2-7]|3[23]|4[45]|55|6[67]|77)\\d{5}", , , , "22212345" ], [ , , "(?:7[09]|9[0-36-9])\\d{6}", , , , "90112345" ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "TG", 228, "00", , , , , , , , [ [ , "(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", [ "[279]" ] ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            TH: [ , [ , , "(?:001800|[2-57]|[689]\\d)\\d{7}|1\\d{7,9}", , , , , , , [ 8, 9, 10, 13 ] ], [ , , "(?:1[0689]|2\\d|3[2-9]|4[2-5]|5[2-6]|7[3-7])\\d{6}", , , , "21234567", , , [ 8 ] ], [ , , "671[0-8]\\d{5}|(?:14|6[1-6]|[89]\\d)\\d{7}", , , , "812345678", , , [ 9 ] ], [ , , "(?:001800\\d|1800)\\d{6}", , , , "1800123456", , , [ 10, 13 ] ], [ , , "1900\\d{6}", , , , "1900123456", , , [ 10 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , "6[08]\\d{7}", , , , "601234567", , , [ 9 ] ], "TH", 66, "00[1-9]", "0", , , "0", , , , [ [ , "(\\d)(\\d{3})(\\d{4})", "$1 $2 $3", [ "2" ], "0$1" ], [ , "(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", [ "[13-9]" ], "0$1" ], [ , "(\\d{4})(\\d{3})(\\d{3})", "$1 $2 $3", [ "1" ] ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            TJ: [ , [ , , "(?:00|[1-57-9]\\d)\\d{7}", , , , , , , [ 9 ], [ 3, 5, 6, 7 ] ], [ , , "(?:3(?:1[3-5]|2[245]|3[12]|4[24-7]|5[25]|72)|4(?:46|74|87))\\d{6}", , , , "372123456", , , , [ 3, 5, 6, 7 ] ], [ , , "41[18]\\d{6}|(?:[034]0|1[01]|2[02]|5[05]|7[017]|8[08]|9\\d)\\d{7}", , , , "917123456" ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "TJ", 992, "810", , , , , , "8~10", , [ [ , "(\\d{6})(\\d)(\\d{2})", "$1 $2 $3", [ "331", "3317" ] ], [ , "(\\d{3})(\\d{2})(\\d{4})", "$1 $2 $3", [ "[34]7|91[78]" ] ], [ , "(\\d{4})(\\d)(\\d{4})", "$1 $2 $3", [ "3[1-5]" ] ], [ , "(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", [ "[0-57-9]" ] ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            TK: [ , [ , , "[2-47]\\d{3,6}", , , , , , , [ 4, 5, 6, 7 ] ], [ , , "(?:2[2-4]|[34]\\d)\\d{2,5}", , , , "3101" ], [ , , "7[2-4]\\d{2,5}", , , , "7290" ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "TK", 690, "00", , , , , , , , , , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            TL: [ , [ , , "7\\d{7}|(?:[2-47]\\d|[89]0)\\d{5}", , , , , , , [ 7, 8 ] ], [ , , "(?:2[1-5]|3[1-9]|4[1-4])\\d{5}", , , , "2112345", , , [ 7 ] ], [ , , "7[2-8]\\d{6}", , , , "77212345", , , [ 8 ] ], [ , , "80\\d{5}", , , , "8012345", , , [ 7 ] ], [ , , "90\\d{5}", , , , "9012345", , , [ 7 ] ], [ , , , , , , , , , [ -1 ] ], [ , , "70\\d{5}", , , , "7012345", , , [ 7 ] ], [ , , , , , , , , , [ -1 ] ], "TL", 670, "00", , , , , , , , [ [ , "(\\d{3})(\\d{4})", "$1 $2", [ "[2-489]|70" ] ], [ , "(\\d{4})(\\d{4})", "$1 $2", [ "7" ] ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            TM: [ , [ , , "[1-6]\\d{7}", , , , , , , [ 8 ] ], [ , , "(?:1(?:2\\d|3[1-9])|2(?:22|4[0-35-8])|3(?:22|4[03-9])|4(?:22|3[128]|4\\d|6[15])|5(?:22|5[7-9]|6[014-689]))\\d{5}", , , , "12345678" ], [ , , "6\\d{7}", , , , "66123456" ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "TM", 993, "810", "8", , , "8", , "8~10", , [ [ , "(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2-$3-$4", [ "12" ], "(8 $1)" ], [ , "(\\d{3})(\\d)(\\d{2})(\\d{2})", "$1 $2-$3-$4", [ "[1-5]" ], "(8 $1)" ], [ , "(\\d{2})(\\d{6})", "$1 $2", [ "6" ], "8 $1" ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            TN: [ , [ , , "[2-57-9]\\d{7}", , , , , , , [ 8 ] ], [ , , "81200\\d{3}|(?:3[0-2]|7\\d)\\d{6}", , , , "30010123" ], [ , , "3(?:001|[12]40)\\d{4}|(?:(?:[259]\\d|4[0-7])\\d|3(?:1[1-35]|6[0-4]|91))\\d{5}", , , , "20123456" ], [ , , "8010\\d{4}", , , , "80101234" ], [ , , "88\\d{6}", , , , "88123456" ], [ , , "8[12]10\\d{4}", , , , "81101234" ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "TN", 216, "00", , , , , , , , [ [ , "(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", [ "[2-57-9]" ] ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            TO: [ , [ , , "(?:0800|(?:[5-8]\\d\\d|999)\\d)\\d{3}|[2-8]\\d{4}", , , , , , , [ 5, 7 ] ], [ , , "(?:2\\d|3[0-8]|4[0-4]|50|6[09]|7[0-24-69]|8[05])\\d{3}", , , , "20123", , , [ 5 ] ], [ , , "(?:55[4-6]|6(?:[09]\\d|3[02]|8[15-9])|(?:7\\d|8[46-9])\\d|999)\\d{4}", , , , "7715123", , , [ 7 ] ], [ , , "0800\\d{3}", , , , "0800222", , , [ 7 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , "55[0-37-9]\\d{4}", , , , "5510123", , , [ 7 ] ], "TO", 676, "00", , , , , , , , [ [ , "(\\d{2})(\\d{3})", "$1-$2", [ "[2-4]|50|6[09]|7[0-24-69]|8[05]" ] ], [ , "(\\d{4})(\\d{3})", "$1 $2", [ "0" ] ], [ , "(\\d{3})(\\d{4})", "$1 $2", [ "[5-9]" ] ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            TR: [ , [ , , "4\\d{6}|8\\d{11,12}|(?:[2-58]\\d\\d|900)\\d{7}", , , , , , , [ 7, 10, 12, 13 ] ], [ , , "(?:2(?:[13][26]|[28][2468]|[45][268]|[67][246])|3(?:[13][28]|[24-6][2468]|[78][02468]|92)|4(?:[16][246]|[23578][2468]|4[26]))\\d{7}", , , , "2123456789", , , [ 10 ] ], [ , , "56161\\d{5}|5(?:0[15-7]|1[06]|24|[34]\\d|5[1-59]|9[46])\\d{7}", , , , "5012345678", , , [ 10 ] ], [ , , "8(?:00\\d{7}(?:\\d{2,3})?|11\\d{7})", , , , "8001234567", , , [ 10, 12, 13 ] ], [ , , "(?:8[89]8|900)\\d{7}", , , , "9001234567", , , [ 10 ] ], [ , , , , , , , , , [ -1 ] ], [ , , "592(?:21[12]|461)\\d{4}", , , , "5922121234", , , [ 10 ] ], [ , , "850\\d{7}", , , , "8500123456", , , [ 10 ] ], "TR", 90, "00", "0", , , "0", , , , [ [ , "(\\d{3})(\\d)(\\d{3})", "$1 $2 $3", [ "444" ], , , 1 ], [ , "(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", [ "512|8[01589]|90" ], "0$1", , 1 ], [ , "(\\d{3})(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3 $4", [ "5(?:[0-59]|61)", "5(?:[0-59]|616)", "5(?:[0-59]|6161)" ], "0$1", , 1 ], [ , "(\\d{3})(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3 $4", [ "[24][1-8]|3[1-9]" ], "(0$1)", , 1 ], [ , "(\\d{3})(\\d{3})(\\d{6,7})", "$1 $2 $3", [ "80" ], "0$1", , 1 ] ], [ [ , "(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", [ "512|8[01589]|90" ], "0$1", , 1 ], [ , "(\\d{3})(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3 $4", [ "5(?:[0-59]|61)", "5(?:[0-59]|616)", "5(?:[0-59]|6161)" ], "0$1", , 1 ], [ , "(\\d{3})(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3 $4", [ "[24][1-8]|3[1-9]" ], "(0$1)", , 1 ], [ , "(\\d{3})(\\d{3})(\\d{6,7})", "$1 $2 $3", [ "80" ], "0$1", , 1 ] ], [ , , "512\\d{7}", , , , "5123456789", , , [ 10 ] ], , , [ , , "(?:444|811\\d{3})\\d{4}", , , , , , , [ 7, 10 ] ], [ , , "444\\d{4}", , , , "4441444", , , [ 7 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            TT: [ , [ , , "(?:[58]\\d\\d|900)\\d{7}", , , , , , , [ 10 ], [ 7 ] ], [ , , "868(?:2(?:0[13]|1[89]|[23]\\d|4[0-2])|6(?:0[7-9]|1[02-8]|2[1-9]|[3-69]\\d|7[0-79])|82[124])\\d{4}", , , , "8682211234", , , , [ 7 ] ], [ , , "868(?:(?:2[5-9]|3\\d)\\d|4(?:3[0-6]|[6-9]\\d)|6(?:20|78|8\\d)|7(?:0[1-9]|1[02-9]|[2-9]\\d))\\d{4}", , , , "8682911234", , , , [ 7 ] ], [ , , "8(?:00|33|44|55|66|77|88)[2-9]\\d{6}", , , , "8002345678" ], [ , , "900[2-9]\\d{6}", , , , "9002345678" ], [ , , , , , , , , , [ -1 ] ], [ , , "52(?:3(?:[2-46-9][02-9]\\d|5(?:[02-46-9]\\d|5[0-46-9]))|4(?:[2-478][02-9]\\d|5(?:[034]\\d|2[024-9]|5[0-46-9])|6(?:0[1-9]|[2-9]\\d)|9(?:[05-9]\\d|2[0-5]|49)))\\d{4}|52[34][2-9]1[02-9]\\d{4}|5(?:00|2[12]|33|44|66|77|88)[2-9]\\d{6}", , , , "5002345678" ], [ , , , , , , , , , [ -1 ] ], "TT", 1, "011", "1", , , "1|([2-46-8]\\d{6})$", "868$1", , , , , [ , , , , , , , , , [ -1 ] ], , "868", [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , "868619\\d{4}", , , , "8686191234", , , , [ 7 ] ] ],
            TV: [ , [ , , "(?:2|7\\d\\d|90)\\d{4}", , , , , , , [ 5, 6, 7 ] ], [ , , "2[02-9]\\d{3}", , , , "20123", , , [ 5 ] ], [ , , "(?:7[01]\\d|90)\\d{4}", , , , "901234", , , [ 6, 7 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "TV", 688, "00", , , , , , , , [ [ , "(\\d{2})(\\d{3})", "$1 $2", [ "2" ] ], [ , "(\\d{2})(\\d{4})", "$1 $2", [ "90" ] ], [ , "(\\d{2})(\\d{5})", "$1 $2", [ "7" ] ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            TW: [ , [ , , "[2-689]\\d{8}|7\\d{9,10}|[2-8]\\d{7}|2\\d{6}", , , , , , , [ 7, 8, 9, 10, 11 ] ], [ , , "(?:2[2-8]\\d|370|55[01]|7[1-9])\\d{6}|4(?:(?:0(?:0[1-9]|[2-48]\\d)|1[023]\\d)\\d{4,5}|(?:[239]\\d\\d|4(?:0[56]|12|49))\\d{5})|6(?:[01]\\d{7}|4(?:0[56]|12|24|4[09])\\d{4,5})|8(?:(?:2(?:3\\d|4[0-269]|[578]0|66)|36[24-9]|90\\d\\d)\\d{4}|4(?:0[56]|12|24|4[09])\\d{4,5})|(?:2(?:2(?:0\\d\\d|4(?:0[68]|[249]0|3[0-467]|5[0-25-9]|6[0235689]))|(?:3(?:[09]\\d|1[0-4])|(?:4\\d|5[0-49]|6[0-29]|7[0-5])\\d)\\d)|(?:(?:3[2-9]|5[2-8]|6[0-35-79]|8[7-9])\\d\\d|4(?:2(?:[089]\\d|7[1-9])|(?:3[0-4]|[78]\\d|9[01])\\d))\\d)\\d{3}", , , , "221234567", , , [ 8, 9 ] ], [ , , "(?:40001[0-2]|9[0-8]\\d{4})\\d{3}", , , , "912345678", , , [ 9 ] ], [ , , "80[0-79]\\d{6}|800\\d{5}", , , , "800123456", , , [ 8, 9 ] ], [ , , "20(?:[013-9]\\d\\d|2)\\d{4}", , , , "203123456", , , [ 7, 9 ] ], [ , , , , , , , , , [ -1 ] ], [ , , "99\\d{7}", , , , "990123456", , , [ 9 ] ], [ , , "7010(?:[0-2679]\\d|3[0-7]|8[0-5])\\d{5}|70\\d{8}", , , , "7012345678", , , [ 10, 11 ] ], "TW", 886, "0(?:0[25-79]|19)", "0", "#", , "0", , , , [ [ , "(\\d{2})(\\d)(\\d{4})", "$1 $2 $3", [ "202" ], "0$1" ], [ , "(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", [ "[258]0" ], "0$1" ], [ , "(\\d)(\\d{3,4})(\\d{4})", "$1 $2 $3", [ "[23568]|4(?:0[02-48]|[1-47-9])|7[1-9]", "[23568]|4(?:0[2-48]|[1-47-9])|(?:400|7)[1-9]" ], "0$1" ], [ , "(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", [ "[49]" ], "0$1" ], [ , "(\\d{2})(\\d{4})(\\d{4,5})", "$1 $2 $3", [ "7" ], "0$1" ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , "50[0-46-9]\\d{6}", , , , "500123456", , , [ 9 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            TZ: [ , [ , , "(?:[26-8]\\d|41|90)\\d{7}", , , , , , , [ 9 ] ], [ , , "2[2-8]\\d{7}", , , , "222345678" ], [ , , "77[2-9]\\d{6}|(?:6[1-9]|7[1-689])\\d{7}", , , , "621234567" ], [ , , "80[08]\\d{6}", , , , "800123456" ], [ , , "90\\d{7}", , , , "900123456" ], [ , , "8(?:40|6[01])\\d{6}", , , , "840123456" ], [ , , , , , , , , , [ -1 ] ], [ , , "41\\d{7}", , , , "412345678" ], "TZ", 255, "00[056]", "0", , , "0", , , , [ [ , "(\\d{3})(\\d{2})(\\d{4})", "$1 $2 $3", [ "[89]" ], "0$1" ], [ , "(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", [ "[24]" ], "0$1" ], [ , "(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", [ "[67]" ], "0$1" ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , "(?:8(?:[04]0|6[01])|90\\d)\\d{6}" ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            UA: [ , [ , , "[89]\\d{9}|[3-9]\\d{8}", , , , , , , [ 9, 10 ], [ 5, 6, 7 ] ], [ , , "(?:3[1-8]|4[13-8]|5[1-7]|6[12459])\\d{7}", , , , "311234567", , , [ 9 ], [ 5, 6, 7 ] ], [ , , "(?:50|6[36-8]|7[1-3]|9[1-9])\\d{7}", , , , "501234567", , , [ 9 ] ], [ , , "800[1-8]\\d{5,6}", , , , "800123456" ], [ , , "900[239]\\d{5,6}", , , , "900212345" ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , "89[1-579]\\d{6}", , , , "891234567", , , [ 9 ] ], "UA", 380, "00", "0", , , "0", , "0~0", , [ [ , "(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", [ "6[12][29]|(?:3[1-8]|4[136-8]|5[12457]|6[49])2|(?:56|65)[24]", "6[12][29]|(?:35|4[1378]|5[12457]|6[49])2|(?:56|65)[24]|(?:3[1-46-8]|46)2[013-9]" ], "0$1" ], [ , "(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", [ "4[45][0-5]|5(?:0|6[37])|6(?:[12][018]|[36-8])|7|89|9[1-9]|(?:48|57)[0137-9]", "4[45][0-5]|5(?:0|6(?:3[14-7]|7))|6(?:[12][018]|[36-8])|7|89|9[1-9]|(?:48|57)[0137-9]" ], "0$1" ], [ , "(\\d{4})(\\d{5})", "$1 $2", [ "[3-6]" ], "0$1" ], [ , "(\\d{3})(\\d{3})(\\d{3,4})", "$1 $2 $3", [ "[89]" ], "0$1" ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            UG: [ , [ , , "800\\d{6}|(?:[29]0|[347]\\d)\\d{7}", , , , , , , [ 9 ], [ 5, 6, 7 ] ], [ , , "20(?:(?:(?:24|81)0|30[67])\\d|6(?:00[0-2]|30[0-4]))\\d{3}|(?:20(?:[0147]\\d|2[5-9]|32|5[0-4]|6[15-9])|[34]\\d{3})\\d{5}", , , , "312345678", , , , [ 5, 6, 7 ] ], [ , , "726[01]\\d{5}|7(?:[0157-9]\\d|20|36|[46][0-4])\\d{6}", , , , "712345678" ], [ , , "800[1-3]\\d{5}", , , , "800123456" ], [ , , "90[1-3]\\d{6}", , , , "901123456" ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "UG", 256, "00[057]", "0", , , "0", , , , [ [ , "(\\d{4})(\\d{5})", "$1 $2", [ "202", "2024" ], "0$1" ], [ , "(\\d{3})(\\d{6})", "$1 $2", [ "[27-9]|4(?:6[45]|[7-9])" ], "0$1" ], [ , "(\\d{2})(\\d{7})", "$1 $2", [ "[34]" ], "0$1" ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            US: [ , [ , , "[2-9]\\d{9}", , , , , , , [ 10 ], [ 7 ] ], [ , , "5(?:05(?:[2-57-9]\\d\\d|6(?:[0-35-9]\\d|44))|82(?:2(?:0[0-3]|[268]2)|3(?:0[02]|33)|4(?:00|4[24]|65|82)|5(?:00|29|83)|6(?:00|66|82)|777|8(?:00|88)|9(?:00|9[89])))\\d{4}|(?:2(?:0[1-35-9]|1[02-9]|2[03-589]|3[149]|4[08]|5[1-46]|6[0279]|7[0269]|8[13])|3(?:0[1-57-9]|1[02-9]|2[01356]|3[0-24679]|4[167]|5[12]|6[014]|8[056])|4(?:0[124-9]|1[02-579]|2[3-5]|3[0245]|4[023578]|58|6[39]|7[0589]|8[04])|5(?:0[1-47-9]|1[0235-8]|20|3[0149]|4[01]|5[19]|6[1-47]|7[0-5]|8[056])|6(?:0[1-35-9]|1[024-9]|2[03689]|[34][016]|5[0179]|6[0-279]|78|8[0-29])|7(?:0[1-46-8]|1[2-9]|2[04-7]|3[1247]|4[037]|5[47]|6[02359]|7[0-59]|8[156])|8(?:0[1-68]|1[02-8]|2[08]|3[0-289]|4[03578]|5[046-9]|6[02-5]|7[028])|9(?:0[1346-9]|1[02-9]|2[0589]|3[0146-8]|4[01579]|5[12469]|7[0-389]|8[04-69]))[2-9]\\d{6}", , , , "2015550123", , , , [ 7 ] ], [ , , "5(?:05(?:[2-57-9]\\d\\d|6(?:[0-35-9]\\d|44))|82(?:2(?:0[0-3]|[268]2)|3(?:0[02]|33)|4(?:00|4[24]|65|82)|5(?:00|29|83)|6(?:00|66|82)|777|8(?:00|88)|9(?:00|9[89])))\\d{4}|(?:2(?:0[1-35-9]|1[02-9]|2[03-589]|3[149]|4[08]|5[1-46]|6[0279]|7[0269]|8[13])|3(?:0[1-57-9]|1[02-9]|2[01356]|3[0-24679]|4[167]|5[12]|6[014]|8[056])|4(?:0[124-9]|1[02-579]|2[3-5]|3[0245]|4[023578]|58|6[39]|7[0589]|8[04])|5(?:0[1-47-9]|1[0235-8]|20|3[0149]|4[01]|5[19]|6[1-47]|7[0-5]|8[056])|6(?:0[1-35-9]|1[024-9]|2[03689]|[34][016]|5[0179]|6[0-279]|78|8[0-29])|7(?:0[1-46-8]|1[2-9]|2[04-7]|3[1247]|4[037]|5[47]|6[02359]|7[0-59]|8[156])|8(?:0[1-68]|1[02-8]|2[08]|3[0-289]|4[03578]|5[046-9]|6[02-5]|7[028])|9(?:0[1346-9]|1[02-9]|2[0589]|3[0146-8]|4[01579]|5[12469]|7[0-389]|8[04-69]))[2-9]\\d{6}", , , , "2015550123", , , , [ 7 ] ], [ , , "8(?:00|33|44|55|66|77|88)[2-9]\\d{6}", , , , "8002345678" ], [ , , "900[2-9]\\d{6}", , , , "9002345678" ], [ , , , , , , , , , [ -1 ] ], [ , , "52(?:3(?:[2-46-9][02-9]\\d|5(?:[02-46-9]\\d|5[0-46-9]))|4(?:[2-478][02-9]\\d|5(?:[034]\\d|2[024-9]|5[0-46-9])|6(?:0[1-9]|[2-9]\\d)|9(?:[05-9]\\d|2[0-5]|49)))\\d{4}|52[34][2-9]1[02-9]\\d{4}|5(?:00|2[12]|33|44|66|77|88)[2-9]\\d{6}", , , , "5002345678" ], [ , , , , , , , , , [ -1 ] ], "US", 1, "011", "1", , , "1", , , 1, [ [ , "(\\d{3})(\\d{4})", "$1-$2", [ "[2-9]" ] ], [ , "(\\d{3})(\\d{3})(\\d{4})", "($1) $2-$3", [ "[2-9]" ], , , 1 ] ], [ [ , "(\\d{3})(\\d{3})(\\d{4})", "$1-$2-$3", [ "[2-9]" ] ] ], [ , , , , , , , , , [ -1 ] ], 1, , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            UY: [ , [ , , "4\\d{9}|[1249]\\d{7}|(?:[49]\\d|80)\\d{5}", , , , , , , [ 7, 8, 10 ] ], [ , , "(?:1(?:770|987)|(?:2\\d|4[2-7])\\d\\d)\\d{4}", , , , "21231234", , , [ 8 ], [ 7 ] ], [ , , "9[1-9]\\d{6}", , , , "94231234", , , [ 8 ] ], [ , , "(?:4\\d{5}|80[05])\\d{4}|405\\d{4}", , , , "8001234", , , [ 7, 10 ] ], [ , , "90[0-8]\\d{4}", , , , "9001234", , , [ 7 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "UY", 598, "0(?:0|1[3-9]\\d)", "0", " int. ", , "0", , "00", , [ [ , "(\\d{3})(\\d{4})", "$1 $2", [ "405|8|90" ], "0$1" ], [ , "(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", [ "9" ], "0$1" ], [ , "(\\d{4})(\\d{4})", "$1 $2", [ "[124]" ] ], [ , "(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", [ "4" ], "0$1" ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            UZ: [ , [ , , "(?:33|55|[679]\\d|88)\\d{7}", , , , , , , [ 9 ] ], [ , , "(?:6(?:1(?:22|3[124]|4[1-4]|5[1-3578]|64)|2(?:22|3[0-57-9]|41)|5(?:22|3[3-7]|5[024-8])|6\\d\\d|7(?:[23]\\d|7[69])|9(?:22|4[1-8]|6[135]))|7(?:0(?:5[4-9]|6[0146]|7[124-6]|9[135-8])|(?:1[12]|8\\d)\\d|2(?:22|3[13-57-9]|4[1-3579]|5[14])|3(?:2\\d|3[1578]|4[1-35-7]|5[1-57]|61)|4(?:2\\d|3[1-579]|7[1-79])|5(?:22|5[1-9]|6[1457])|6(?:22|3[12457]|4[13-8])|9(?:22|5[1-9])))\\d{5}", , , , "669050123" ], [ , , "(?:(?:33|88|9[0-57-9])\\d{3}|55(?:50[013]|90\\d)|6(?:1(?:2(?:2[01]|98)|35[0-4]|50\\d|61[23]|7(?:[01][017]|4\\d|55|9[5-9]))|2(?:(?:11|7\\d)\\d|2(?:[12]1|9[01379])|5(?:[126]\\d|3[0-4]))|5(?:19[01]|2(?:27|9[26])|(?:30|59|7\\d)\\d)|6(?:2(?:1[5-9]|2[0367]|38|41|52|60)|(?:3[79]|9[0-3])\\d|4(?:56|83)|7(?:[07]\\d|1[017]|3[07]|4[047]|5[057]|67|8[0178]|9[79]))|7(?:2(?:24|3[237]|4[5-9]|7[15-8])|5(?:7[12]|8[0589])|7(?:0\\d|[39][07])|9(?:0\\d|7[079]))|9(?:2(?:1[1267]|3[01]|5\\d|7[0-4])|(?:5[67]|7\\d)\\d|6(?:2[0-26]|8\\d)))|7(?:[07]\\d{3}|1(?:13[01]|6(?:0[47]|1[67]|66)|71[3-69]|98\\d)|2(?:2(?:2[79]|95)|3(?:2[5-9]|6[0-6])|57\\d|7(?:0\\d|1[17]|2[27]|3[37]|44|5[057]|66|88))|3(?:2(?:1[0-6]|21|3[469]|7[159])|(?:33|9[4-6])\\d|5(?:0[0-4]|5[579]|9\\d)|7(?:[0-3579]\\d|4[0467]|6[67]|8[078]))|4(?:2(?:29|5[0257]|6[0-7]|7[1-57])|5(?:1[0-4]|8\\d|9[5-9])|7(?:0\\d|1[024589]|2[0-27]|3[0137]|[46][07]|5[01]|7[5-9]|9[079])|9(?:7[015-9]|[89]\\d))|5(?:112|2(?:0\\d|2[29]|[49]4)|3[1568]\\d|52[6-9]|7(?:0[01578]|1[017]|[23]7|4[047]|[5-7]\\d|8[78]|9[079]))|6(?:2(?:2[1245]|4[2-4])|39\\d|41[179]|5(?:[349]\\d|5[0-2])|7(?:0[017]|[13]\\d|22|44|55|67|88))|9(?:22[128]|3(?:2[0-4]|7\\d)|57[02569]|7(?:2[05-9]|3[37]|4\\d|60|7[2579]|87|9[07]))))\\d{4}", , , , "912345678" ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "UZ", 998, "810", "8", , , "8", , "8~10", , [ [ , "(\\d{2})(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3 $4", [ "[35-9]" ], "8 $1" ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            VA: [ , [ , , "0\\d{5,10}|3[0-8]\\d{7,10}|55\\d{8}|8\\d{5}(?:\\d{2,4})?|(?:1\\d|39)\\d{7,8}", , , , , , , [ 6, 7, 8, 9, 10, 11, 12 ] ], [ , , "06698\\d{1,6}", , , , "0669812345", , , [ 6, 7, 8, 9, 10, 11 ] ], [ , , "3[1-9]\\d{8}|3[2-9]\\d{7}", , , , "3123456789", , , [ 9, 10 ] ], [ , , "80(?:0\\d{3}|3)\\d{3}", , , , "800123456", , , [ 6, 9 ] ], [ , , "(?:0878\\d{3}|89(?:2\\d|3[04]|4(?:[0-4]|[5-9]\\d\\d)|5[0-4]))\\d\\d|(?:1(?:44|6[346])|89(?:38|5[5-9]|9))\\d{6}", , , , "899123456", , , [ 6, 8, 9, 10 ] ], [ , , "84(?:[08]\\d{3}|[17])\\d{3}", , , , "848123456", , , [ 6, 9 ] ], [ , , "1(?:78\\d|99)\\d{6}", , , , "1781234567", , , [ 9, 10 ] ], [ , , "55\\d{8}", , , , "5512345678", , , [ 10 ] ], "VA", 39, "00", , , , , , , , , , [ , , , , , , , , , [ -1 ] ], , "06698", [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , "3[2-8]\\d{9,10}", , , , "33101234501", , , [ 11, 12 ] ] ],
            VC: [ , [ , , "(?:[58]\\d\\d|784|900)\\d{7}", , , , , , , [ 10 ], [ 7 ] ], [ , , "784(?:266|3(?:6[6-9]|7\\d|8[0-6])|4(?:38|5[0-36-8]|8[0-8])|5(?:55|7[0-2]|93)|638|784)\\d{4}", , , , "7842661234", , , , [ 7 ] ], [ , , "784(?:4(?:3[0-5]|5[45]|89|9[0-8])|5(?:2[6-9]|3[0-4])|720)\\d{4}", , , , "7844301234", , , , [ 7 ] ], [ , , "8(?:00|33|44|55|66|77|88)[2-9]\\d{6}", , , , "8002345678" ], [ , , "900[2-9]\\d{6}", , , , "9002345678" ], [ , , , , , , , , , [ -1 ] ], [ , , "52(?:3(?:[2-46-9][02-9]\\d|5(?:[02-46-9]\\d|5[0-46-9]))|4(?:[2-478][02-9]\\d|5(?:[034]\\d|2[024-9]|5[0-46-9])|6(?:0[1-9]|[2-9]\\d)|9(?:[05-9]\\d|2[0-5]|49)))\\d{4}|52[34][2-9]1[02-9]\\d{4}|5(?:00|2[12]|33|44|66|77|88)[2-9]\\d{6}", , , , "5002345678" ], [ , , , , , , , , , [ -1 ] ], "VC", 1, "011", "1", , , "1|([2-7]\\d{6})$", "784$1", , , , , [ , , , , , , , , , [ -1 ] ], , "784", [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            VE: [ , [ , , "[68]00\\d{7}|(?:[24]\\d|[59]0)\\d{8}", , , , , , , [ 10 ], [ 7 ] ], [ , , "(?:2(?:12|3[457-9]|[467]\\d|[58][1-9]|9[1-6])|[4-6]00)\\d{7}", , , , "2121234567", , , , [ 7 ] ], [ , , "4(?:1[24-8]|2[46])\\d{7}", , , , "4121234567" ], [ , , "800\\d{7}", , , , "8001234567" ], [ , , "90[01]\\d{7}", , , , "9001234567" ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "VE", 58, "00", "0", , , "0", , , , [ [ , "(\\d{3})(\\d{7})", "$1-$2", [ "[24-689]" ], "0$1", "$CC $1" ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , "501\\d{7}", , , , "5010123456", , , , [ 7 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            VG: [ , [ , , "(?:284|[58]\\d\\d|900)\\d{7}", , , , , , , [ 10 ], [ 7 ] ], [ , , "284496[0-5]\\d{3}|284(?:229|4(?:22|9[45])|774|8(?:52|6[459]))\\d{4}", , , , "2842291234", , , , [ 7 ] ], [ , , "284496[6-9]\\d{3}|284(?:245|3(?:0[0-3]|4[0-7]|68|9[34])|4(?:4[0-6]|68|99)|5(?:4[0-7]|68|9[69]))\\d{4}", , , , "2843001234", , , , [ 7 ] ], [ , , "8(?:00|33|44|55|66|77|88)[2-9]\\d{6}", , , , "8002345678" ], [ , , "900[2-9]\\d{6}", , , , "9002345678" ], [ , , , , , , , , , [ -1 ] ], [ , , "52(?:3(?:[2-46-9][02-9]\\d|5(?:[02-46-9]\\d|5[0-46-9]))|4(?:[2-478][02-9]\\d|5(?:[034]\\d|2[024-9]|5[0-46-9])|6(?:0[1-9]|[2-9]\\d)|9(?:[05-9]\\d|2[0-5]|49)))\\d{4}|52[34][2-9]1[02-9]\\d{4}|5(?:00|2[12]|33|44|66|77|88)[2-9]\\d{6}", , , , "5002345678" ], [ , , , , , , , , , [ -1 ] ], "VG", 1, "011", "1", , , "1|([2-578]\\d{6})$", "284$1", , , , , [ , , , , , , , , , [ -1 ] ], , "284", [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            VI: [ , [ , , "[58]\\d{9}|(?:34|90)0\\d{7}", , , , , , , [ 10 ], [ 7 ] ], [ , , "340(?:2(?:0[0-38]|2[06-8]|4[49]|77)|3(?:32|44)|4(?:2[23]|44|7[34]|89)|5(?:1[34]|55)|6(?:2[56]|4[23]|77|9[023])|7(?:1[2-57-9]|2[57]|7\\d)|884|998)\\d{4}", , , , "3406421234", , , , [ 7 ] ], [ , , "340(?:2(?:0[0-38]|2[06-8]|4[49]|77)|3(?:32|44)|4(?:2[23]|44|7[34]|89)|5(?:1[34]|55)|6(?:2[56]|4[23]|77|9[023])|7(?:1[2-57-9]|2[57]|7\\d)|884|998)\\d{4}", , , , "3406421234", , , , [ 7 ] ], [ , , "8(?:00|33|44|55|66|77|88)[2-9]\\d{6}", , , , "8002345678" ], [ , , "900[2-9]\\d{6}", , , , "9002345678" ], [ , , , , , , , , , [ -1 ] ], [ , , "52(?:3(?:[2-46-9][02-9]\\d|5(?:[02-46-9]\\d|5[0-46-9]))|4(?:[2-478][02-9]\\d|5(?:[034]\\d|2[024-9]|5[0-46-9])|6(?:0[1-9]|[2-9]\\d)|9(?:[05-9]\\d|2[0-5]|49)))\\d{4}|52[34][2-9]1[02-9]\\d{4}|5(?:00|2[12]|33|44|66|77|88)[2-9]\\d{6}", , , , "5002345678" ], [ , , , , , , , , , [ -1 ] ], "VI", 1, "011", "1", , , "1|([2-9]\\d{6})$", "340$1", , 1, , , [ , , , , , , , , , [ -1 ] ], , "340", [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            VN: [ , [ , , "[12]\\d{9}|[135-9]\\d{8}|[16]\\d{7}|[16-8]\\d{6}", , , , , , , [ 7, 8, 9, 10 ] ], [ , , "2(?:0[3-9]|1[0-689]|2[0-25-9]|3[2-9]|4[2-8]|5[124-9]|6[0-39]|7[0-7]|8[2-79]|9[0-4679])\\d{7}", , , , "2101234567", , , [ 10 ] ], [ , , "(?:5(?:2[238]|59)|89[689]|99[013-9])\\d{6}|(?:3\\d|5[689]|7[06-9]|8[1-8]|9[0-8])\\d{7}", , , , "912345678", , , [ 9 ] ], [ , , "1800\\d{4,6}|12(?:0[13]|28)\\d{4}", , , , "1800123456", , , [ 8, 9, 10 ] ], [ , , "1900\\d{4,6}", , , , "1900123456", , , [ 8, 9, 10 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , "672\\d{6}", , , , "672012345", , , [ 9 ] ], "VN", 84, "00", "0", , , "0", , , , [ [ , "(\\d{3})(\\d{4})", "$1 $2", [ "[17]99" ], "0$1", , 1 ], [ , "(\\d{2})(\\d{5})", "$1 $2", [ "80" ], "0$1", , 1 ], [ , "(\\d{3})(\\d{4,5})", "$1 $2", [ "69" ], "0$1", , 1 ], [ , "(\\d{4})(\\d{4,6})", "$1 $2", [ "1" ], , , 1 ], [ , "(\\d{2})(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3 $4", [ "[69]" ], "0$1", , 1 ], [ , "(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", [ "[3578]" ], "0$1", , 1 ], [ , "(\\d{2})(\\d{4})(\\d{4})", "$1 $2 $3", [ "2[48]" ], "0$1", , 1 ], [ , "(\\d{3})(\\d{4})(\\d{3})", "$1 $2 $3", [ "2" ], "0$1", , 1 ] ], [ [ , "(\\d{2})(\\d{5})", "$1 $2", [ "80" ], "0$1", , 1 ], [ , "(\\d{4})(\\d{4,6})", "$1 $2", [ "1" ], , , 1 ], [ , "(\\d{2})(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3 $4", [ "[69]" ], "0$1", , 1 ], [ , "(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", [ "[3578]" ], "0$1", , 1 ], [ , "(\\d{2})(\\d{4})(\\d{4})", "$1 $2 $3", [ "2[48]" ], "0$1", , 1 ], [ , "(\\d{3})(\\d{4})(\\d{3})", "$1 $2 $3", [ "2" ], "0$1", , 1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , "[17]99\\d{4}|69\\d{5,6}", , , , , , , [ 7, 8 ] ], [ , , "(?:[17]99|80\\d)\\d{4}|69\\d{5,6}", , , , "1992000", , , [ 7, 8 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            VU: [ , [ , , "[57-9]\\d{6}|(?:[238]\\d|48)\\d{3}", , , , , , , [ 5, 7 ] ], [ , , "(?:38[0-8]|48[4-9])\\d\\d|(?:2[02-9]|3[4-7]|88)\\d{3}", , , , "22123", , , [ 5 ] ], [ , , "(?:[58]\\d|7[013-7])\\d{5}", , , , "5912345", , , [ 7 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , "9(?:0[1-9]|1[01])\\d{4}", , , , "9010123", , , [ 7 ] ], "VU", 678, "00", , , , , , , , [ [ , "(\\d{3})(\\d{4})", "$1 $2", [ "[57-9]" ] ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , "(?:3[03]|900\\d)\\d{3}", , , , "30123" ], , , [ , , , , , , , , , [ -1 ] ] ],
            WF: [ , [ , , "(?:40|72)\\d{4}|8\\d{5}(?:\\d{3})?", , , , , , , [ 6, 9 ] ], [ , , "72\\d{4}", , , , "721234", , , [ 6 ] ], [ , , "(?:72|8[23])\\d{4}", , , , "821234", , , [ 6 ] ], [ , , "80[0-5]\\d{6}", , , , "800012345", , , [ 9 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "WF", 681, "00", , , , , , , , [ [ , "(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3", [ "[478]" ] ], [ , "(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", [ "8" ] ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , "[48]0\\d{4}", , , , "401234", , , [ 6 ] ] ],
            WS: [ , [ , , "(?:[2-6]|8\\d{5})\\d{4}|[78]\\d{6}|[68]\\d{5}", , , , , , , [ 5, 6, 7, 10 ] ], [ , , "6[1-9]\\d{3}|(?:[2-5]|60)\\d{4}", , , , "22123", , , [ 5, 6 ] ], [ , , "(?:7[1-35-7]|8(?:[3-7]|9\\d{3}))\\d{5}", , , , "7212345", , , [ 7, 10 ] ], [ , , "800\\d{3}", , , , "800123", , , [ 6 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "WS", 685, "0", , , , , , , , [ [ , "(\\d{5})", "$1", [ "[2-5]|6[1-9]" ] ], [ , "(\\d{3})(\\d{3,7})", "$1 $2", [ "[68]" ] ], [ , "(\\d{2})(\\d{5})", "$1 $2", [ "7" ] ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            XK: [ , [ , , "[23]\\d{7,8}|(?:4\\d\\d|[89]00)\\d{5}", , , , , , , [ 8, 9 ] ], [ , , "(?:2[89]|39)0\\d{6}|[23][89]\\d{6}", , , , "28012345" ], [ , , "4[3-9]\\d{6}", , , , "43201234", , , [ 8 ] ], [ , , "800\\d{5}", , , , "80001234", , , [ 8 ] ], [ , , "900\\d{5}", , , , "90001234", , , [ 8 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "XK", 383, "00", "0", , , "0", , , , [ [ , "(\\d{3})(\\d{5})", "$1 $2", [ "[89]" ], "0$1" ], [ , "(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", [ "[2-4]" ], "0$1" ], [ , "(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", [ "[23]" ], "0$1" ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            YE: [ , [ , , "(?:1|7\\d)\\d{7}|[1-7]\\d{6}", , , , , , , [ 7, 8, 9 ], [ 6 ] ], [ , , "78[0-7]\\d{4}|17\\d{6}|(?:[12][2-68]|3[2358]|4[2-58]|5[2-6]|6[3-58]|7[24-6])\\d{5}", , , , "1234567", , , [ 7, 8 ], [ 6 ] ], [ , , "7[0137]\\d{7}", , , , "712345678", , , [ 9 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "YE", 967, "00", "0", , , "0", , , , [ [ , "(\\d)(\\d{3})(\\d{3,4})", "$1 $2 $3", [ "[1-6]|7[24-68]" ], "0$1" ], [ , "(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", [ "7" ], "0$1" ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            YT: [ , [ , , "80\\d{7}|(?:26|63)9\\d{6}", , , , , , , [ 9 ] ], [ , , "269(?:0[67]|5[0-3]|6\\d|[78]0)\\d{4}", , , , "269601234" ], [ , , "639(?:0[0-79]|1[019]|[267]\\d|3[09]|40|5[05-9]|9[04-79])\\d{4}", , , , "639012345" ], [ , , "80\\d{7}", , , , "801234567" ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "YT", 262, "00", "0", , , "0", , , , , , [ , , , , , , , , , [ -1 ] ], , "269|63", [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            ZA: [ , [ , , "[1-79]\\d{8}|8\\d{4,9}", , , , , , , [ 5, 6, 7, 8, 9, 10 ] ], [ , , "(?:2(?:0330|4302)|52087)0\\d{3}|(?:1[0-8]|2[1-378]|3[1-69]|4\\d|5[1346-8])\\d{7}", , , , "101234567", , , [ 9 ] ], [ , , "(?:1(?:3492[0-25]|4495[0235]|549(?:20|5[01]))|4[34]492[01])\\d{3}|8[1-4]\\d{3,7}|(?:2[27]|47|54)4950\\d{3}|(?:1(?:049[2-4]|9[12]\\d\\d)|(?:6\\d|7[0-46-9])\\d{3}|8(?:5\\d{3}|7(?:08[67]|158|28[5-9]|310)))\\d{4}|(?:1[6-8]|28|3[2-69]|4[025689]|5[36-8])4920\\d{3}|(?:12|[2-5]1)492\\d{4}", , , , "711234567", , , [ 5, 6, 7, 8, 9 ] ], [ , , "80\\d{7}", , , , "801234567", , , [ 9 ] ], [ , , "(?:86[2-9]|9[0-2]\\d)\\d{6}", , , , "862345678", , , [ 9 ] ], [ , , "860\\d{6}", , , , "860123456", , , [ 9 ] ], [ , , , , , , , , , [ -1 ] ], [ , , "87(?:08[0-589]|15[0-79]|28[0-4]|31[1-9])\\d{4}|87(?:[02][0-79]|1[0-46-9]|3[02-9]|[4-9]\\d)\\d{5}", , , , "871234567", , , [ 9 ] ], "ZA", 27, "00", "0", , , "0", , , , [ [ , "(\\d{2})(\\d{3,4})", "$1 $2", [ "8[1-4]" ], "0$1" ], [ , "(\\d{2})(\\d{3})(\\d{2,3})", "$1 $2 $3", [ "8[1-4]" ], "0$1" ], [ , "(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", [ "860" ], "0$1" ], [ , "(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", [ "[1-9]" ], "0$1" ], [ , "(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", [ "8" ], "0$1" ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , "861\\d{6,7}", , , , "861123456", , , [ 9, 10 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            ZM: [ , [ , , "(?:63|80)0\\d{6}|(?:21|[79]\\d)\\d{7}", , , , , , , [ 9 ], [ 6 ] ], [ , , "21[1-8]\\d{6}", , , , "211234567", , , , [ 6 ] ], [ , , "(?:7[679]|9[5-8])\\d{7}", , , , "955123456" ], [ , , "800\\d{6}", , , , "800123456" ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , "630\\d{6}", , , , "630012345" ], "ZM", 260, "00", "0", , , "0", , , , [ [ , "(\\d{3})(\\d{3})", "$1 $2", [ "[1-9]" ] ], [ , "(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", [ "[28]" ], "0$1" ], [ , "(\\d{2})(\\d{7})", "$1 $2", [ "[79]" ], "0$1" ] ], [ [ , "(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", [ "[28]" ], "0$1" ], [ , "(\\d{2})(\\d{7})", "$1 $2", [ "[79]" ], "0$1" ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            ZW: [ , [ , , "2(?:[0-57-9]\\d{6,8}|6[0-24-9]\\d{6,7})|[38]\\d{9}|[35-8]\\d{8}|[3-6]\\d{7}|[1-689]\\d{6}|[1-3569]\\d{5}|[1356]\\d{4}", , , , , , , [ 5, 6, 7, 8, 9, 10 ], [ 3, 4 ] ], [ , , "(?:1(?:(?:3\\d|9)\\d|[4-8])|2(?:(?:(?:0(?:2[014]|5)|(?:2[0157]|31|84|9)\\d\\d|[56](?:[14]\\d\\d|20)|7(?:[089]|2[03]|[35]\\d\\d))\\d|4(?:2\\d\\d|8))\\d|1(?:2|[39]\\d{4}))|3(?:(?:123|(?:29\\d|92)\\d)\\d\\d|7(?:[19]|[56]\\d))|5(?:0|1[2-478]|26|[37]2|4(?:2\\d{3}|83)|5(?:25\\d\\d|[78])|[689]\\d)|6(?:(?:[16-8]21|28|52[013])\\d\\d|[39])|8(?:[1349]28|523)\\d\\d)\\d{3}|(?:4\\d\\d|9[2-9])\\d{4,5}|(?:(?:2(?:(?:(?:0|8[146])\\d|7[1-7])\\d|2(?:[278]\\d|92)|58(?:2\\d|3))|3(?:[26]|9\\d{3})|5(?:4\\d|5)\\d\\d)\\d|6(?:(?:(?:[0-246]|[78]\\d)\\d|37)\\d|5[2-8]))\\d\\d|(?:2(?:[569]\\d|8[2-57-9])|3(?:[013-59]\\d|8[37])|6[89]8)\\d{3}", , , , "1312345", , , , [ 3, 4 ] ], [ , , "7(?:[178]\\d|3[1-9])\\d{6}", , , , "712345678", , , [ 9 ] ], [ , , "80(?:[01]\\d|20|8[0-8])\\d{3}", , , , "8001234", , , [ 7 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , "86(?:1[12]|22|30|44|55|77|8[368])\\d{6}", , , , "8686123456", , , [ 10 ] ], "ZW", 263, "00", "0", , , "0", , , , [ [ , "(\\d{3})(\\d{3,5})", "$1 $2", [ "2(?:0[45]|2[278]|[49]8)|3(?:[09]8|17)|6(?:[29]8|37|75)|[23][78]|(?:33|5[15]|6[68])[78]" ], "0$1" ], [ , "(\\d)(\\d{3})(\\d{2,4})", "$1 $2 $3", [ "[49]" ], "0$1" ], [ , "(\\d{3})(\\d{4})", "$1 $2", [ "80" ], "0$1" ], [ , "(\\d{2})(\\d{7})", "$1 $2", [ "24|8[13-59]|(?:2[05-79]|39|5[45]|6[15-8])2", "2(?:02[014]|4|[56]20|[79]2)|392|5(?:42|525)|6(?:[16-8]21|52[013])|8[13-59]" ], "(0$1)" ], [ , "(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", [ "7" ], "0$1" ], [ , "(\\d{3})(\\d{3})(\\d{3,4})", "$1 $2 $3", [ "2(?:1[39]|2[0157]|[378]|[56][14])|3(?:12|29)", "2(?:1[39]|2[0157]|[378]|[56][14])|3(?:123|29)" ], "0$1" ], [ , "(\\d{4})(\\d{6})", "$1 $2", [ "8" ], "0$1" ], [ , "(\\d{2})(\\d{3,5})", "$1 $2", [ "1|2(?:0[0-36-9]|12|29|[56])|3(?:1[0-689]|[24-6])|5(?:[0236-9]|1[2-4])|6(?:[013-59]|7[0-46-9])|(?:33|55|6[68])[0-69]|(?:29|3[09]|62)[0-79]" ], "0$1" ], [ , "(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", [ "29[013-9]|39|54" ], "0$1" ], [ , "(\\d{4})(\\d{3,5})", "$1 $2", [ "(?:25|54)8", "258|5483" ], "0$1" ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            800: [ , [ , , "(?:005|[1-9]\\d\\d)\\d{5}", , , , , , , [ 8 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , "(?:005|[1-9]\\d\\d)\\d{5}", , , , "12345678" ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "001", 800, , , , , , , , 1, [ [ , "(\\d{4})(\\d{4})", "$1 $2", [ "\\d" ] ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            808: [ , [ , , "[1-9]\\d{7}", , , , , , , [ 8 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , "[1-9]\\d{7}", , , , "12345678" ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "001", 808, , , , , , , , 1, [ [ , "(\\d{4})(\\d{4})", "$1 $2", [ "[1-9]" ] ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            870: [ , [ , , "7\\d{11}|[35-7]\\d{8}", , , , , , , [ 9, 12 ] ], [ , , , , , , , , , [ -1 ] ], [ , , "(?:[356]|774[45])\\d{8}|7[6-8]\\d{7}", , , , "301234567" ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "001", 870, , , , , , , , , [ [ , "(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", [ "[35-7]" ] ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            878: [ , [ , , "10\\d{10}", , , , , , , [ 12 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , "10\\d{10}", , , , "101234567890" ], "001", 878, , , , , , , , 1, [ [ , "(\\d{2})(\\d{5})(\\d{5})", "$1 $2 $3", [ "1" ] ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            881: [ , [ , , "[0-36-9]\\d{8}", , , , , , , [ 9 ] ], [ , , , , , , , , , [ -1 ] ], [ , , "[0-36-9]\\d{8}", , , , "612345678" ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "001", 881, , , , , , , , , [ [ , "(\\d)(\\d{3})(\\d{5})", "$1 $2 $3", [ "[0-36-9]" ] ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            882: [ , [ , , "[13]\\d{6}(?:\\d{2,5})?|285\\d{9}|(?:[19]\\d|49)\\d{6}", , , , , , , [ 7, 8, 9, 10, 11, 12 ] ], [ , , , , , , , , , [ -1 ] ], [ , , "342\\d{4}|(?:337|49)\\d{6}|3(?:2|47|7\\d{3})\\d{7}", , , , "3421234", , , [ 7, 8, 9, 10, 12 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , "1(?:3(?:0[0347]|[13][0139]|2[035]|4[013568]|6[0459]|7[06]|8[15-8]|9[0689])\\d{4}|6\\d{5,10})|(?:(?:285\\d\\d|3(?:45|[69]\\d{3}))\\d|9[89])\\d{6}", , , , "390123456789" ], "001", 882, , , , , , , , , [ [ , "(\\d{2})(\\d{5})", "$1 $2", [ "16|342" ] ], [ , "(\\d{2})(\\d{6})", "$1 $2", [ "4" ] ], [ , "(\\d{2})(\\d{2})(\\d{4})", "$1 $2 $3", [ "[19]" ] ], [ , "(\\d{2})(\\d{4})(\\d{3})", "$1 $2 $3", [ "3[23]" ] ], [ , "(\\d{2})(\\d{3,4})(\\d{4})", "$1 $2 $3", [ "1" ] ], [ , "(\\d{2})(\\d{4})(\\d{4})", "$1 $2 $3", [ "34[57]" ] ], [ , "(\\d{3})(\\d{4})(\\d{4})", "$1 $2 $3", [ "34" ] ], [ , "(\\d{2})(\\d{4,5})(\\d{5})", "$1 $2 $3", [ "[1-3]" ] ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , "348[57]\\d{7}", , , , "34851234567", , , [ 11 ] ] ],
            883: [ , [ , , "(?:210|370\\d\\d)\\d{7}|51\\d{7}(?:\\d{3})?", , , , , , , [ 9, 10, 12 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , "(?:210|(?:370[1-9]|51[013]0)\\d)\\d{7}|5100\\d{5}", , , , "510012345" ], "001", 883, , , , , , , , 1, [ [ , "(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", [ "510" ] ], [ , "(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", [ "2" ] ], [ , "(\\d{4})(\\d{4})(\\d{4})", "$1 $2 $3", [ "51[13]" ] ], [ , "(\\d{3})(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3 $4", [ "[35]" ] ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ],
            888: [ , [ , , "\\d{11}", , , , , , , [ 11 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "001", 888, , , , , , , , 1, [ [ , "(\\d{3})(\\d{3})(\\d{5})", "$1 $2 $3" ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , "\\d{11}", , , , "12345678901" ], , , [ , , , , , , , , , [ -1 ] ] ],
            979: [ , [ , , "[1359]\\d{8}", , , , , , , [ 9 ], [ 8 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , "[1359]\\d{8}", , , , "123456789", , , , [ 8 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], "001", 979, , , , , , , , 1, [ [ , "(\\d)(\\d{4})(\\d{4})", "$1 $2 $3", [ "[1359]" ] ] ], , [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ], [ , , , , , , , , , [ -1 ] ], , , [ , , , , , , , , , [ -1 ] ] ]
        };
        function K() {
            this.g = {};
        }
        K.i = void 0;
        K.g = function() {
            return K.i ? K.i : K.i = new K;
        };
        var wa = {
            0: "0",
            1: "1",
            2: "2",
            3: "3",
            4: "4",
            5: "5",
            6: "6",
            7: "7",
            8: "8",
            9: "9",
            "０": "0",
            "１": "1",
            "２": "2",
            "３": "3",
            "４": "4",
            "５": "5",
            "６": "6",
            "７": "7",
            "８": "8",
            "９": "9",
            "٠": "0",
            "١": "1",
            "٢": "2",
            "٣": "3",
            "٤": "4",
            "٥": "5",
            "٦": "6",
            "٧": "7",
            "٨": "8",
            "٩": "9",
            "۰": "0",
            "۱": "1",
            "۲": "2",
            "۳": "3",
            "۴": "4",
            "۵": "5",
            "۶": "6",
            "۷": "7",
            "۸": "8",
            "۹": "9"
        }, xa = {
            0: "0",
            1: "1",
            2: "2",
            3: "3",
            4: "4",
            5: "5",
            6: "6",
            7: "7",
            8: "8",
            9: "9",
            "０": "0",
            "１": "1",
            "２": "2",
            "３": "3",
            "４": "4",
            "５": "5",
            "６": "6",
            "７": "7",
            "８": "8",
            "９": "9",
            "٠": "0",
            "١": "1",
            "٢": "2",
            "٣": "3",
            "٤": "4",
            "٥": "5",
            "٦": "6",
            "٧": "7",
            "٨": "8",
            "٩": "9",
            "۰": "0",
            "۱": "1",
            "۲": "2",
            "۳": "3",
            "۴": "4",
            "۵": "5",
            "۶": "6",
            "۷": "7",
            "۸": "8",
            "۹": "9",
            A: "2",
            B: "2",
            C: "2",
            D: "3",
            E: "3",
            F: "3",
            G: "4",
            H: "4",
            I: "4",
            J: "5",
            K: "5",
            L: "5",
            M: "6",
            N: "6",
            O: "6",
            P: "7",
            Q: "7",
            R: "7",
            S: "7",
            T: "8",
            U: "8",
            V: "8",
            W: "9",
            X: "9",
            Y: "9",
            Z: "9"
        }, L = /^[+\uff0b]+/, ya = /([0-9\uff10-\uff19\u0660-\u0669\u06f0-\u06f9])/, za = /[+\uff0b0-9\uff10-\uff19\u0660-\u0669\u06f0-\u06f9]/, Aa = /[\\\/] *x/, Ba = /[^0-9\uff10-\uff19\u0660-\u0669\u06f0-\u06f9A-Za-z#]+$/, Ca = /(?:.*?[A-Za-z]){3}.*/;
        function N(a) {
            return "([0-9０-９٠-٩۰-۹]{1," + a + "})";
        }
        function Da() {
            return ";ext=" + N("20") + "|[  \\t,]*(?:e?xt(?:ensi(?:ó?|ó))?n?|ｅ?ｘｔｎ?|доб|anexo)[:\\.．]?[  \\t,-]*" + N("20") + "#?|[  \\t,]*(?:[xｘ#＃~～]|int|ｉｎｔ)[:\\.．]?[  \\t,-]*" + N("9") + "#?|[- ]+" + N("6") + "#|[  \\t]*(?:,{2}|;)[:\\.．]?[  \\t,-]*" + N("15") + "#?|[  \\t]*(?:,)+[:\\.．]?[  \\t,-]*" + N("9") + "#?";
        }
        var Ea = new RegExp("(?:" + Da() + ")$", "i"), Fa = new RegExp("^[0-9０-９٠-٩۰-۹]{2}$|^[+＋]*(?:[-x‐-―−ー－-／  ­​⁠　()（）［］.\\[\\]/~⁓∼～*]*[0-9０-９٠-٩۰-۹]){3,}[-x‐-―−ー－-／  ­​⁠　()（）［］.\\[\\]/~⁓∼～*A-Za-z0-9０-９٠-٩۰-۹]*(?:" + Da() + ")?$", "i"), Ga = /(\$\d)/;
        function Ha(a) {
            return 2 > a.length ? !1 : O(Fa, a);
        }
        function Ia(a) {
            return O(Ca, a) ? P(a, xa) : P(a, wa);
        }
        function Ja(a) {
            var b = Ia(a.toString());
            a.i = "";
            a.g(b);
        }
        function Ka(a) {
            return null != a && (1 != x(a, 9) || -1 != u(a, 9)[0]);
        }
        function P(a, b) {
            for (var d, c = new E, e = a.length, g = 0; g < e; ++g) d = a.charAt(g), d = b[d.toUpperCase()], 
            null != d && c.g(d);
            return c.toString();
        }
        function Q(a) {
            return null != a && isNaN(a) && a.toUpperCase() in va;
        }
        function La(a, b, c) {
            if (0 == p(b, 2) && null != b.g[5]) {
                var d = w(b, 5);
                if (0 < d.length) return d;
            }
            d = w(b, 1);
            var e = R(b);
            if (0 == c) return Ma(d, 0, e, "");
            if (!(d in J)) return e;
            a = S(a, d, T(d));
            b = null != b.g[3] && 0 != p(b, 3).length ? 3 == c ? ";ext=" + p(b, 3) : null != a.g[13] ? p(a, 13) + w(b, 3) : " ext. " + w(b, 3) : "";
            a: {
                a = 0 == u(a, 20).length || 2 == c ? u(a, 19) : u(a, 20);
                for (var g, f = a.length, h = 0; h < f; ++h) {
                    g = a[h];
                    var l = x(g, 3);
                    if (0 == l || 0 == e.search(p(g, 3, l - 1))) if (l = new RegExp(p(g, 1)), O(l, e)) {
                        a = g;
                        break a;
                    }
                }
                a = null;
            }
            null != a && (f = a, a = w(f, 2), g = new RegExp(p(f, 1)), w(f, 5), f = w(f, 4), 
            e = 2 == c && null != f && 0 < f.length ? e.replace(g, a.replace(Ga, f)) : e.replace(g, a), 
            3 == c && (e = e.replace(/^[-x\u2010-\u2015\u2212\u30fc\uff0d-\uff0f \u00a0\u00ad\u200b\u2060\u3000()\uff08\uff09\uff3b\uff3d.\[\]/~\u2053\u223c\uff5e]+/, ""), 
            e = e.replace(/[-x\u2010-\u2015\u2212\u30fc\uff0d-\uff0f \u00a0\u00ad\u200b\u2060\u3000()\uff08\uff09\uff3b\uff3d.\[\]/~\u2053\u223c\uff5e]+/g, "-")));
            return Ma(d, c, e, b);
        }
        function S(a, b, c) {
            return "001" == c ? U(a, "" + b) : U(a, c);
        }
        function R(a) {
            if (null == a.g[2]) return "";
            var b = "" + p(a, 2);
            return null != a.g[4] && p(a, 4) && 0 < w(a, 8) ? Array(w(a, 8) + 1).join("0") + b : b;
        }
        function Ma(a, b, c, d) {
            switch (b) {
              case 0:
                return "+" + a + c + d;

              case 1:
                return "+" + a + " " + c + d;

              case 3:
                return "tel:+" + a + "-" + c + d;

              default:
                return c + d;
            }
        }
        function V(a, b) {
            switch (b) {
              case 4:
                return p(a, 5);

              case 3:
                return p(a, 4);

              case 1:
                return p(a, 3);

              case 0:
              case 2:
                return p(a, 2);

              case 5:
                return p(a, 6);

              case 6:
                return p(a, 8);

              case 7:
                return p(a, 7);

              case 8:
                return p(a, 21);

              case 9:
                return p(a, 25);

              case 10:
                return p(a, 28);

              default:
                return p(a, 1);
            }
        }
        function W(a, b) {
            return X(a, p(b, 1)) ? X(a, p(b, 5)) ? 4 : X(a, p(b, 4)) ? 3 : X(a, p(b, 6)) ? 5 : X(a, p(b, 8)) ? 6 : X(a, p(b, 7)) ? 7 : X(a, p(b, 21)) ? 8 : X(a, p(b, 25)) ? 9 : X(a, p(b, 28)) ? 10 : X(a, p(b, 2)) ? p(b, 18) || X(a, p(b, 3)) ? 2 : 0 : !p(b, 18) && X(a, p(b, 3)) ? 1 : -1 : -1;
        }
        function U(a, b) {
            if (null == b) return null;
            b = b.toUpperCase();
            var c = a.g[b];
            if (null == c) {
                c = va[b];
                if (null == c) return null;
                c = (new D).g(H.j(), c);
                a.g[b] = c;
            }
            return c;
        }
        function X(a, b) {
            var c = a.length;
            return 0 < x(b, 9) && -1 == u(b, 9).indexOf(c) ? !1 : O(w(b, 2), a);
        }
        function Na(a, b) {
            if (null == b) return null;
            var c = w(b, 1);
            c = J[c];
            if (null == c) a = null; else if (1 == c.length) a = c[0]; else a: {
                b = R(b);
                for (var d, e = c.length, g = 0; g < e; g++) {
                    d = c[g];
                    var f = U(a, d);
                    if (null != f.g[23]) {
                        if (0 == b.search(p(f, 23))) {
                            a = d;
                            break a;
                        }
                    } else if (-1 != W(b, f)) {
                        a = d;
                        break a;
                    }
                }
                a = null;
            }
            return a;
        }
        function T(a) {
            a = J[a];
            return null == a ? "ZZ" : a[0];
        }
        function Y(a, b, c, d) {
            var e = V(c, d), g = 0 == x(e, 9) ? u(p(c, 1), 9) : u(e, 9);
            e = u(e, 10);
            if (2 == d) if (Ka(V(c, 0))) a = V(c, 1), Ka(a) && (g = g.concat(0 == x(a, 9) ? u(p(c, 1), 9) : u(a, 9)), 
            g.sort(), 0 == e.length ? e = u(a, 10) : (e = e.concat(u(a, 10)), e.sort())); else return Y(a, b, c, 1);
            if (-1 == g[0]) return 5;
            b = b.length;
            if (-1 < e.indexOf(b)) return 4;
            c = g[0];
            return c == b ? 0 : c > b ? 2 : g[g.length - 1] < b ? 3 : -1 < g.indexOf(b, 1) ? 0 : 5;
        }
        function Oa(a, b) {
            var c = R(b);
            b = w(b, 1);
            if (!(b in J)) return 1;
            b = S(a, b, T(b));
            return Y(a, c, b, -1);
        }
        function Pa(a, b, c, d, e, g) {
            if (0 == b.length) return 0;
            b = new E(b);
            var f;
            null != c && (f = p(c, 11));
            null == f && (f = "NonMatch");
            var h = b.toString();
            if (0 == h.length) f = 20; else if (L.test(h)) h = h.replace(L, ""), b.i = "", b.g(Ia(h)), 
            f = 1; else {
                h = new RegExp(f);
                Ja(b);
                f = b.toString();
                if (0 == f.search(h)) {
                    h = f.match(h)[0].length;
                    var l = f.substring(h).match(ya);
                    l && null != l[1] && 0 < l[1].length && "0" == P(l[1], wa) ? f = !1 : (b.i = "", 
                    b.g(f.substring(h)), f = !0);
                } else f = !1;
                f = f ? 5 : 20;
            }
            e && q(g, 6, f);
            if (20 != f) {
                if (2 >= b.i.length) throw Error("Phone number too short after IDD");
                a: {
                    a = b.toString();
                    if (0 != a.length && "0" != a.charAt(0)) for (e = a.length, b = 1; 3 >= b && b <= e; ++b) if (c = parseInt(a.substring(0, b), 10), 
                    c in J) {
                        d.g(a.substring(b));
                        d = c;
                        break a;
                    }
                    d = 0;
                }
                if (0 != d) return q(g, 1, d), d;
                throw Error("Invalid country calling code");
            }
            if (null != c && (f = w(c, 10), h = "" + f, l = b.toString(), 0 == l.lastIndexOf(h, 0) && (h = new E(l.substring(h.length)), 
            l = p(c, 1), l = new RegExp(w(l, 2)), Qa(h, c, null), h = h.toString(), !O(l, b.toString()) && O(l, h) || 3 == Y(a, b.toString(), c, -1)))) return d.g(h), 
            e && q(g, 6, 10), q(g, 1, f), f;
            q(g, 1, 0);
            return 0;
        }
        function Qa(a, b, c) {
            var d = a.toString(), e = d.length, g = p(b, 15);
            if (0 != e && null != g && 0 != g.length) {
                var f = new RegExp("^(?:" + g + ")");
                if (e = f.exec(d)) {
                    g = new RegExp(w(p(b, 1), 2));
                    var h = O(g, d), l = e.length - 1;
                    b = p(b, 16);
                    if (null == b || 0 == b.length || null == e[l] || 0 == e[l].length) {
                        if (!h || O(g, d.substring(e[0].length))) null != c && 0 < l && null != e[l] && c.g(e[1]), 
                        a.set(d.substring(e[0].length));
                    } else if (d = d.replace(f, b), !h || O(g, d)) null != c && 0 < l && c.g(e[1]), 
                    a.set(d);
                }
            }
        }
        function Z(a, b, c) {
            if (!Q(c) && 0 < b.length && "+" != b.charAt(0)) throw Error("Invalid country calling code");
            return Ra(a, b, c, !0);
        }
        function Ra(a, b, c, d) {
            if (null == b) throw Error("The string supplied did not seem to be a phone number");
            if (250 < b.length) throw Error("The string supplied is too long to be a phone number");
            var e = new E, g = b.indexOf(";phone-context=");
            if (0 <= g) {
                var f = g + 15;
                if ("+" == b.charAt(f)) {
                    var h = b.indexOf(";", f);
                    0 < h ? e.g(b.substring(f, h)) : e.g(b.substring(f));
                }
                f = b.indexOf("tel:");
                e.g(b.substring(0 <= f ? f + 4 : 0, g));
            } else g = e.g, f = b.search(za), 0 <= f ? (f = b.substring(f), f = f.replace(Ba, ""), 
            h = f.search(Aa), 0 <= h && (f = f.substring(0, h))) : f = "", g.call(e, f);
            g = e.toString();
            f = g.indexOf(";isub=");
            0 < f && (e.i = "", e.g(g.substring(0, f)));
            if (!Ha(e.toString())) throw Error("The string supplied did not seem to be a phone number");
            g = e.toString();
            if (!(Q(c) || null != g && 0 < g.length && L.test(g))) throw Error("Invalid country calling code");
            g = new I;
            d && q(g, 5, b);
            a: {
                b = e.toString();
                f = b.search(Ea);
                if (0 <= f && Ha(b.substring(0, f))) {
                    h = b.match(Ea);
                    for (var l = h.length, z = 1; z < l; ++z) if (null != h[z] && 0 < h[z].length) {
                        e.i = "";
                        e.g(b.substring(0, f));
                        b = h[z];
                        break a;
                    }
                }
                b = "";
            }
            0 < b.length && q(g, 3, b);
            f = U(a, c);
            b = new E;
            h = 0;
            l = e.toString();
            try {
                h = Pa(a, l, f, b, d, g);
            } catch (M) {
                if ("Invalid country calling code" == M.message && L.test(l)) {
                    if (l = l.replace(L, ""), h = Pa(a, l, f, b, d, g), 0 == h) throw M;
                } else throw M;
            }
            0 != h ? (e = T(h), e != c && (f = S(a, h, e))) : (Ja(e), b.g(e.toString()), null != c ? (h = w(f, 10), 
            q(g, 1, h)) : d && (delete g.g[6], g.i && delete g.i[6]));
            if (2 > b.i.length) throw Error("The string supplied is too short to be a phone number");
            null != f && (c = new E, e = new E(b.toString()), Qa(e, f, c), a = Y(a, e.toString(), f, -1), 
            2 != a && 4 != a && 5 != a && (b = e, d && 0 < c.toString().length && q(g, 7, c.toString())));
            d = b.toString();
            a = d.length;
            if (2 > a) throw Error("The string supplied is too short to be a phone number");
            if (17 < a) throw Error("The string supplied is too long to be a phone number");
            if (1 < d.length && "0" == d.charAt(0)) {
                q(g, 4, !0);
                for (a = 1; a < d.length - 1 && "0" == d.charAt(a); ) a++;
                1 != a && q(g, 8, a);
            }
            q(g, 2, parseInt(d, 10));
            return g;
        }
        function O(a, b) {
            return (a = "string" == typeof a ? b.match("^(?:" + a + ")$") : b.match(a)) && a[0].length == b.length ? !0 : !1;
        }
        k("intlTelInputUtils", {});
        k("intlTelInputUtils.formatNumber", (function(a, b, c) {
            try {
                var d = K.g(), e = Z(d, a, b), g = Oa(d, e);
                return 0 == g || 4 == g ? La(d, e, "undefined" == typeof c ? 0 : c) : a;
            } catch (f) {
                return a;
            }
        }));
        k("intlTelInputUtils.getExampleNumber", (function(a, b, c) {
            try {
                var d = K.g();
                a: {
                    if (Q(a)) {
                        var e = V(U(d, a), c);
                        try {
                            if (null != e.g[6]) {
                                var g = p(e, 6);
                                var f = Ra(d, g, a, !1);
                                break a;
                            }
                        } catch (h) {}
                    }
                    f = null;
                }
                return La(d, f, b ? 2 : 1);
            } catch (h) {
                return "";
            }
        }));
        k("intlTelInputUtils.getExtension", (function(a, b) {
            try {
                return p(Z(K.g(), a, b), 3);
            } catch (c) {
                return "";
            }
        }));
        k("intlTelInputUtils.getNumberType", (function(a, b) {
            try {
                var c = K.g();
                var d = Z(c, a, b), e = Na(c, d), g = S(c, w(d, 1), e);
                if (null == g) var f = -1; else {
                    var h = R(d);
                    f = W(h, g);
                }
                return f;
            } catch (l) {
                return -99;
            }
        }));
        k("intlTelInputUtils.getValidationError", (function(a, b) {
            try {
                var c = K.g(), d = Z(c, a, b);
                return Oa(c, d);
            } catch (e) {
                return "Invalid country calling code" == e.message ? 1 : "Phone number too short after IDD" == e.message || "The string supplied is too short to be a phone number" == e.message ? 2 : "The string supplied is too long to be a phone number" == e.message ? 3 : -99;
            }
        }));
        k("intlTelInputUtils.isValidNumber", (function(a, b) {
            try {
                var c = K.g(), d = Z(c, a, b);
                var h, e = Na(c, d), g = w(d, 1), f = S(c, g, e);
                if (!(h = null == f)) {
                    var l;
                    if (l = "001" != e) {
                        var z = U(c, e);
                        if (null == z) throw Error("Invalid region code: " + e);
                        var M = w(z, 10);
                        l = g != M;
                    }
                    h = l;
                }
                if (h) var ua = !1; else {
                    var Sa = R(d);
                    ua = -1 != W(Sa, f);
                }
                return ua;
            } catch (Ta) {
                return !1;
            }
        }));
        k("intlTelInputUtils.numberFormat", {
            E164: 0,
            INTERNATIONAL: 1,
            NATIONAL: 2,
            RFC3966: 3
        });
        k("intlTelInputUtils.numberType", {
            FIXED_LINE: 0,
            MOBILE: 1,
            FIXED_LINE_OR_MOBILE: 2,
            TOLL_FREE: 3,
            PREMIUM_RATE: 4,
            SHARED_COST: 5,
            VOIP: 6,
            PERSONAL_NUMBER: 7,
            PAGER: 8,
            UAN: 9,
            VOICEMAIL: 10,
            UNKNOWN: -1
        });
        k("intlTelInputUtils.validationError", {
            IS_POSSIBLE: 0,
            INVALID_COUNTRY_CODE: 1,
            TOO_SHORT: 2,
            TOO_LONG: 3,
            IS_POSSIBLE_LOCAL_ONLY: 4,
            INVALID_LENGTH: 5
        });
    })();
    const videos = document.querySelectorAll(".video__body");
    if (videos) {
        let generateUrl = function(id) {
            let query = "?rel=0&showinfo=0&autoplay=1";
            return "https://www.youtube.com/embed/" + id + query;
        };
        let createIframe = function(id) {
            let iframe = document.createElement("iframe");
            iframe.setAttribute("allowfullscreen", "");
            iframe.setAttribute("allow", "autoplay; encrypted-media");
            iframe.setAttribute("src", generateUrl(id));
            return iframe;
        };
        videos.forEach((el => {
            let videoId = el.getAttribute("data-video");
            let img = el.querySelector("img");
            let youtubeImgSrc = "https://i.ytimg.com/vi/" + videoId + "/maxresdefault.jpg";
            img.setAttribute("src", youtubeImgSrc);
            el.addEventListener("click", (e => {
                e.preventDefault();
                let iframe = createIframe(videoId);
                el.querySelector("img").remove();
                el.appendChild(iframe);
                el.querySelector("button").remove();
            }));
        }));
    }
    const inputPhone = document.querySelectorAll('input[type="tel"]');
    if (inputPhone) inputPhone.forEach((element => {
        window.intlTelInput(element, {
            initialCountry: "ua",
            separateDialCode: true,
            hiddenInput: "full_phone",
            utilsScript: "js/libs/utils.js"
        });
    }));
    const brandTyped = document.querySelector(".header__brand");
    if (brandTyped) new Typed(brandTyped, {
        strings: [ "TOMMY", "Dotli" ],
        typeSpeed: 200,
        backSpeed: 100,
        loop: true,
        loopCount: 1 / 0
    });
    window["FLS"] = false;
    isWebp();
    menuInit();
    catalogInit();
    spollers();
    tabs();
    formFieldsInit({
        viewPass: false,
        autoHeight: false
    });
    pageNavigation();
    if (window.innerWidth > 991.98) stickyBlock();
})();