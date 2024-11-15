const ledger = new WeakMap();
function editLedger(wanted, baseElement, callback, setup) {
  var _ledger$get, _elementMap$get;
  if (!wanted && !ledger.has(baseElement)) {
    return false;
  }
  const elementMap =
    (_ledger$get = ledger.get(baseElement)) !== null && _ledger$get !== void 0
      ? _ledger$get
      : new WeakMap();
  ledger.set(baseElement, elementMap);
  const setups =
    (_elementMap$get = elementMap.get(callback)) !== null &&
    _elementMap$get !== void 0
      ? _elementMap$get
      : new Set();
  elementMap.set(callback, setups);
  const existed = setups.has(setup);
  if (wanted) {
    setups.add(setup);
  } else {
    setups.delete(setup);
  }
  return existed && wanted;
}
function safeClosest(event, selector) {
  let target = event.target;
  if (target instanceof Text) {
    target = target.parentElement;
  }
  if (target instanceof Element && event.currentTarget instanceof Element) {
    // `.closest()` may match ancestors of `currentTarget` but we only need its children
    const closest = target.closest(selector);
    if (closest && event.currentTarget.contains(closest)) {
      return closest;
    }
  }
}
// This type isn't exported as a declaration, so it needs to be duplicated above
function t(selector, type, callback, options = {}) {
  const { signal, base = document } = options;
  if (signal !== null && signal !== void 0 && signal.aborted) {
    return;
  }
  // Don't pass `once` to `addEventListener` because it needs to be handled in `delegate-it`
  const { once, ...nativeListenerOptions } = options;
  // `document` should never be the base, it's just an easy way to define "global event listeners"
  const baseElement = base instanceof Document ? base.documentElement : base;
  // Handle the regular Element usage
  const capture = Boolean(
    typeof options === "object" ? options.capture : options
  );
  const listenerFunction = (event) => {
    const delegateTarget = safeClosest(event, selector);
    if (delegateTarget) {
      const delegateEvent = Object.assign(event, { delegateTarget });
      callback.call(baseElement, delegateEvent);
      if (once) {
        baseElement.removeEventListener(
          type,
          listenerFunction,
          nativeListenerOptions
        );
        editLedger(false, baseElement, callback, setup);
      }
    }
  };
  const setup = JSON.stringify({ selector, type, capture });
  const isAlreadyListening = editLedger(true, baseElement, callback, setup);
  if (!isAlreadyListening) {
    baseElement.addEventListener(type, listenerFunction, nativeListenerOptions);
  }
  signal === null || signal === void 0
    ? void 0
    : signal.addEventListener("abort", () => {
        editLedger(false, baseElement, callback, setup);
      });
}

// This type isn't exported as a declaration, so it needs to be duplicated above
async function oneEvent(selector, type, options = {}) {
  return new Promise((resolve) => {
    var _options$signal, _options$signal2;
    options.once = true;
    if (
      (_options$signal = options.signal) !== null &&
      _options$signal !== void 0 &&
      _options$signal.aborted
    ) {
      resolve(undefined);
    }
    (_options$signal2 = options.signal) === null || _options$signal2 === void 0
      ? void 0
      : _options$signal2.addEventListener("abort", () => {
          resolve(undefined);
        });
    t(selector, type, resolve, options);
  });
}

const e = (t, e) =>
    String(t)
      .toLowerCase()
      .replace(/[\s/_.]+/g, "-")
      .replace(/[^\w-]+/g, "")
      .replace(/--+/g, "-")
      .replace(/^-+|-+$/g, "") ||
    e ||
    "",
  n = function (t) {
    let { hash: e } = void 0 === t ? {} : t;
    return location.pathname + location.search + (e ? location.hash : "");
  },
  i = function (t, e) {
    void 0 === e && (e = {});
    const i = {
      url: (t = t || n({ hash: !0 })),
      random: Math.random(),
      source: "swup",
      ...e,
    };
    history.pushState(i, "", t);
  },
  s = function (t, e) {
    void 0 === t && (t = null),
      void 0 === e && (e = {}),
      (t = t || n({ hash: !0 }));
    const i = {
      ...history.state,
      url: t,
      random: Math.random(),
      source: "swup",
      ...e,
    };
    history.replaceState(i, "", t);
  },
  o = (e, n, i, s) => {
    const o = new AbortController();
    return t(e, n, i, s), { destroy: () => o.abort() };
  },
  r = function (t, e) {
    return void 0 === e && (e = document), e.querySelector(t);
  },
  a = function (t, e) {
    return void 0 === e && (e = document), Array.from(e.querySelectorAll(t));
  },
  l = (t) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        t();
      });
    });
  },
  c = (t) => (window.CSS && window.CSS.escape ? CSS.escape(t) : t),
  u = (t) => 1e3 * Number(t.slice(0, -1).replace(",", ".")),
  h = (t, e) => {
    var _r, _r2;
    let n = document.createElement("html");
    n.innerHTML = t;
    let i = [];
    e.forEach((t) => {
      if (null == r(t, n))
        return console.warn(`[swup] Container ${t} not found on page.`), null;
      a(t).length !== a(t, n).length &&
        console.warn(
          "[swup] Mismatched number of containers found on new page."
        ),
        a(t).forEach((e, s) => {
          a(t, n)[s].setAttribute("data-swup", String(i.length)),
            i.push(a(t, n)[s].outerHTML);
        });
    });
    const s =
        ((_r = r("title", n)) === null || _r === void 0
          ? void 0
          : _r.innerText) || "",
      o =
        (_r2 = r("body", n)) === null || _r2 === void 0
          ? void 0
          : _r2.className;
    return (
      (n.innerHTML = ""),
      (n = null),
      { title: s, pageClass: o, blocks: i, originalContent: t }
    );
  },
  d = (t, e) => {
    const n = {
        url: window.location.pathname + window.location.search,
        method: "GET",
        data: null,
        headers: {},
      },
      { url: i, method: s, headers: o, data: r } = { ...n, ...t },
      a = new XMLHttpRequest();
    return (
      (a.onreadystatechange = function () {
        4 === a.readyState && e(a);
      }),
      a.open(s, i, !0),
      Object.entries(o).forEach((t) => {
        let [e, n] = t;
        a.setRequestHeader(e, n);
      }),
      a.send(r),
      a
    );
  };
class p extends URL {
  constructor(t, e) {
    void 0 === e && (e = document.baseURI), super(t.toString(), e);
  }
  get url() {
    return this.pathname + this.search;
  }
  static fromElement(t) {
    const e = t.getAttribute("href") || t.getAttribute("xlink:href");
    return new p(e);
  }
  static fromUrl(t) {
    return new p(t);
  }
}
const g = (t, e) => {
    let n = 0;
    e.forEach((e) => {
      null == r(e, t)
        ? console.warn(`[swup] Container ${e} not found on page.`)
        : a(e).forEach((i, s) => {
            a(e, t)[s].setAttribute("data-swup", String(n)), n++;
          });
    });
  },
  m = (t) =>
    /^to-/.test(t) ||
    ["is-changing", "is-rendering", "is-popstate"].includes(t),
  f = () => {
    const t = document.documentElement.className.split(" ").filter(m);
    document.documentElement.classList.remove(...t);
  };
class v {
  constructor(t) {
    (this.pages = {}),
      (this.last = null),
      (this.swup = void 0),
      (this.swup = t);
  }
  getCacheUrl(t) {
    return this.swup.resolveUrl(p.fromUrl(t).url);
  }
  cacheUrl(t) {
    (t.url = this.getCacheUrl(t.url)),
      t.url in this.pages == 0 && (this.pages[t.url] = t),
      (t.responseURL = this.getCacheUrl(t.responseURL)),
      (this.last = this.pages[t.url]),
      this.swup.log(`Cache (${Object.keys(this.pages).length})`, this.pages);
  }
  getPage(t) {
    return (t = this.getCacheUrl(t)), this.pages[t];
  }
  getCurrentPage() {
    return this.getPage(n());
  }
  exists(t) {
    return (t = this.getCacheUrl(t)) in this.pages;
  }
  empty() {
    (this.pages = {}), (this.last = null), this.swup.log("Cache cleared");
  }
  remove(t) {
    delete this.pages[this.getCacheUrl(t)];
  }
}
const w = function (t) {
    let { event: e, skipTransition: n } = void 0 === t ? {} : t;
    if (n)
      return (
        this.triggerEvent("transitionEnd", e),
        this.cleanupAnimationClasses(),
        [Promise.resolve()]
      );
    l(() => {
      this.triggerEvent("animationInStart"),
        document.documentElement.classList.remove("is-animating");
    });
    const i = this.getAnimationPromises("in");
    return (
      Promise.all(i).then(() => {
        this.triggerEvent("animationInDone"),
          this.triggerEvent("transitionEnd", e),
          this.cleanupAnimationClasses();
      }),
      i
    );
  },
  E = (t) => {
    if ((t && "#" === t.charAt(0) && (t = t.substring(1)), !t)) return null;
    const e = decodeURIComponent(t);
    let n =
      document.getElementById(t) ||
      document.getElementById(e) ||
      r(`a[name='${c(t)}']`) ||
      r(`a[name='${c(e)}']`);
    return n || "top" !== t || (n = document.body), n;
  };
let P = "transition",
  S = "transitionend",
  b = "animation",
  U = "animationend";
function k(t) {
  const e = this.options.animationSelector;
  if (!1 === e) return [Promise.resolve()];
  const n = a(e, document.body);
  if (!n.length)
    return (
      console.warn(
        `[swup] No elements found matching animationSelector \`${e}\``
      ),
      [Promise.resolve()]
    );
  const i = n
    .map((t) =>
      (function (t) {
        const {
          type: e,
          timeout: n,
          propCount: i,
        } = (function (t, e) {
          void 0 === e && (e = null);
          const n = window.getComputedStyle(t),
            i = `${P}Duration`,
            s = `${b}Delay`,
            o = `${b}Duration`,
            r = n[`${P}Delay`].split(", "),
            a = (n[i] || "").split(", "),
            l = y(r, a),
            c = (n[s] || "").split(", "),
            u = (n[o] || "").split(", "),
            h = y(c, u);
          let d = "",
            p = 0,
            g = 0;
          return (
            "transition" === e
              ? l > 0 && ((d = "transition"), (p = l), (g = a.length))
              : "animation" === e
              ? h > 0 && ((d = "animation"), (p = h), (g = u.length))
              : ((p = Math.max(l, h)),
                (d = p > 0 ? (l > h ? "transition" : "animation") : null),
                (g = d ? ("transition" === d ? a.length : u.length) : 0)),
            { type: d, timeout: p, propCount: g }
          );
        })(t);
        if (e && n)
          return new Promise((s) => {
            const o = "transition" === e ? S : U,
              r = performance.now();
            let a = 0;
            const l = () => {
                t.removeEventListener(o, c), s();
              },
              c = (e) => {
                if (e.target === t) {
                  if (!((t) => [S, U].includes(t.type))(e))
                    throw new Error("Not a transition or animation event.");
                  (performance.now() - r) / 1e3 < e.elapsedTime ||
                    (++a >= i && l());
                }
              };
            setTimeout(() => {
              a < i && l();
            }, n + 1),
              t.addEventListener(o, c);
          });
      })(t)
    )
    .filter(Boolean);
  return i.length
    ? i
    : (console.warn(
        `[swup] No CSS animation duration defined on elements matching \`${e}\``
      ),
      [Promise.resolve()]);
}
function y(t, e) {
  for (; t.length < e.length; ) t = t.concat(t);
  return Math.max(...e.map((e, n) => u(e) + u(t[n])));
}
void 0 === window.ontransitionend &&
  void 0 !== window.onwebkittransitionend &&
  ((P = "WebkitTransition"), (S = "webkitTransitionEnd")),
  void 0 === window.onanimationend &&
    void 0 !== window.onwebkitanimationend &&
    ((b = "WebkitAnimation"), (U = "webkitAnimationEnd"));
const L = function (t) {
  const e = h(t.responseText, this.options.containers);
  return e
    ? { ...e, responseURL: t.responseURL || window.location.href }
    : (console.warn("[swup] Received page is invalid."), null);
};
function C(t) {
  const e = this.options.requestHeaders,
    { url: n } = t;
  return this.cache.exists(n)
    ? (this.triggerEvent("pageRetrievedFromCache"),
      Promise.resolve(this.cache.getPage(n)))
    : new Promise((i, s) => {
        d({ ...t, headers: e }, (t) => {
          if (500 === t.status)
            return this.triggerEvent("serverError"), void s(n);
          const e = this.getPageData(t);
          if (!e || !e.blocks.length) return void s(n);
          const o = { ...e, url: n };
          this.cache.cacheUrl(o), this.triggerEvent("pageLoaded"), i(o);
        });
      });
}
const T = function (t) {
  let { event: e, skipTransition: n } = void 0 === t ? {} : t;
  const i = e instanceof PopStateEvent;
  if (n) return this.triggerEvent("animationSkipped"), [Promise.resolve()];
  this.triggerEvent("animationOutStart"),
    document.documentElement.classList.add(
      "is-changing",
      "is-leaving",
      "is-animating"
    ),
    i && document.documentElement.classList.add("is-popstate");
  const s = this.getAnimationPromises("out");
  return (
    Promise.all(s).then(() => {
      this.triggerEvent("animationOutDone");
    }),
    s
  );
};
function H(t) {
  const { url: e } = t;
  this.shouldIgnoreVisit(e)
    ? (window.location.href = e)
    : this.performPageLoad(t);
}
function R(t) {
  const {
      url: o,
      event: r,
      customTransition: a,
      history: l = "push",
    } = t !== null && t !== void 0 ? t : {},
    c = r instanceof PopStateEvent,
    u = this.shouldSkipTransition({ url: o, event: r });
  this.triggerEvent("transitionStart", r),
    this.updateTransition(n(), o, a),
    null != a && document.documentElement.classList.add(`to-${e(a)}`);
  const h = this.leavePage({ event: r, skipTransition: u }),
    d = this.fetchPage(t);
  if (!c) {
    const t = o + (this.scrollToElement || "");
    "replace" === l ? s(t) : i(t);
  }
  (this.currentPageUrl = n()),
    Promise.all([d, ...h])
      .then((t) => {
        let [e] = t;
        this.renderPage(e, { event: r, skipTransition: u });
      })
      .catch((t) => {
        void 0 !== t &&
          ((this.options.skipPopStateHandling = () => (
            (window.location = t), !0
          )),
          history.go(-1));
      });
}
const A = function (t) {
  let { blocks: e, title: n } = t;
  return (
    e.forEach((t, e) => {
      document.body.querySelector(`[data-swup="${e}"]`).outerHTML = t;
    }),
    (document.title = n),
    Promise.resolve()
  );
};
function $(t, e) {
  const n = this._handlers[t];
  n ? n.push(e) : console.warn(`Unsupported event ${t}.`);
}
function _(t, e) {
  if (t && e) {
    const n = this._handlers[t];
    n.includes(e)
      ? (this._handlers[t] = n.filter((t) => t !== e))
      : console.warn(`Handler for event '${t}' not found.`);
  } else
    t
      ? (this._handlers[t] = [])
      : Object.keys(this._handlers).forEach((t) => {
          this._handlers[t] = [];
        });
}
function I(t, e) {
  this._handlers[t].forEach((t) => {
    try {
      t(e);
    } catch (t) {
      console.error(t);
    }
  });
  const n = new CustomEvent(`swup:${t}`, { detail: t });
  document.dispatchEvent(n);
}
const x = function (t) {
  if (t !== null && t !== void 0 && t.isSwupPlugin) {
    if (((t.swup = this), !t._checkRequirements || t._checkRequirements()))
      return (
        t._beforeMount && t._beforeMount(),
        t.mount(),
        this.plugins.push(t),
        this.plugins
      );
  } else console.error("Not a swup plugin instance", t);
};
function q(t) {
  const e = this.findPlugin(t);
  if (e)
    return (
      e.unmount(),
      e._afterUnmount && e._afterUnmount(),
      (this.plugins = this.plugins.filter((t) => t !== e)),
      this.plugins
    );
  console.error("No such plugin", e);
}
function D(t) {
  return this.plugins.find((e) => e === t || e.name === t);
}
const M = function (t, e) {
  let { event: i, skipTransition: o } = void 0 === e ? {} : e;
  if (
    (document.documentElement.classList.remove("is-leaving"),
    !this.isSameResolvedUrl(n(), t.url))
  )
    return;
  const { url: r } = p.fromUrl(t.responseURL);
  this.isSameResolvedUrl(n(), r) ||
    (this.cache.cacheUrl({ ...t, url: r }), (this.currentPageUrl = n()), s(r)),
    o || document.documentElement.classList.add("is-rendering"),
    this.triggerEvent("willReplaceContent", i),
    this.replaceContent(t).then(() => {
      this.triggerEvent("contentReplaced", i),
        this.triggerEvent("pageView", i),
        this.options.cache || this.cache.empty(),
        this.enterPage({ event: i, skipTransition: o }),
        (this.scrollToElement = null);
    });
};
function N(t, e, n) {
  this.transition = { from: t, to: e, custom: n };
}
function W(t) {
  let { event: e } = t;
  return !(
    !(e instanceof PopStateEvent) || this.options.animateHistoryBrowsing
  );
}
class O {
  constructor(t) {
    void 0 === t && (t = {}),
      (this.version = "3.1.1"),
      (this._handlers = {
        animationInDone: [],
        animationInStart: [],
        animationOutDone: [],
        animationOutStart: [],
        animationSkipped: [],
        clickLink: [],
        contentReplaced: [],
        disabled: [],
        enabled: [],
        openPageInNewTab: [],
        pageLoaded: [],
        pageRetrievedFromCache: [],
        pageView: [],
        popState: [],
        samePage: [],
        samePageWithHash: [],
        serverError: [],
        transitionStart: [],
        transitionEnd: [],
        willReplaceContent: [],
      }),
      (this.scrollToElement = null),
      (this.options = void 0),
      (this.plugins = []),
      (this.transition = {}),
      (this.cache = void 0),
      (this.currentPageUrl = n()),
      (this.delegatedListeners = {}),
      (this.boundPopStateHandler = void 0),
      (this.loadPage = H),
      (this.performPageLoad = R),
      (this.leavePage = T),
      (this.renderPage = M),
      (this.replaceContent = A),
      (this.enterPage = w),
      (this.triggerEvent = I),
      (this.delegateEvent = o),
      (this.on = $),
      (this.off = _),
      (this.updateTransition = N),
      (this.shouldSkipTransition = W),
      (this.getAnimationPromises = k),
      (this.getPageData = L),
      (this.fetchPage = C),
      (this.getAnchorElement = E),
      (this.log = () => {}),
      (this.use = x),
      (this.unuse = q),
      (this.findPlugin = D),
      (this.getCurrentUrl = n),
      (this.cleanupAnimationClasses = f),
      (this.defaults = {
        animateHistoryBrowsing: !1,
        animationSelector: '[class*="transition-"]',
        cache: !0,
        containers: ["#swup"],
        ignoreVisit: function (t, e) {
          let { el: n } = void 0 === e ? {} : e;
          return !!(n !== null && n !== void 0 && n.closest("[data-no-swup]"));
        },
        linkSelector: "a[href]",
        plugins: [],
        resolveUrl: (t) => t,
        requestHeaders: {
          "X-Requested-With": "swup",
          Accept: "text/html, application/xhtml+xml",
        },
        skipPopStateHandling: (t) => {
          var _t$state;
          return (
            "swup" !==
            ((_t$state = t.state) === null || _t$state === void 0
              ? void 0
              : _t$state.source)
          );
        },
      }),
      (this.options = { ...this.defaults, ...t }),
      (this.boundPopStateHandler = this.popStateHandler.bind(this)),
      (this.cache = new v(this)),
      this.enable();
  }
  enable() {
    "undefined" != typeof Promise
      ? ((this.delegatedListeners.click = o(
          this.options.linkSelector,
          "click",
          this.linkClickHandler.bind(this)
        )),
        window.addEventListener("popstate", this.boundPopStateHandler),
        g(document.documentElement, this.options.containers),
        this.options.plugins.forEach((t) => this.use(t)),
        s(),
        this.triggerEvent("enabled"),
        document.documentElement.classList.add("swup-enabled"),
        this.triggerEvent("pageView"))
      : console.warn("Promise is not supported");
  }
  destroy() {
    this.delegatedListeners.click.destroy(),
      window.removeEventListener("popstate", this.boundPopStateHandler),
      this.cache.empty(),
      this.options.plugins.forEach((t) => {
        this.unuse(t);
      }),
      a("[data-swup]").forEach((t) => {
        t.removeAttribute("data-swup");
      }),
      this.off(),
      this.triggerEvent("disabled"),
      document.documentElement.classList.remove("swup-enabled");
  }
  shouldIgnoreVisit(t, e) {
    let { el: n, event: i } = void 0 === e ? {} : e;
    const { origin: s, url: o, hash: r } = p.fromUrl(t);
    return (
      s !== window.location.origin ||
      !(!n || !this.triggerWillOpenNewWindow(n)) ||
      !!this.options.ignoreVisit(o + r, { el: n, event: i })
    );
  }
  linkClickHandler(t) {
    const e = t.delegateTarget,
      { href: i, url: s, hash: o } = p.fromElement(e);
    if (this.shouldIgnoreVisit(i, { el: e, event: t })) return;
    if (t.metaKey || t.ctrlKey || t.shiftKey || t.altKey)
      return void this.triggerEvent("openPageInNewTab", t);
    if (0 !== t.button) return;
    if (
      (this.triggerEvent("clickLink", t), t.preventDefault(), !s || s === n())
    )
      return void this.handleLinkToSamePage(s, o, t);
    if (this.isSameResolvedUrl(s, n())) return;
    this.scrollToElement = o || null;
    const r = e.getAttribute("data-swup-transition") || void 0;
    let a;
    const l = e.getAttribute("data-swup-history");
    l && ["push", "replace"].includes(l) && (a = l),
      this.performPageLoad({ url: s, customTransition: r, history: a });
  }
  handleLinkToSamePage(t, e, n) {
    if (e) {
      if ((this.triggerEvent("samePageWithHash", n), !E(e)))
        return console.warn(`Element for offset not found (#${e})`);
      s(t + e);
    } else this.triggerEvent("samePage", n);
  }
  triggerWillOpenNewWindow(t) {
    return !!t.matches('[download], [target="_blank"]');
  }
  popStateHandler(t) {
    var _ref, _t$state2;
    if (this.options.skipPopStateHandling(t)) return;
    if (this.isSameResolvedUrl(n(), this.currentPageUrl)) return;
    const e =
      (_ref =
        (_t$state2 = t.state) === null || _t$state2 === void 0
          ? void 0
          : _t$state2.url) !== null && _ref !== void 0
        ? _ref
        : location.href;
    if (this.shouldIgnoreVisit(e, { event: t })) return;
    const { url: i, hash: s } = p.fromUrl(e);
    s ? (this.scrollToElement = s) : t.preventDefault(),
      this.triggerEvent("popState", t),
      this.options.animateHistoryBrowsing ||
        (document.documentElement.classList.remove("is-animating"), f()),
      this.performPageLoad({ url: i, event: t });
  }
  resolveUrl(t) {
    if ("function" != typeof this.options.resolveUrl)
      return (
        console.warn("[swup] options.resolveUrl expects a callback function."),
        t
      );
    const e = this.options.resolveUrl(t);
    return e && "string" == typeof e
      ? e.startsWith("//") || e.startsWith("http")
        ? (console.warn(
            "[swup] options.resolveUrl needs to return a relative url"
          ),
          t)
        : e
      : (console.warn("[swup] options.resolveUrl needs to return a url"), t);
  }
  isSameResolvedUrl(t, e) {
    return this.resolveUrl(t) === this.resolveUrl(e);
  }
}
export {
  p as Location,
  e as classify,
  f as cleanupAnimationClasses,
  i as createHistoryRecord,
  O as default,
  o as delegateEvent,
  c as escapeCssIdentifier,
  d as fetch,
  n as getCurrentUrl,
  h as getDataFromHtml,
  g as markSwupElements,
  l as nextTick,
  r as query,
  a as queryAll,
  u as toMs,
  s as updateHistoryRecord,
};
