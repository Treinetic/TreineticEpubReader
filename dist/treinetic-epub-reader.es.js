var Zt = Object.defineProperty;
var Mt = (H, l, e) => l in H ? Zt(H, l, { enumerable: !0, configurable: !0, writable: !0, value: e }) : H[l] = e;
var $ = (H, l, e) => Mt(H, typeof l != "symbol" ? l + "" : l, e);
const zt = () => {
  try {
    return window.localStorage ? (localStorage.setItem("_isLocalStorageEnabled", "?"), localStorage.removeItem("_isLocalStorageEnabled"), !0) : !1;
  } catch {
    return !1;
  }
}, Ct = {
  put: (H, l, e) => {
    if (!zt()) {
      e && e();
      return;
    }
    const p = JSON.stringify(l);
    localStorage.setItem(H, p), e && e();
  },
  clear: (H, l) => {
    if (!zt()) {
      l && l();
      return;
    }
    localStorage.removeItem(H), l && l();
  },
  get: (H, l) => {
    if (!zt())
      return l && l(null), null;
    const e = localStorage.getItem(H), p = e ? JSON.parse(e) : null;
    return l && l(p), p;
  },
  getMultiple: (H, l) => {
    if (!zt())
      return l && l({}), {};
    const e = {};
    for (const p of H) {
      const u = localStorage.getItem(p);
      u && (e[p] = u);
    }
    return l && l(e), e;
  }
}, kt = class kt {
  constructor() {
    $(this, "themes", /* @__PURE__ */ new Map());
    this.registerDefaultThemes();
  }
  static getInstance() {
    return kt.instance || (kt.instance = new kt()), kt.instance;
  }
  registerTheme(l) {
    this.themes.set(l.name, l);
  }
  getTheme(l) {
    const e = this.resolveThemeAlias(l);
    return this.themes.get(e);
  }
  resolveThemeAlias(l) {
    switch (l) {
      case "day":
        return "default-theme";
      case "night":
        return "night-theme";
      case "sepia":
        return "parchment-theme";
      case "kindle":
        return "kindle-paper-theme";
      case "navy":
        return "navy-theme";
      case "author-theme":
        return "default-theme";
      default:
        return l;
    }
  }
  registerDefaultThemes() {
    this.registerTheme({
      name: "default-theme",
      properties: {
        "background-color": "white",
        color: "black"
      }
    }), this.registerTheme({
      name: "night-theme",
      properties: {
        "background-color": "#141414",
        color: "white"
      }
    }), this.registerTheme({
      name: "parchment-theme",
      properties: {
        "background-color": "#f7f1cf",
        color: "#774c27"
      }
    }), this.registerTheme({
      name: "kindle-paper-theme",
      properties: {
        "background-color": "#f6efdf",
        color: "#2e2e2e",
        "font-family": "'Bookerly', 'Georgia', serif"
      }
    }), this.registerTheme({
      name: "ballard-theme",
      properties: {
        "background-color": "#576b96",
        color: "#DDD"
      }
    }), this.registerTheme({
      name: "vancouver-theme",
      properties: {
        "background-color": "#DDD",
        color: "#576b96"
      }
    }), this.registerTheme({
      name: "navy-theme",
      properties: {
        "background-color": "#1c2938",
        color: "#DDD"
      }
    });
  }
};
$(kt, "instance");
let Pt = kt;
const wt = {
  updateReader: (H, l) => {
    if (H) {
      if (H.updateSettings(l), l.theme) {
        document.documentElement.setAttribute("data-theme", l.theme);
        const e = wt.getBookStyles(l.theme);
        H.setBookStyles(e);
        const p = document.querySelector("#reader-wrapper");
        p && e[0].declarations.backgroundColor && (p.style.backgroundColor = e[0].declarations.backgroundColor);
      }
      Ct.put("reader", l);
    }
  },
  getBookStyles: (H) => {
    const l = H === "author-theme", e = wt.getPropertyFromThemeClass(H, "background-color"), p = wt.getPropertyFromThemeClass(H, "color"), u = wt.getPropertyFromThemeClass(H, "font-family");
    return [{
      selector: ":not(a):not(hypothesis-highlight)",
      declarations: {
        backgroundColor: l ? "" : e,
        color: l ? "" : p,
        fontFamily: l ? "" : u || ""
      }
    }, {
      selector: "a",
      declarations: {
        backgroundColor: l ? "" : e,
        color: l ? "" : p
      }
    }];
  },
  getPropertyFromThemeClass: (H, l) => {
    const e = Pt.getInstance().getTheme(H);
    return e ? e.properties[l] : null;
  }
}, vt = class vt {
  constructor() {
    // Properties
    $(this, "metadata", null);
    $(this, "reader", null);
    $(this, "channel", null);
    $(this, "auto_bookmark", !0);
    $(this, "TocJsonObject", null);
    $(this, "currentPackageDocument", null);
    $(this, "readerSettings", null);
    $(this, "callbackFunctions", {});
  }
  static getInstance() {
    return vt.instance === null && (vt.instance = new vt()), vt.instance;
  }
  static createInstance() {
    vt.instance = new vt();
  }
  // Methods
  epubLoaded(l, e, p) {
    this.metadata = l, this.reader = p, this.currentPackageDocument = e, Ct.get("reader", (u) => {
      this.readerSettings = u || this.readerSettings;
    }), this.callbackFunctions.onEpubLoadSuccess && this.callbackFunctions.onEpubLoadSuccess();
  }
  registerEvent(l, e) {
    this.callbackFunctions[l] = e;
  }
  epubFailed(l) {
    this.callbackFunctions.onEpubLoadFail && this.callbackFunctions.onEpubLoadFail(l);
  }
  registerChannel(l) {
    this.channel = l;
  }
  onTOCLoad(l) {
    this.TocJsonObject = l, this.callbackFunctions.onTOCLoaded && this.callbackFunctions.onTOCLoaded(this.TocJsonObject);
  }
  getReaderHeight() {
    return this.callbackFunctions.onReaderHeightRequest ? this.callbackFunctions.onReaderHeightRequest() : null;
  }
  // Navigation
  nextPage() {
    this.reader && this.reader.openPageRight();
  }
  prevPage() {
    this.reader && this.reader.openPageLeft();
  }
  hasNextPage() {
    var l;
    return this.reader && ((l = this.reader.getPaginationInfo()) == null ? void 0 : l.canGoRight());
  }
  hasPrevPage() {
    var l;
    return this.reader && ((l = this.reader.getPaginationInfo()) == null ? void 0 : l.canGoPrev());
  }
  // Bookmarking
  makeBookMark() {
    this.channel && this.channel("BOOKMARK_CURRENT_PAGE");
  }
  setAutoBookmark(l) {
    this.auto_bookmark = l;
  }
  isAutoBookmark() {
    return this.auto_bookmark;
  }
  // TOC
  getTOCJson() {
    return JSON.stringify(this.TocJsonObject ? this.TocJsonObject : []);
  }
  hasTOC() {
    return this.TocJsonObject != null;
  }
  goToPage(l) {
    this.reader && this.reader.openContentUrl(l);
  }
  // Settings
  changeFontSize(l) {
    this.readerSettings = this.cloneUpdate(this.readerSettings, "fontSize", l), wt.updateReader(this.reader, this.readerSettings);
  }
  getRecommendedFontSizeRange() {
    return { min: 60, max: 170 };
  }
  setTheme(l) {
    this.readerSettings = this.cloneUpdate(this.readerSettings, "theme", l), this.reader && wt.updateReader(this.reader, this.readerSettings);
  }
  setScrollOption(l) {
    this.readerSettings = this.cloneUpdate(this.readerSettings, "scroll", l), this.reader && wt.updateReader(this.reader, this.readerSettings);
  }
  // ... helpers
  cloneUpdate(l, e, p) {
    const u = l ? JSON.parse(JSON.stringify(l)) : {};
    return u[e] = p, u;
  }
};
$(vt, "instance", null);
let pt = vt;
const ft = {
  scope: "reader",
  handlers: {},
  init: () => {
    document.addEventListener("keydown", ft.handleKey);
  },
  on: (H, l, e) => {
    const p = `${l}:${H} `;
    ft.handlers[p] || (ft.handlers[p] = []), ft.handlers[p].push(e);
  },
  handleKey: (H) => {
    let l = "";
    H.key === "ArrowRight" && (l = "PageNext"), H.key === "ArrowLeft" && (l = "PagePrevious"), l && ft.dispatch(l);
  },
  dispatch: (H) => {
    const l = `${ft.scope}:${H} `;
    ft.handlers[l] && ft.handlers[l].forEach((e) => e());
  },
  // Constants matching legacy
  PagePrevious: "PagePrevious",
  PageNext: "PageNext",
  NightTheme: "NightTheme",
  applySettings: (H) => {
  }
};
ft.init();
var Ot = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Ht(H) {
  return H && H.__esModule && Object.prototype.hasOwnProperty.call(H, "default") ? H.default : H;
}
function Tt(H) {
  throw new Error('Could not dynamically require "' + H + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}
var Nt = { exports: {} };
/*!

JSZip v3.10.1 - A JavaScript class for generating and reading zip files
<http://stuartk.com/jszip>

(c) 2009-2016 Stuart Knightley <stuart [at] stuartk.com>
Dual licenced under the MIT license or GPLv3. See https://raw.github.com/Stuk/jszip/main/LICENSE.markdown.

JSZip uses the library pako released under the MIT license :
https://github.com/nodeca/pako/blob/main/LICENSE
*/
(function(H, l) {
  (function(e) {
    H.exports = e();
  })(function() {
    return function e(p, u, s) {
      function o(w, b) {
        if (!u[w]) {
          if (!p[w]) {
            var _ = typeof Tt == "function" && Tt;
            if (!b && _) return _(w, !0);
            if (n) return n(w, !0);
            var v = new Error("Cannot find module '" + w + "'");
            throw v.code = "MODULE_NOT_FOUND", v;
          }
          var a = u[w] = { exports: {} };
          p[w][0].call(a.exports, function(g) {
            var i = p[w][1][g];
            return o(i || g);
          }, a, a.exports, e, p, u, s);
        }
        return u[w].exports;
      }
      for (var n = typeof Tt == "function" && Tt, h = 0; h < s.length; h++) o(s[h]);
      return o;
    }({ 1: [function(e, p, u) {
      var s = e("./utils"), o = e("./support"), n = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
      u.encode = function(h) {
        for (var w, b, _, v, a, g, i, f = [], c = 0, y = h.length, x = y, C = s.getTypeOf(h) !== "string"; c < h.length; ) x = y - c, _ = C ? (w = h[c++], b = c < y ? h[c++] : 0, c < y ? h[c++] : 0) : (w = h.charCodeAt(c++), b = c < y ? h.charCodeAt(c++) : 0, c < y ? h.charCodeAt(c++) : 0), v = w >> 2, a = (3 & w) << 4 | b >> 4, g = 1 < x ? (15 & b) << 2 | _ >> 6 : 64, i = 2 < x ? 63 & _ : 64, f.push(n.charAt(v) + n.charAt(a) + n.charAt(g) + n.charAt(i));
        return f.join("");
      }, u.decode = function(h) {
        var w, b, _, v, a, g, i = 0, f = 0, c = "data:";
        if (h.substr(0, c.length) === c) throw new Error("Invalid base64 input, it looks like a data url.");
        var y, x = 3 * (h = h.replace(/[^A-Za-z0-9+/=]/g, "")).length / 4;
        if (h.charAt(h.length - 1) === n.charAt(64) && x--, h.charAt(h.length - 2) === n.charAt(64) && x--, x % 1 != 0) throw new Error("Invalid base64 input, bad content length.");
        for (y = o.uint8array ? new Uint8Array(0 | x) : new Array(0 | x); i < h.length; ) w = n.indexOf(h.charAt(i++)) << 2 | (v = n.indexOf(h.charAt(i++))) >> 4, b = (15 & v) << 4 | (a = n.indexOf(h.charAt(i++))) >> 2, _ = (3 & a) << 6 | (g = n.indexOf(h.charAt(i++))), y[f++] = w, a !== 64 && (y[f++] = b), g !== 64 && (y[f++] = _);
        return y;
      };
    }, { "./support": 30, "./utils": 32 }], 2: [function(e, p, u) {
      var s = e("./external"), o = e("./stream/DataWorker"), n = e("./stream/Crc32Probe"), h = e("./stream/DataLengthProbe");
      function w(b, _, v, a, g) {
        this.compressedSize = b, this.uncompressedSize = _, this.crc32 = v, this.compression = a, this.compressedContent = g;
      }
      w.prototype = { getContentWorker: function() {
        var b = new o(s.Promise.resolve(this.compressedContent)).pipe(this.compression.uncompressWorker()).pipe(new h("data_length")), _ = this;
        return b.on("end", function() {
          if (this.streamInfo.data_length !== _.uncompressedSize) throw new Error("Bug : uncompressed data size mismatch");
        }), b;
      }, getCompressedWorker: function() {
        return new o(s.Promise.resolve(this.compressedContent)).withStreamInfo("compressedSize", this.compressedSize).withStreamInfo("uncompressedSize", this.uncompressedSize).withStreamInfo("crc32", this.crc32).withStreamInfo("compression", this.compression);
      } }, w.createWorkerFrom = function(b, _, v) {
        return b.pipe(new n()).pipe(new h("uncompressedSize")).pipe(_.compressWorker(v)).pipe(new h("compressedSize")).withStreamInfo("compression", _);
      }, p.exports = w;
    }, { "./external": 6, "./stream/Crc32Probe": 25, "./stream/DataLengthProbe": 26, "./stream/DataWorker": 27 }], 3: [function(e, p, u) {
      var s = e("./stream/GenericWorker");
      u.STORE = { magic: "\0\0", compressWorker: function() {
        return new s("STORE compression");
      }, uncompressWorker: function() {
        return new s("STORE decompression");
      } }, u.DEFLATE = e("./flate");
    }, { "./flate": 7, "./stream/GenericWorker": 28 }], 4: [function(e, p, u) {
      var s = e("./utils"), o = function() {
        for (var n, h = [], w = 0; w < 256; w++) {
          n = w;
          for (var b = 0; b < 8; b++) n = 1 & n ? 3988292384 ^ n >>> 1 : n >>> 1;
          h[w] = n;
        }
        return h;
      }();
      p.exports = function(n, h) {
        return n !== void 0 && n.length ? s.getTypeOf(n) !== "string" ? function(w, b, _, v) {
          var a = o, g = v + _;
          w ^= -1;
          for (var i = v; i < g; i++) w = w >>> 8 ^ a[255 & (w ^ b[i])];
          return -1 ^ w;
        }(0 | h, n, n.length, 0) : function(w, b, _, v) {
          var a = o, g = v + _;
          w ^= -1;
          for (var i = v; i < g; i++) w = w >>> 8 ^ a[255 & (w ^ b.charCodeAt(i))];
          return -1 ^ w;
        }(0 | h, n, n.length, 0) : 0;
      };
    }, { "./utils": 32 }], 5: [function(e, p, u) {
      u.base64 = !1, u.binary = !1, u.dir = !1, u.createFolders = !0, u.date = null, u.compression = null, u.compressionOptions = null, u.comment = null, u.unixPermissions = null, u.dosPermissions = null;
    }, {}], 6: [function(e, p, u) {
      var s = null;
      s = typeof Promise < "u" ? Promise : e("lie"), p.exports = { Promise: s };
    }, { lie: 37 }], 7: [function(e, p, u) {
      var s = typeof Uint8Array < "u" && typeof Uint16Array < "u" && typeof Uint32Array < "u", o = e("pako"), n = e("./utils"), h = e("./stream/GenericWorker"), w = s ? "uint8array" : "array";
      function b(_, v) {
        h.call(this, "FlateWorker/" + _), this._pako = null, this._pakoAction = _, this._pakoOptions = v, this.meta = {};
      }
      u.magic = "\b\0", n.inherits(b, h), b.prototype.processChunk = function(_) {
        this.meta = _.meta, this._pako === null && this._createPako(), this._pako.push(n.transformTo(w, _.data), !1);
      }, b.prototype.flush = function() {
        h.prototype.flush.call(this), this._pako === null && this._createPako(), this._pako.push([], !0);
      }, b.prototype.cleanUp = function() {
        h.prototype.cleanUp.call(this), this._pako = null;
      }, b.prototype._createPako = function() {
        this._pako = new o[this._pakoAction]({ raw: !0, level: this._pakoOptions.level || -1 });
        var _ = this;
        this._pako.onData = function(v) {
          _.push({ data: v, meta: _.meta });
        };
      }, u.compressWorker = function(_) {
        return new b("Deflate", _);
      }, u.uncompressWorker = function() {
        return new b("Inflate", {});
      };
    }, { "./stream/GenericWorker": 28, "./utils": 32, pako: 38 }], 8: [function(e, p, u) {
      function s(a, g) {
        var i, f = "";
        for (i = 0; i < g; i++) f += String.fromCharCode(255 & a), a >>>= 8;
        return f;
      }
      function o(a, g, i, f, c, y) {
        var x, C, E = a.file, D = a.compression, P = y !== w.utf8encode, U = n.transformTo("string", y(E.name)), T = n.transformTo("string", w.utf8encode(E.name)), M = E.comment, X = n.transformTo("string", y(M)), k = n.transformTo("string", w.utf8encode(M)), R = T.length !== E.name.length, r = k.length !== M.length, B = "", tt = "", W = "", et = E.dir, j = E.date, Q = { crc32: 0, compressedSize: 0, uncompressedSize: 0 };
        g && !i || (Q.crc32 = a.crc32, Q.compressedSize = a.compressedSize, Q.uncompressedSize = a.uncompressedSize);
        var z = 0;
        g && (z |= 8), P || !R && !r || (z |= 2048);
        var I = 0, J = 0;
        et && (I |= 16), c === "UNIX" ? (J = 798, I |= function(q, ot) {
          var dt = q;
          return q || (dt = ot ? 16893 : 33204), (65535 & dt) << 16;
        }(E.unixPermissions, et)) : (J = 20, I |= function(q) {
          return 63 & (q || 0);
        }(E.dosPermissions)), x = j.getUTCHours(), x <<= 6, x |= j.getUTCMinutes(), x <<= 5, x |= j.getUTCSeconds() / 2, C = j.getUTCFullYear() - 1980, C <<= 4, C |= j.getUTCMonth() + 1, C <<= 5, C |= j.getUTCDate(), R && (tt = s(1, 1) + s(b(U), 4) + T, B += "up" + s(tt.length, 2) + tt), r && (W = s(1, 1) + s(b(X), 4) + k, B += "uc" + s(W.length, 2) + W);
        var V = "";
        return V += `
\0`, V += s(z, 2), V += D.magic, V += s(x, 2), V += s(C, 2), V += s(Q.crc32, 4), V += s(Q.compressedSize, 4), V += s(Q.uncompressedSize, 4), V += s(U.length, 2), V += s(B.length, 2), { fileRecord: _.LOCAL_FILE_HEADER + V + U + B, dirRecord: _.CENTRAL_FILE_HEADER + s(J, 2) + V + s(X.length, 2) + "\0\0\0\0" + s(I, 4) + s(f, 4) + U + B + X };
      }
      var n = e("../utils"), h = e("../stream/GenericWorker"), w = e("../utf8"), b = e("../crc32"), _ = e("../signature");
      function v(a, g, i, f) {
        h.call(this, "ZipFileWorker"), this.bytesWritten = 0, this.zipComment = g, this.zipPlatform = i, this.encodeFileName = f, this.streamFiles = a, this.accumulate = !1, this.contentBuffer = [], this.dirRecords = [], this.currentSourceOffset = 0, this.entriesCount = 0, this.currentFile = null, this._sources = [];
      }
      n.inherits(v, h), v.prototype.push = function(a) {
        var g = a.meta.percent || 0, i = this.entriesCount, f = this._sources.length;
        this.accumulate ? this.contentBuffer.push(a) : (this.bytesWritten += a.data.length, h.prototype.push.call(this, { data: a.data, meta: { currentFile: this.currentFile, percent: i ? (g + 100 * (i - f - 1)) / i : 100 } }));
      }, v.prototype.openedSource = function(a) {
        this.currentSourceOffset = this.bytesWritten, this.currentFile = a.file.name;
        var g = this.streamFiles && !a.file.dir;
        if (g) {
          var i = o(a, g, !1, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
          this.push({ data: i.fileRecord, meta: { percent: 0 } });
        } else this.accumulate = !0;
      }, v.prototype.closedSource = function(a) {
        this.accumulate = !1;
        var g = this.streamFiles && !a.file.dir, i = o(a, g, !0, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
        if (this.dirRecords.push(i.dirRecord), g) this.push({ data: function(f) {
          return _.DATA_DESCRIPTOR + s(f.crc32, 4) + s(f.compressedSize, 4) + s(f.uncompressedSize, 4);
        }(a), meta: { percent: 100 } });
        else for (this.push({ data: i.fileRecord, meta: { percent: 0 } }); this.contentBuffer.length; ) this.push(this.contentBuffer.shift());
        this.currentFile = null;
      }, v.prototype.flush = function() {
        for (var a = this.bytesWritten, g = 0; g < this.dirRecords.length; g++) this.push({ data: this.dirRecords[g], meta: { percent: 100 } });
        var i = this.bytesWritten - a, f = function(c, y, x, C, E) {
          var D = n.transformTo("string", E(C));
          return _.CENTRAL_DIRECTORY_END + "\0\0\0\0" + s(c, 2) + s(c, 2) + s(y, 4) + s(x, 4) + s(D.length, 2) + D;
        }(this.dirRecords.length, i, a, this.zipComment, this.encodeFileName);
        this.push({ data: f, meta: { percent: 100 } });
      }, v.prototype.prepareNextSource = function() {
        this.previous = this._sources.shift(), this.openedSource(this.previous.streamInfo), this.isPaused ? this.previous.pause() : this.previous.resume();
      }, v.prototype.registerPrevious = function(a) {
        this._sources.push(a);
        var g = this;
        return a.on("data", function(i) {
          g.processChunk(i);
        }), a.on("end", function() {
          g.closedSource(g.previous.streamInfo), g._sources.length ? g.prepareNextSource() : g.end();
        }), a.on("error", function(i) {
          g.error(i);
        }), this;
      }, v.prototype.resume = function() {
        return !!h.prototype.resume.call(this) && (!this.previous && this._sources.length ? (this.prepareNextSource(), !0) : this.previous || this._sources.length || this.generatedError ? void 0 : (this.end(), !0));
      }, v.prototype.error = function(a) {
        var g = this._sources;
        if (!h.prototype.error.call(this, a)) return !1;
        for (var i = 0; i < g.length; i++) try {
          g[i].error(a);
        } catch {
        }
        return !0;
      }, v.prototype.lock = function() {
        h.prototype.lock.call(this);
        for (var a = this._sources, g = 0; g < a.length; g++) a[g].lock();
      }, p.exports = v;
    }, { "../crc32": 4, "../signature": 23, "../stream/GenericWorker": 28, "../utf8": 31, "../utils": 32 }], 9: [function(e, p, u) {
      var s = e("../compressions"), o = e("./ZipFileWorker");
      u.generateWorker = function(n, h, w) {
        var b = new o(h.streamFiles, w, h.platform, h.encodeFileName), _ = 0;
        try {
          n.forEach(function(v, a) {
            _++;
            var g = function(y, x) {
              var C = y || x, E = s[C];
              if (!E) throw new Error(C + " is not a valid compression method !");
              return E;
            }(a.options.compression, h.compression), i = a.options.compressionOptions || h.compressionOptions || {}, f = a.dir, c = a.date;
            a._compressWorker(g, i).withStreamInfo("file", { name: v, dir: f, date: c, comment: a.comment || "", unixPermissions: a.unixPermissions, dosPermissions: a.dosPermissions }).pipe(b);
          }), b.entriesCount = _;
        } catch (v) {
          b.error(v);
        }
        return b;
      };
    }, { "../compressions": 3, "./ZipFileWorker": 8 }], 10: [function(e, p, u) {
      function s() {
        if (!(this instanceof s)) return new s();
        if (arguments.length) throw new Error("The constructor with parameters has been removed in JSZip 3.0, please check the upgrade guide.");
        this.files = /* @__PURE__ */ Object.create(null), this.comment = null, this.root = "", this.clone = function() {
          var o = new s();
          for (var n in this) typeof this[n] != "function" && (o[n] = this[n]);
          return o;
        };
      }
      (s.prototype = e("./object")).loadAsync = e("./load"), s.support = e("./support"), s.defaults = e("./defaults"), s.version = "3.10.1", s.loadAsync = function(o, n) {
        return new s().loadAsync(o, n);
      }, s.external = e("./external"), p.exports = s;
    }, { "./defaults": 5, "./external": 6, "./load": 11, "./object": 15, "./support": 30 }], 11: [function(e, p, u) {
      var s = e("./utils"), o = e("./external"), n = e("./utf8"), h = e("./zipEntries"), w = e("./stream/Crc32Probe"), b = e("./nodejsUtils");
      function _(v) {
        return new o.Promise(function(a, g) {
          var i = v.decompressed.getContentWorker().pipe(new w());
          i.on("error", function(f) {
            g(f);
          }).on("end", function() {
            i.streamInfo.crc32 !== v.decompressed.crc32 ? g(new Error("Corrupted zip : CRC32 mismatch")) : a();
          }).resume();
        });
      }
      p.exports = function(v, a) {
        var g = this;
        return a = s.extend(a || {}, { base64: !1, checkCRC32: !1, optimizedBinaryString: !1, createFolders: !1, decodeFileName: n.utf8decode }), b.isNode && b.isStream(v) ? o.Promise.reject(new Error("JSZip can't accept a stream when loading a zip file.")) : s.prepareContent("the loaded zip file", v, !0, a.optimizedBinaryString, a.base64).then(function(i) {
          var f = new h(a);
          return f.load(i), f;
        }).then(function(i) {
          var f = [o.Promise.resolve(i)], c = i.files;
          if (a.checkCRC32) for (var y = 0; y < c.length; y++) f.push(_(c[y]));
          return o.Promise.all(f);
        }).then(function(i) {
          for (var f = i.shift(), c = f.files, y = 0; y < c.length; y++) {
            var x = c[y], C = x.fileNameStr, E = s.resolve(x.fileNameStr);
            g.file(E, x.decompressed, { binary: !0, optimizedBinaryString: !0, date: x.date, dir: x.dir, comment: x.fileCommentStr.length ? x.fileCommentStr : null, unixPermissions: x.unixPermissions, dosPermissions: x.dosPermissions, createFolders: a.createFolders }), x.dir || (g.file(E).unsafeOriginalName = C);
          }
          return f.zipComment.length && (g.comment = f.zipComment), g;
        });
      };
    }, { "./external": 6, "./nodejsUtils": 14, "./stream/Crc32Probe": 25, "./utf8": 31, "./utils": 32, "./zipEntries": 33 }], 12: [function(e, p, u) {
      var s = e("../utils"), o = e("../stream/GenericWorker");
      function n(h, w) {
        o.call(this, "Nodejs stream input adapter for " + h), this._upstreamEnded = !1, this._bindStream(w);
      }
      s.inherits(n, o), n.prototype._bindStream = function(h) {
        var w = this;
        (this._stream = h).pause(), h.on("data", function(b) {
          w.push({ data: b, meta: { percent: 0 } });
        }).on("error", function(b) {
          w.isPaused ? this.generatedError = b : w.error(b);
        }).on("end", function() {
          w.isPaused ? w._upstreamEnded = !0 : w.end();
        });
      }, n.prototype.pause = function() {
        return !!o.prototype.pause.call(this) && (this._stream.pause(), !0);
      }, n.prototype.resume = function() {
        return !!o.prototype.resume.call(this) && (this._upstreamEnded ? this.end() : this._stream.resume(), !0);
      }, p.exports = n;
    }, { "../stream/GenericWorker": 28, "../utils": 32 }], 13: [function(e, p, u) {
      var s = e("readable-stream").Readable;
      function o(n, h, w) {
        s.call(this, h), this._helper = n;
        var b = this;
        n.on("data", function(_, v) {
          b.push(_) || b._helper.pause(), w && w(v);
        }).on("error", function(_) {
          b.emit("error", _);
        }).on("end", function() {
          b.push(null);
        });
      }
      e("../utils").inherits(o, s), o.prototype._read = function() {
        this._helper.resume();
      }, p.exports = o;
    }, { "../utils": 32, "readable-stream": 16 }], 14: [function(e, p, u) {
      p.exports = { isNode: typeof Buffer < "u", newBufferFrom: function(s, o) {
        if (Buffer.from && Buffer.from !== Uint8Array.from) return Buffer.from(s, o);
        if (typeof s == "number") throw new Error('The "data" argument must not be a number');
        return new Buffer(s, o);
      }, allocBuffer: function(s) {
        if (Buffer.alloc) return Buffer.alloc(s);
        var o = new Buffer(s);
        return o.fill(0), o;
      }, isBuffer: function(s) {
        return Buffer.isBuffer(s);
      }, isStream: function(s) {
        return s && typeof s.on == "function" && typeof s.pause == "function" && typeof s.resume == "function";
      } };
    }, {}], 15: [function(e, p, u) {
      function s(E, D, P) {
        var U, T = n.getTypeOf(D), M = n.extend(P || {}, b);
        M.date = M.date || /* @__PURE__ */ new Date(), M.compression !== null && (M.compression = M.compression.toUpperCase()), typeof M.unixPermissions == "string" && (M.unixPermissions = parseInt(M.unixPermissions, 8)), M.unixPermissions && 16384 & M.unixPermissions && (M.dir = !0), M.dosPermissions && 16 & M.dosPermissions && (M.dir = !0), M.dir && (E = c(E)), M.createFolders && (U = f(E)) && y.call(this, U, !0);
        var X = T === "string" && M.binary === !1 && M.base64 === !1;
        P && P.binary !== void 0 || (M.binary = !X), (D instanceof _ && D.uncompressedSize === 0 || M.dir || !D || D.length === 0) && (M.base64 = !1, M.binary = !0, D = "", M.compression = "STORE", T = "string");
        var k = null;
        k = D instanceof _ || D instanceof h ? D : g.isNode && g.isStream(D) ? new i(E, D) : n.prepareContent(E, D, M.binary, M.optimizedBinaryString, M.base64);
        var R = new v(E, k, M);
        this.files[E] = R;
      }
      var o = e("./utf8"), n = e("./utils"), h = e("./stream/GenericWorker"), w = e("./stream/StreamHelper"), b = e("./defaults"), _ = e("./compressedObject"), v = e("./zipObject"), a = e("./generate"), g = e("./nodejsUtils"), i = e("./nodejs/NodejsStreamInputAdapter"), f = function(E) {
        E.slice(-1) === "/" && (E = E.substring(0, E.length - 1));
        var D = E.lastIndexOf("/");
        return 0 < D ? E.substring(0, D) : "";
      }, c = function(E) {
        return E.slice(-1) !== "/" && (E += "/"), E;
      }, y = function(E, D) {
        return D = D !== void 0 ? D : b.createFolders, E = c(E), this.files[E] || s.call(this, E, null, { dir: !0, createFolders: D }), this.files[E];
      };
      function x(E) {
        return Object.prototype.toString.call(E) === "[object RegExp]";
      }
      var C = { load: function() {
        throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
      }, forEach: function(E) {
        var D, P, U;
        for (D in this.files) U = this.files[D], (P = D.slice(this.root.length, D.length)) && D.slice(0, this.root.length) === this.root && E(P, U);
      }, filter: function(E) {
        var D = [];
        return this.forEach(function(P, U) {
          E(P, U) && D.push(U);
        }), D;
      }, file: function(E, D, P) {
        if (arguments.length !== 1) return E = this.root + E, s.call(this, E, D, P), this;
        if (x(E)) {
          var U = E;
          return this.filter(function(M, X) {
            return !X.dir && U.test(M);
          });
        }
        var T = this.files[this.root + E];
        return T && !T.dir ? T : null;
      }, folder: function(E) {
        if (!E) return this;
        if (x(E)) return this.filter(function(T, M) {
          return M.dir && E.test(T);
        });
        var D = this.root + E, P = y.call(this, D), U = this.clone();
        return U.root = P.name, U;
      }, remove: function(E) {
        E = this.root + E;
        var D = this.files[E];
        if (D || (E.slice(-1) !== "/" && (E += "/"), D = this.files[E]), D && !D.dir) delete this.files[E];
        else for (var P = this.filter(function(T, M) {
          return M.name.slice(0, E.length) === E;
        }), U = 0; U < P.length; U++) delete this.files[P[U].name];
        return this;
      }, generate: function() {
        throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
      }, generateInternalStream: function(E) {
        var D, P = {};
        try {
          if ((P = n.extend(E || {}, { streamFiles: !1, compression: "STORE", compressionOptions: null, type: "", platform: "DOS", comment: null, mimeType: "application/zip", encodeFileName: o.utf8encode })).type = P.type.toLowerCase(), P.compression = P.compression.toUpperCase(), P.type === "binarystring" && (P.type = "string"), !P.type) throw new Error("No output type specified.");
          n.checkSupport(P.type), P.platform !== "darwin" && P.platform !== "freebsd" && P.platform !== "linux" && P.platform !== "sunos" || (P.platform = "UNIX"), P.platform === "win32" && (P.platform = "DOS");
          var U = P.comment || this.comment || "";
          D = a.generateWorker(this, P, U);
        } catch (T) {
          (D = new h("error")).error(T);
        }
        return new w(D, P.type || "string", P.mimeType);
      }, generateAsync: function(E, D) {
        return this.generateInternalStream(E).accumulate(D);
      }, generateNodeStream: function(E, D) {
        return (E = E || {}).type || (E.type = "nodebuffer"), this.generateInternalStream(E).toNodejsStream(D);
      } };
      p.exports = C;
    }, { "./compressedObject": 2, "./defaults": 5, "./generate": 9, "./nodejs/NodejsStreamInputAdapter": 12, "./nodejsUtils": 14, "./stream/GenericWorker": 28, "./stream/StreamHelper": 29, "./utf8": 31, "./utils": 32, "./zipObject": 35 }], 16: [function(e, p, u) {
      p.exports = e("stream");
    }, { stream: void 0 }], 17: [function(e, p, u) {
      var s = e("./DataReader");
      function o(n) {
        s.call(this, n);
        for (var h = 0; h < this.data.length; h++) n[h] = 255 & n[h];
      }
      e("../utils").inherits(o, s), o.prototype.byteAt = function(n) {
        return this.data[this.zero + n];
      }, o.prototype.lastIndexOfSignature = function(n) {
        for (var h = n.charCodeAt(0), w = n.charCodeAt(1), b = n.charCodeAt(2), _ = n.charCodeAt(3), v = this.length - 4; 0 <= v; --v) if (this.data[v] === h && this.data[v + 1] === w && this.data[v + 2] === b && this.data[v + 3] === _) return v - this.zero;
        return -1;
      }, o.prototype.readAndCheckSignature = function(n) {
        var h = n.charCodeAt(0), w = n.charCodeAt(1), b = n.charCodeAt(2), _ = n.charCodeAt(3), v = this.readData(4);
        return h === v[0] && w === v[1] && b === v[2] && _ === v[3];
      }, o.prototype.readData = function(n) {
        if (this.checkOffset(n), n === 0) return [];
        var h = this.data.slice(this.zero + this.index, this.zero + this.index + n);
        return this.index += n, h;
      }, p.exports = o;
    }, { "../utils": 32, "./DataReader": 18 }], 18: [function(e, p, u) {
      var s = e("../utils");
      function o(n) {
        this.data = n, this.length = n.length, this.index = 0, this.zero = 0;
      }
      o.prototype = { checkOffset: function(n) {
        this.checkIndex(this.index + n);
      }, checkIndex: function(n) {
        if (this.length < this.zero + n || n < 0) throw new Error("End of data reached (data length = " + this.length + ", asked index = " + n + "). Corrupted zip ?");
      }, setIndex: function(n) {
        this.checkIndex(n), this.index = n;
      }, skip: function(n) {
        this.setIndex(this.index + n);
      }, byteAt: function() {
      }, readInt: function(n) {
        var h, w = 0;
        for (this.checkOffset(n), h = this.index + n - 1; h >= this.index; h--) w = (w << 8) + this.byteAt(h);
        return this.index += n, w;
      }, readString: function(n) {
        return s.transformTo("string", this.readData(n));
      }, readData: function() {
      }, lastIndexOfSignature: function() {
      }, readAndCheckSignature: function() {
      }, readDate: function() {
        var n = this.readInt(4);
        return new Date(Date.UTC(1980 + (n >> 25 & 127), (n >> 21 & 15) - 1, n >> 16 & 31, n >> 11 & 31, n >> 5 & 63, (31 & n) << 1));
      } }, p.exports = o;
    }, { "../utils": 32 }], 19: [function(e, p, u) {
      var s = e("./Uint8ArrayReader");
      function o(n) {
        s.call(this, n);
      }
      e("../utils").inherits(o, s), o.prototype.readData = function(n) {
        this.checkOffset(n);
        var h = this.data.slice(this.zero + this.index, this.zero + this.index + n);
        return this.index += n, h;
      }, p.exports = o;
    }, { "../utils": 32, "./Uint8ArrayReader": 21 }], 20: [function(e, p, u) {
      var s = e("./DataReader");
      function o(n) {
        s.call(this, n);
      }
      e("../utils").inherits(o, s), o.prototype.byteAt = function(n) {
        return this.data.charCodeAt(this.zero + n);
      }, o.prototype.lastIndexOfSignature = function(n) {
        return this.data.lastIndexOf(n) - this.zero;
      }, o.prototype.readAndCheckSignature = function(n) {
        return n === this.readData(4);
      }, o.prototype.readData = function(n) {
        this.checkOffset(n);
        var h = this.data.slice(this.zero + this.index, this.zero + this.index + n);
        return this.index += n, h;
      }, p.exports = o;
    }, { "../utils": 32, "./DataReader": 18 }], 21: [function(e, p, u) {
      var s = e("./ArrayReader");
      function o(n) {
        s.call(this, n);
      }
      e("../utils").inherits(o, s), o.prototype.readData = function(n) {
        if (this.checkOffset(n), n === 0) return new Uint8Array(0);
        var h = this.data.subarray(this.zero + this.index, this.zero + this.index + n);
        return this.index += n, h;
      }, p.exports = o;
    }, { "../utils": 32, "./ArrayReader": 17 }], 22: [function(e, p, u) {
      var s = e("../utils"), o = e("../support"), n = e("./ArrayReader"), h = e("./StringReader"), w = e("./NodeBufferReader"), b = e("./Uint8ArrayReader");
      p.exports = function(_) {
        var v = s.getTypeOf(_);
        return s.checkSupport(v), v !== "string" || o.uint8array ? v === "nodebuffer" ? new w(_) : o.uint8array ? new b(s.transformTo("uint8array", _)) : new n(s.transformTo("array", _)) : new h(_);
      };
    }, { "../support": 30, "../utils": 32, "./ArrayReader": 17, "./NodeBufferReader": 19, "./StringReader": 20, "./Uint8ArrayReader": 21 }], 23: [function(e, p, u) {
      u.LOCAL_FILE_HEADER = "PK", u.CENTRAL_FILE_HEADER = "PK", u.CENTRAL_DIRECTORY_END = "PK", u.ZIP64_CENTRAL_DIRECTORY_LOCATOR = "PK\x07", u.ZIP64_CENTRAL_DIRECTORY_END = "PK", u.DATA_DESCRIPTOR = "PK\x07\b";
    }, {}], 24: [function(e, p, u) {
      var s = e("./GenericWorker"), o = e("../utils");
      function n(h) {
        s.call(this, "ConvertWorker to " + h), this.destType = h;
      }
      o.inherits(n, s), n.prototype.processChunk = function(h) {
        this.push({ data: o.transformTo(this.destType, h.data), meta: h.meta });
      }, p.exports = n;
    }, { "../utils": 32, "./GenericWorker": 28 }], 25: [function(e, p, u) {
      var s = e("./GenericWorker"), o = e("../crc32");
      function n() {
        s.call(this, "Crc32Probe"), this.withStreamInfo("crc32", 0);
      }
      e("../utils").inherits(n, s), n.prototype.processChunk = function(h) {
        this.streamInfo.crc32 = o(h.data, this.streamInfo.crc32 || 0), this.push(h);
      }, p.exports = n;
    }, { "../crc32": 4, "../utils": 32, "./GenericWorker": 28 }], 26: [function(e, p, u) {
      var s = e("../utils"), o = e("./GenericWorker");
      function n(h) {
        o.call(this, "DataLengthProbe for " + h), this.propName = h, this.withStreamInfo(h, 0);
      }
      s.inherits(n, o), n.prototype.processChunk = function(h) {
        if (h) {
          var w = this.streamInfo[this.propName] || 0;
          this.streamInfo[this.propName] = w + h.data.length;
        }
        o.prototype.processChunk.call(this, h);
      }, p.exports = n;
    }, { "../utils": 32, "./GenericWorker": 28 }], 27: [function(e, p, u) {
      var s = e("../utils"), o = e("./GenericWorker");
      function n(h) {
        o.call(this, "DataWorker");
        var w = this;
        this.dataIsReady = !1, this.index = 0, this.max = 0, this.data = null, this.type = "", this._tickScheduled = !1, h.then(function(b) {
          w.dataIsReady = !0, w.data = b, w.max = b && b.length || 0, w.type = s.getTypeOf(b), w.isPaused || w._tickAndRepeat();
        }, function(b) {
          w.error(b);
        });
      }
      s.inherits(n, o), n.prototype.cleanUp = function() {
        o.prototype.cleanUp.call(this), this.data = null;
      }, n.prototype.resume = function() {
        return !!o.prototype.resume.call(this) && (!this._tickScheduled && this.dataIsReady && (this._tickScheduled = !0, s.delay(this._tickAndRepeat, [], this)), !0);
      }, n.prototype._tickAndRepeat = function() {
        this._tickScheduled = !1, this.isPaused || this.isFinished || (this._tick(), this.isFinished || (s.delay(this._tickAndRepeat, [], this), this._tickScheduled = !0));
      }, n.prototype._tick = function() {
        if (this.isPaused || this.isFinished) return !1;
        var h = null, w = Math.min(this.max, this.index + 16384);
        if (this.index >= this.max) return this.end();
        switch (this.type) {
          case "string":
            h = this.data.substring(this.index, w);
            break;
          case "uint8array":
            h = this.data.subarray(this.index, w);
            break;
          case "array":
          case "nodebuffer":
            h = this.data.slice(this.index, w);
        }
        return this.index = w, this.push({ data: h, meta: { percent: this.max ? this.index / this.max * 100 : 0 } });
      }, p.exports = n;
    }, { "../utils": 32, "./GenericWorker": 28 }], 28: [function(e, p, u) {
      function s(o) {
        this.name = o || "default", this.streamInfo = {}, this.generatedError = null, this.extraStreamInfo = {}, this.isPaused = !0, this.isFinished = !1, this.isLocked = !1, this._listeners = { data: [], end: [], error: [] }, this.previous = null;
      }
      s.prototype = { push: function(o) {
        this.emit("data", o);
      }, end: function() {
        if (this.isFinished) return !1;
        this.flush();
        try {
          this.emit("end"), this.cleanUp(), this.isFinished = !0;
        } catch (o) {
          this.emit("error", o);
        }
        return !0;
      }, error: function(o) {
        return !this.isFinished && (this.isPaused ? this.generatedError = o : (this.isFinished = !0, this.emit("error", o), this.previous && this.previous.error(o), this.cleanUp()), !0);
      }, on: function(o, n) {
        return this._listeners[o].push(n), this;
      }, cleanUp: function() {
        this.streamInfo = this.generatedError = this.extraStreamInfo = null, this._listeners = [];
      }, emit: function(o, n) {
        if (this._listeners[o]) for (var h = 0; h < this._listeners[o].length; h++) this._listeners[o][h].call(this, n);
      }, pipe: function(o) {
        return o.registerPrevious(this);
      }, registerPrevious: function(o) {
        if (this.isLocked) throw new Error("The stream '" + this + "' has already been used.");
        this.streamInfo = o.streamInfo, this.mergeStreamInfo(), this.previous = o;
        var n = this;
        return o.on("data", function(h) {
          n.processChunk(h);
        }), o.on("end", function() {
          n.end();
        }), o.on("error", function(h) {
          n.error(h);
        }), this;
      }, pause: function() {
        return !this.isPaused && !this.isFinished && (this.isPaused = !0, this.previous && this.previous.pause(), !0);
      }, resume: function() {
        if (!this.isPaused || this.isFinished) return !1;
        var o = this.isPaused = !1;
        return this.generatedError && (this.error(this.generatedError), o = !0), this.previous && this.previous.resume(), !o;
      }, flush: function() {
      }, processChunk: function(o) {
        this.push(o);
      }, withStreamInfo: function(o, n) {
        return this.extraStreamInfo[o] = n, this.mergeStreamInfo(), this;
      }, mergeStreamInfo: function() {
        for (var o in this.extraStreamInfo) Object.prototype.hasOwnProperty.call(this.extraStreamInfo, o) && (this.streamInfo[o] = this.extraStreamInfo[o]);
      }, lock: function() {
        if (this.isLocked) throw new Error("The stream '" + this + "' has already been used.");
        this.isLocked = !0, this.previous && this.previous.lock();
      }, toString: function() {
        var o = "Worker " + this.name;
        return this.previous ? this.previous + " -> " + o : o;
      } }, p.exports = s;
    }, {}], 29: [function(e, p, u) {
      var s = e("../utils"), o = e("./ConvertWorker"), n = e("./GenericWorker"), h = e("../base64"), w = e("../support"), b = e("../external"), _ = null;
      if (w.nodestream) try {
        _ = e("../nodejs/NodejsStreamOutputAdapter");
      } catch {
      }
      function v(g, i) {
        return new b.Promise(function(f, c) {
          var y = [], x = g._internalType, C = g._outputType, E = g._mimeType;
          g.on("data", function(D, P) {
            y.push(D), i && i(P);
          }).on("error", function(D) {
            y = [], c(D);
          }).on("end", function() {
            try {
              var D = function(P, U, T) {
                switch (P) {
                  case "blob":
                    return s.newBlob(s.transformTo("arraybuffer", U), T);
                  case "base64":
                    return h.encode(U);
                  default:
                    return s.transformTo(P, U);
                }
              }(C, function(P, U) {
                var T, M = 0, X = null, k = 0;
                for (T = 0; T < U.length; T++) k += U[T].length;
                switch (P) {
                  case "string":
                    return U.join("");
                  case "array":
                    return Array.prototype.concat.apply([], U);
                  case "uint8array":
                    for (X = new Uint8Array(k), T = 0; T < U.length; T++) X.set(U[T], M), M += U[T].length;
                    return X;
                  case "nodebuffer":
                    return Buffer.concat(U);
                  default:
                    throw new Error("concat : unsupported type '" + P + "'");
                }
              }(x, y), E);
              f(D);
            } catch (P) {
              c(P);
            }
            y = [];
          }).resume();
        });
      }
      function a(g, i, f) {
        var c = i;
        switch (i) {
          case "blob":
          case "arraybuffer":
            c = "uint8array";
            break;
          case "base64":
            c = "string";
        }
        try {
          this._internalType = c, this._outputType = i, this._mimeType = f, s.checkSupport(c), this._worker = g.pipe(new o(c)), g.lock();
        } catch (y) {
          this._worker = new n("error"), this._worker.error(y);
        }
      }
      a.prototype = { accumulate: function(g) {
        return v(this, g);
      }, on: function(g, i) {
        var f = this;
        return g === "data" ? this._worker.on(g, function(c) {
          i.call(f, c.data, c.meta);
        }) : this._worker.on(g, function() {
          s.delay(i, arguments, f);
        }), this;
      }, resume: function() {
        return s.delay(this._worker.resume, [], this._worker), this;
      }, pause: function() {
        return this._worker.pause(), this;
      }, toNodejsStream: function(g) {
        if (s.checkSupport("nodestream"), this._outputType !== "nodebuffer") throw new Error(this._outputType + " is not supported by this method");
        return new _(this, { objectMode: this._outputType !== "nodebuffer" }, g);
      } }, p.exports = a;
    }, { "../base64": 1, "../external": 6, "../nodejs/NodejsStreamOutputAdapter": 13, "../support": 30, "../utils": 32, "./ConvertWorker": 24, "./GenericWorker": 28 }], 30: [function(e, p, u) {
      if (u.base64 = !0, u.array = !0, u.string = !0, u.arraybuffer = typeof ArrayBuffer < "u" && typeof Uint8Array < "u", u.nodebuffer = typeof Buffer < "u", u.uint8array = typeof Uint8Array < "u", typeof ArrayBuffer > "u") u.blob = !1;
      else {
        var s = new ArrayBuffer(0);
        try {
          u.blob = new Blob([s], { type: "application/zip" }).size === 0;
        } catch {
          try {
            var o = new (self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder)();
            o.append(s), u.blob = o.getBlob("application/zip").size === 0;
          } catch {
            u.blob = !1;
          }
        }
      }
      try {
        u.nodestream = !!e("readable-stream").Readable;
      } catch {
        u.nodestream = !1;
      }
    }, { "readable-stream": 16 }], 31: [function(e, p, u) {
      for (var s = e("./utils"), o = e("./support"), n = e("./nodejsUtils"), h = e("./stream/GenericWorker"), w = new Array(256), b = 0; b < 256; b++) w[b] = 252 <= b ? 6 : 248 <= b ? 5 : 240 <= b ? 4 : 224 <= b ? 3 : 192 <= b ? 2 : 1;
      w[254] = w[254] = 1;
      function _() {
        h.call(this, "utf-8 decode"), this.leftOver = null;
      }
      function v() {
        h.call(this, "utf-8 encode");
      }
      u.utf8encode = function(a) {
        return o.nodebuffer ? n.newBufferFrom(a, "utf-8") : function(g) {
          var i, f, c, y, x, C = g.length, E = 0;
          for (y = 0; y < C; y++) (64512 & (f = g.charCodeAt(y))) == 55296 && y + 1 < C && (64512 & (c = g.charCodeAt(y + 1))) == 56320 && (f = 65536 + (f - 55296 << 10) + (c - 56320), y++), E += f < 128 ? 1 : f < 2048 ? 2 : f < 65536 ? 3 : 4;
          for (i = o.uint8array ? new Uint8Array(E) : new Array(E), y = x = 0; x < E; y++) (64512 & (f = g.charCodeAt(y))) == 55296 && y + 1 < C && (64512 & (c = g.charCodeAt(y + 1))) == 56320 && (f = 65536 + (f - 55296 << 10) + (c - 56320), y++), f < 128 ? i[x++] = f : (f < 2048 ? i[x++] = 192 | f >>> 6 : (f < 65536 ? i[x++] = 224 | f >>> 12 : (i[x++] = 240 | f >>> 18, i[x++] = 128 | f >>> 12 & 63), i[x++] = 128 | f >>> 6 & 63), i[x++] = 128 | 63 & f);
          return i;
        }(a);
      }, u.utf8decode = function(a) {
        return o.nodebuffer ? s.transformTo("nodebuffer", a).toString("utf-8") : function(g) {
          var i, f, c, y, x = g.length, C = new Array(2 * x);
          for (i = f = 0; i < x; ) if ((c = g[i++]) < 128) C[f++] = c;
          else if (4 < (y = w[c])) C[f++] = 65533, i += y - 1;
          else {
            for (c &= y === 2 ? 31 : y === 3 ? 15 : 7; 1 < y && i < x; ) c = c << 6 | 63 & g[i++], y--;
            1 < y ? C[f++] = 65533 : c < 65536 ? C[f++] = c : (c -= 65536, C[f++] = 55296 | c >> 10 & 1023, C[f++] = 56320 | 1023 & c);
          }
          return C.length !== f && (C.subarray ? C = C.subarray(0, f) : C.length = f), s.applyFromCharCode(C);
        }(a = s.transformTo(o.uint8array ? "uint8array" : "array", a));
      }, s.inherits(_, h), _.prototype.processChunk = function(a) {
        var g = s.transformTo(o.uint8array ? "uint8array" : "array", a.data);
        if (this.leftOver && this.leftOver.length) {
          if (o.uint8array) {
            var i = g;
            (g = new Uint8Array(i.length + this.leftOver.length)).set(this.leftOver, 0), g.set(i, this.leftOver.length);
          } else g = this.leftOver.concat(g);
          this.leftOver = null;
        }
        var f = function(y, x) {
          var C;
          for ((x = x || y.length) > y.length && (x = y.length), C = x - 1; 0 <= C && (192 & y[C]) == 128; ) C--;
          return C < 0 || C === 0 ? x : C + w[y[C]] > x ? C : x;
        }(g), c = g;
        f !== g.length && (o.uint8array ? (c = g.subarray(0, f), this.leftOver = g.subarray(f, g.length)) : (c = g.slice(0, f), this.leftOver = g.slice(f, g.length))), this.push({ data: u.utf8decode(c), meta: a.meta });
      }, _.prototype.flush = function() {
        this.leftOver && this.leftOver.length && (this.push({ data: u.utf8decode(this.leftOver), meta: {} }), this.leftOver = null);
      }, u.Utf8DecodeWorker = _, s.inherits(v, h), v.prototype.processChunk = function(a) {
        this.push({ data: u.utf8encode(a.data), meta: a.meta });
      }, u.Utf8EncodeWorker = v;
    }, { "./nodejsUtils": 14, "./stream/GenericWorker": 28, "./support": 30, "./utils": 32 }], 32: [function(e, p, u) {
      var s = e("./support"), o = e("./base64"), n = e("./nodejsUtils"), h = e("./external");
      function w(i) {
        return i;
      }
      function b(i, f) {
        for (var c = 0; c < i.length; ++c) f[c] = 255 & i.charCodeAt(c);
        return f;
      }
      e("setimmediate"), u.newBlob = function(i, f) {
        u.checkSupport("blob");
        try {
          return new Blob([i], { type: f });
        } catch {
          try {
            var c = new (self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder)();
            return c.append(i), c.getBlob(f);
          } catch {
            throw new Error("Bug : can't construct the Blob.");
          }
        }
      };
      var _ = { stringifyByChunk: function(i, f, c) {
        var y = [], x = 0, C = i.length;
        if (C <= c) return String.fromCharCode.apply(null, i);
        for (; x < C; ) f === "array" || f === "nodebuffer" ? y.push(String.fromCharCode.apply(null, i.slice(x, Math.min(x + c, C)))) : y.push(String.fromCharCode.apply(null, i.subarray(x, Math.min(x + c, C)))), x += c;
        return y.join("");
      }, stringifyByChar: function(i) {
        for (var f = "", c = 0; c < i.length; c++) f += String.fromCharCode(i[c]);
        return f;
      }, applyCanBeUsed: { uint8array: function() {
        try {
          return s.uint8array && String.fromCharCode.apply(null, new Uint8Array(1)).length === 1;
        } catch {
          return !1;
        }
      }(), nodebuffer: function() {
        try {
          return s.nodebuffer && String.fromCharCode.apply(null, n.allocBuffer(1)).length === 1;
        } catch {
          return !1;
        }
      }() } };
      function v(i) {
        var f = 65536, c = u.getTypeOf(i), y = !0;
        if (c === "uint8array" ? y = _.applyCanBeUsed.uint8array : c === "nodebuffer" && (y = _.applyCanBeUsed.nodebuffer), y) for (; 1 < f; ) try {
          return _.stringifyByChunk(i, c, f);
        } catch {
          f = Math.floor(f / 2);
        }
        return _.stringifyByChar(i);
      }
      function a(i, f) {
        for (var c = 0; c < i.length; c++) f[c] = i[c];
        return f;
      }
      u.applyFromCharCode = v;
      var g = {};
      g.string = { string: w, array: function(i) {
        return b(i, new Array(i.length));
      }, arraybuffer: function(i) {
        return g.string.uint8array(i).buffer;
      }, uint8array: function(i) {
        return b(i, new Uint8Array(i.length));
      }, nodebuffer: function(i) {
        return b(i, n.allocBuffer(i.length));
      } }, g.array = { string: v, array: w, arraybuffer: function(i) {
        return new Uint8Array(i).buffer;
      }, uint8array: function(i) {
        return new Uint8Array(i);
      }, nodebuffer: function(i) {
        return n.newBufferFrom(i);
      } }, g.arraybuffer = { string: function(i) {
        return v(new Uint8Array(i));
      }, array: function(i) {
        return a(new Uint8Array(i), new Array(i.byteLength));
      }, arraybuffer: w, uint8array: function(i) {
        return new Uint8Array(i);
      }, nodebuffer: function(i) {
        return n.newBufferFrom(new Uint8Array(i));
      } }, g.uint8array = { string: v, array: function(i) {
        return a(i, new Array(i.length));
      }, arraybuffer: function(i) {
        return i.buffer;
      }, uint8array: w, nodebuffer: function(i) {
        return n.newBufferFrom(i);
      } }, g.nodebuffer = { string: v, array: function(i) {
        return a(i, new Array(i.length));
      }, arraybuffer: function(i) {
        return g.nodebuffer.uint8array(i).buffer;
      }, uint8array: function(i) {
        return a(i, new Uint8Array(i.length));
      }, nodebuffer: w }, u.transformTo = function(i, f) {
        if (f = f || "", !i) return f;
        u.checkSupport(i);
        var c = u.getTypeOf(f);
        return g[c][i](f);
      }, u.resolve = function(i) {
        for (var f = i.split("/"), c = [], y = 0; y < f.length; y++) {
          var x = f[y];
          x === "." || x === "" && y !== 0 && y !== f.length - 1 || (x === ".." ? c.pop() : c.push(x));
        }
        return c.join("/");
      }, u.getTypeOf = function(i) {
        return typeof i == "string" ? "string" : Object.prototype.toString.call(i) === "[object Array]" ? "array" : s.nodebuffer && n.isBuffer(i) ? "nodebuffer" : s.uint8array && i instanceof Uint8Array ? "uint8array" : s.arraybuffer && i instanceof ArrayBuffer ? "arraybuffer" : void 0;
      }, u.checkSupport = function(i) {
        if (!s[i.toLowerCase()]) throw new Error(i + " is not supported by this platform");
      }, u.MAX_VALUE_16BITS = 65535, u.MAX_VALUE_32BITS = -1, u.pretty = function(i) {
        var f, c, y = "";
        for (c = 0; c < (i || "").length; c++) y += "\\x" + ((f = i.charCodeAt(c)) < 16 ? "0" : "") + f.toString(16).toUpperCase();
        return y;
      }, u.delay = function(i, f, c) {
        setImmediate(function() {
          i.apply(c || null, f || []);
        });
      }, u.inherits = function(i, f) {
        function c() {
        }
        c.prototype = f.prototype, i.prototype = new c();
      }, u.extend = function() {
        var i, f, c = {};
        for (i = 0; i < arguments.length; i++) for (f in arguments[i]) Object.prototype.hasOwnProperty.call(arguments[i], f) && c[f] === void 0 && (c[f] = arguments[i][f]);
        return c;
      }, u.prepareContent = function(i, f, c, y, x) {
        return h.Promise.resolve(f).then(function(C) {
          return s.blob && (C instanceof Blob || ["[object File]", "[object Blob]"].indexOf(Object.prototype.toString.call(C)) !== -1) && typeof FileReader < "u" ? new h.Promise(function(E, D) {
            var P = new FileReader();
            P.onload = function(U) {
              E(U.target.result);
            }, P.onerror = function(U) {
              D(U.target.error);
            }, P.readAsArrayBuffer(C);
          }) : C;
        }).then(function(C) {
          var E = u.getTypeOf(C);
          return E ? (E === "arraybuffer" ? C = u.transformTo("uint8array", C) : E === "string" && (x ? C = o.decode(C) : c && y !== !0 && (C = function(D) {
            return b(D, s.uint8array ? new Uint8Array(D.length) : new Array(D.length));
          }(C))), C) : h.Promise.reject(new Error("Can't read the data of '" + i + "'. Is it in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?"));
        });
      };
    }, { "./base64": 1, "./external": 6, "./nodejsUtils": 14, "./support": 30, setimmediate: 54 }], 33: [function(e, p, u) {
      var s = e("./reader/readerFor"), o = e("./utils"), n = e("./signature"), h = e("./zipEntry"), w = e("./support");
      function b(_) {
        this.files = [], this.loadOptions = _;
      }
      b.prototype = { checkSignature: function(_) {
        if (!this.reader.readAndCheckSignature(_)) {
          this.reader.index -= 4;
          var v = this.reader.readString(4);
          throw new Error("Corrupted zip or bug: unexpected signature (" + o.pretty(v) + ", expected " + o.pretty(_) + ")");
        }
      }, isSignature: function(_, v) {
        var a = this.reader.index;
        this.reader.setIndex(_);
        var g = this.reader.readString(4) === v;
        return this.reader.setIndex(a), g;
      }, readBlockEndOfCentral: function() {
        this.diskNumber = this.reader.readInt(2), this.diskWithCentralDirStart = this.reader.readInt(2), this.centralDirRecordsOnThisDisk = this.reader.readInt(2), this.centralDirRecords = this.reader.readInt(2), this.centralDirSize = this.reader.readInt(4), this.centralDirOffset = this.reader.readInt(4), this.zipCommentLength = this.reader.readInt(2);
        var _ = this.reader.readData(this.zipCommentLength), v = w.uint8array ? "uint8array" : "array", a = o.transformTo(v, _);
        this.zipComment = this.loadOptions.decodeFileName(a);
      }, readBlockZip64EndOfCentral: function() {
        this.zip64EndOfCentralSize = this.reader.readInt(8), this.reader.skip(4), this.diskNumber = this.reader.readInt(4), this.diskWithCentralDirStart = this.reader.readInt(4), this.centralDirRecordsOnThisDisk = this.reader.readInt(8), this.centralDirRecords = this.reader.readInt(8), this.centralDirSize = this.reader.readInt(8), this.centralDirOffset = this.reader.readInt(8), this.zip64ExtensibleData = {};
        for (var _, v, a, g = this.zip64EndOfCentralSize - 44; 0 < g; ) _ = this.reader.readInt(2), v = this.reader.readInt(4), a = this.reader.readData(v), this.zip64ExtensibleData[_] = { id: _, length: v, value: a };
      }, readBlockZip64EndOfCentralLocator: function() {
        if (this.diskWithZip64CentralDirStart = this.reader.readInt(4), this.relativeOffsetEndOfZip64CentralDir = this.reader.readInt(8), this.disksCount = this.reader.readInt(4), 1 < this.disksCount) throw new Error("Multi-volumes zip are not supported");
      }, readLocalFiles: function() {
        var _, v;
        for (_ = 0; _ < this.files.length; _++) v = this.files[_], this.reader.setIndex(v.localHeaderOffset), this.checkSignature(n.LOCAL_FILE_HEADER), v.readLocalPart(this.reader), v.handleUTF8(), v.processAttributes();
      }, readCentralDir: function() {
        var _;
        for (this.reader.setIndex(this.centralDirOffset); this.reader.readAndCheckSignature(n.CENTRAL_FILE_HEADER); ) (_ = new h({ zip64: this.zip64 }, this.loadOptions)).readCentralPart(this.reader), this.files.push(_);
        if (this.centralDirRecords !== this.files.length && this.centralDirRecords !== 0 && this.files.length === 0) throw new Error("Corrupted zip or bug: expected " + this.centralDirRecords + " records in central dir, got " + this.files.length);
      }, readEndOfCentral: function() {
        var _ = this.reader.lastIndexOfSignature(n.CENTRAL_DIRECTORY_END);
        if (_ < 0) throw this.isSignature(0, n.LOCAL_FILE_HEADER) ? new Error("Corrupted zip: can't find end of central directory") : new Error("Can't find end of central directory : is this a zip file ? If it is, see https://stuk.github.io/jszip/documentation/howto/read_zip.html");
        this.reader.setIndex(_);
        var v = _;
        if (this.checkSignature(n.CENTRAL_DIRECTORY_END), this.readBlockEndOfCentral(), this.diskNumber === o.MAX_VALUE_16BITS || this.diskWithCentralDirStart === o.MAX_VALUE_16BITS || this.centralDirRecordsOnThisDisk === o.MAX_VALUE_16BITS || this.centralDirRecords === o.MAX_VALUE_16BITS || this.centralDirSize === o.MAX_VALUE_32BITS || this.centralDirOffset === o.MAX_VALUE_32BITS) {
          if (this.zip64 = !0, (_ = this.reader.lastIndexOfSignature(n.ZIP64_CENTRAL_DIRECTORY_LOCATOR)) < 0) throw new Error("Corrupted zip: can't find the ZIP64 end of central directory locator");
          if (this.reader.setIndex(_), this.checkSignature(n.ZIP64_CENTRAL_DIRECTORY_LOCATOR), this.readBlockZip64EndOfCentralLocator(), !this.isSignature(this.relativeOffsetEndOfZip64CentralDir, n.ZIP64_CENTRAL_DIRECTORY_END) && (this.relativeOffsetEndOfZip64CentralDir = this.reader.lastIndexOfSignature(n.ZIP64_CENTRAL_DIRECTORY_END), this.relativeOffsetEndOfZip64CentralDir < 0)) throw new Error("Corrupted zip: can't find the ZIP64 end of central directory");
          this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir), this.checkSignature(n.ZIP64_CENTRAL_DIRECTORY_END), this.readBlockZip64EndOfCentral();
        }
        var a = this.centralDirOffset + this.centralDirSize;
        this.zip64 && (a += 20, a += 12 + this.zip64EndOfCentralSize);
        var g = v - a;
        if (0 < g) this.isSignature(v, n.CENTRAL_FILE_HEADER) || (this.reader.zero = g);
        else if (g < 0) throw new Error("Corrupted zip: missing " + Math.abs(g) + " bytes.");
      }, prepareReader: function(_) {
        this.reader = s(_);
      }, load: function(_) {
        this.prepareReader(_), this.readEndOfCentral(), this.readCentralDir(), this.readLocalFiles();
      } }, p.exports = b;
    }, { "./reader/readerFor": 22, "./signature": 23, "./support": 30, "./utils": 32, "./zipEntry": 34 }], 34: [function(e, p, u) {
      var s = e("./reader/readerFor"), o = e("./utils"), n = e("./compressedObject"), h = e("./crc32"), w = e("./utf8"), b = e("./compressions"), _ = e("./support");
      function v(a, g) {
        this.options = a, this.loadOptions = g;
      }
      v.prototype = { isEncrypted: function() {
        return (1 & this.bitFlag) == 1;
      }, useUTF8: function() {
        return (2048 & this.bitFlag) == 2048;
      }, readLocalPart: function(a) {
        var g, i;
        if (a.skip(22), this.fileNameLength = a.readInt(2), i = a.readInt(2), this.fileName = a.readData(this.fileNameLength), a.skip(i), this.compressedSize === -1 || this.uncompressedSize === -1) throw new Error("Bug or corrupted zip : didn't get enough information from the central directory (compressedSize === -1 || uncompressedSize === -1)");
        if ((g = function(f) {
          for (var c in b) if (Object.prototype.hasOwnProperty.call(b, c) && b[c].magic === f) return b[c];
          return null;
        }(this.compressionMethod)) === null) throw new Error("Corrupted zip : compression " + o.pretty(this.compressionMethod) + " unknown (inner file : " + o.transformTo("string", this.fileName) + ")");
        this.decompressed = new n(this.compressedSize, this.uncompressedSize, this.crc32, g, a.readData(this.compressedSize));
      }, readCentralPart: function(a) {
        this.versionMadeBy = a.readInt(2), a.skip(2), this.bitFlag = a.readInt(2), this.compressionMethod = a.readString(2), this.date = a.readDate(), this.crc32 = a.readInt(4), this.compressedSize = a.readInt(4), this.uncompressedSize = a.readInt(4);
        var g = a.readInt(2);
        if (this.extraFieldsLength = a.readInt(2), this.fileCommentLength = a.readInt(2), this.diskNumberStart = a.readInt(2), this.internalFileAttributes = a.readInt(2), this.externalFileAttributes = a.readInt(4), this.localHeaderOffset = a.readInt(4), this.isEncrypted()) throw new Error("Encrypted zip are not supported");
        a.skip(g), this.readExtraFields(a), this.parseZIP64ExtraField(a), this.fileComment = a.readData(this.fileCommentLength);
      }, processAttributes: function() {
        this.unixPermissions = null, this.dosPermissions = null;
        var a = this.versionMadeBy >> 8;
        this.dir = !!(16 & this.externalFileAttributes), a == 0 && (this.dosPermissions = 63 & this.externalFileAttributes), a == 3 && (this.unixPermissions = this.externalFileAttributes >> 16 & 65535), this.dir || this.fileNameStr.slice(-1) !== "/" || (this.dir = !0);
      }, parseZIP64ExtraField: function() {
        if (this.extraFields[1]) {
          var a = s(this.extraFields[1].value);
          this.uncompressedSize === o.MAX_VALUE_32BITS && (this.uncompressedSize = a.readInt(8)), this.compressedSize === o.MAX_VALUE_32BITS && (this.compressedSize = a.readInt(8)), this.localHeaderOffset === o.MAX_VALUE_32BITS && (this.localHeaderOffset = a.readInt(8)), this.diskNumberStart === o.MAX_VALUE_32BITS && (this.diskNumberStart = a.readInt(4));
        }
      }, readExtraFields: function(a) {
        var g, i, f, c = a.index + this.extraFieldsLength;
        for (this.extraFields || (this.extraFields = {}); a.index + 4 < c; ) g = a.readInt(2), i = a.readInt(2), f = a.readData(i), this.extraFields[g] = { id: g, length: i, value: f };
        a.setIndex(c);
      }, handleUTF8: function() {
        var a = _.uint8array ? "uint8array" : "array";
        if (this.useUTF8()) this.fileNameStr = w.utf8decode(this.fileName), this.fileCommentStr = w.utf8decode(this.fileComment);
        else {
          var g = this.findExtraFieldUnicodePath();
          if (g !== null) this.fileNameStr = g;
          else {
            var i = o.transformTo(a, this.fileName);
            this.fileNameStr = this.loadOptions.decodeFileName(i);
          }
          var f = this.findExtraFieldUnicodeComment();
          if (f !== null) this.fileCommentStr = f;
          else {
            var c = o.transformTo(a, this.fileComment);
            this.fileCommentStr = this.loadOptions.decodeFileName(c);
          }
        }
      }, findExtraFieldUnicodePath: function() {
        var a = this.extraFields[28789];
        if (a) {
          var g = s(a.value);
          return g.readInt(1) !== 1 || h(this.fileName) !== g.readInt(4) ? null : w.utf8decode(g.readData(a.length - 5));
        }
        return null;
      }, findExtraFieldUnicodeComment: function() {
        var a = this.extraFields[25461];
        if (a) {
          var g = s(a.value);
          return g.readInt(1) !== 1 || h(this.fileComment) !== g.readInt(4) ? null : w.utf8decode(g.readData(a.length - 5));
        }
        return null;
      } }, p.exports = v;
    }, { "./compressedObject": 2, "./compressions": 3, "./crc32": 4, "./reader/readerFor": 22, "./support": 30, "./utf8": 31, "./utils": 32 }], 35: [function(e, p, u) {
      function s(g, i, f) {
        this.name = g, this.dir = f.dir, this.date = f.date, this.comment = f.comment, this.unixPermissions = f.unixPermissions, this.dosPermissions = f.dosPermissions, this._data = i, this._dataBinary = f.binary, this.options = { compression: f.compression, compressionOptions: f.compressionOptions };
      }
      var o = e("./stream/StreamHelper"), n = e("./stream/DataWorker"), h = e("./utf8"), w = e("./compressedObject"), b = e("./stream/GenericWorker");
      s.prototype = { internalStream: function(g) {
        var i = null, f = "string";
        try {
          if (!g) throw new Error("No output type specified.");
          var c = (f = g.toLowerCase()) === "string" || f === "text";
          f !== "binarystring" && f !== "text" || (f = "string"), i = this._decompressWorker();
          var y = !this._dataBinary;
          y && !c && (i = i.pipe(new h.Utf8EncodeWorker())), !y && c && (i = i.pipe(new h.Utf8DecodeWorker()));
        } catch (x) {
          (i = new b("error")).error(x);
        }
        return new o(i, f, "");
      }, async: function(g, i) {
        return this.internalStream(g).accumulate(i);
      }, nodeStream: function(g, i) {
        return this.internalStream(g || "nodebuffer").toNodejsStream(i);
      }, _compressWorker: function(g, i) {
        if (this._data instanceof w && this._data.compression.magic === g.magic) return this._data.getCompressedWorker();
        var f = this._decompressWorker();
        return this._dataBinary || (f = f.pipe(new h.Utf8EncodeWorker())), w.createWorkerFrom(f, g, i);
      }, _decompressWorker: function() {
        return this._data instanceof w ? this._data.getContentWorker() : this._data instanceof b ? this._data : new n(this._data);
      } };
      for (var _ = ["asText", "asBinary", "asNodeBuffer", "asUint8Array", "asArrayBuffer"], v = function() {
        throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
      }, a = 0; a < _.length; a++) s.prototype[_[a]] = v;
      p.exports = s;
    }, { "./compressedObject": 2, "./stream/DataWorker": 27, "./stream/GenericWorker": 28, "./stream/StreamHelper": 29, "./utf8": 31 }], 36: [function(e, p, u) {
      (function(s) {
        var o, n, h = s.MutationObserver || s.WebKitMutationObserver;
        if (h) {
          var w = 0, b = new h(g), _ = s.document.createTextNode("");
          b.observe(_, { characterData: !0 }), o = function() {
            _.data = w = ++w % 2;
          };
        } else if (s.setImmediate || s.MessageChannel === void 0) o = "document" in s && "onreadystatechange" in s.document.createElement("script") ? function() {
          var i = s.document.createElement("script");
          i.onreadystatechange = function() {
            g(), i.onreadystatechange = null, i.parentNode.removeChild(i), i = null;
          }, s.document.documentElement.appendChild(i);
        } : function() {
          setTimeout(g, 0);
        };
        else {
          var v = new s.MessageChannel();
          v.port1.onmessage = g, o = function() {
            v.port2.postMessage(0);
          };
        }
        var a = [];
        function g() {
          var i, f;
          n = !0;
          for (var c = a.length; c; ) {
            for (f = a, a = [], i = -1; ++i < c; ) f[i]();
            c = a.length;
          }
          n = !1;
        }
        p.exports = function(i) {
          a.push(i) !== 1 || n || o();
        };
      }).call(this, typeof Ot < "u" ? Ot : typeof self < "u" ? self : typeof window < "u" ? window : {});
    }, {}], 37: [function(e, p, u) {
      var s = e("immediate");
      function o() {
      }
      var n = {}, h = ["REJECTED"], w = ["FULFILLED"], b = ["PENDING"];
      function _(c) {
        if (typeof c != "function") throw new TypeError("resolver must be a function");
        this.state = b, this.queue = [], this.outcome = void 0, c !== o && i(this, c);
      }
      function v(c, y, x) {
        this.promise = c, typeof y == "function" && (this.onFulfilled = y, this.callFulfilled = this.otherCallFulfilled), typeof x == "function" && (this.onRejected = x, this.callRejected = this.otherCallRejected);
      }
      function a(c, y, x) {
        s(function() {
          var C;
          try {
            C = y(x);
          } catch (E) {
            return n.reject(c, E);
          }
          C === c ? n.reject(c, new TypeError("Cannot resolve promise with itself")) : n.resolve(c, C);
        });
      }
      function g(c) {
        var y = c && c.then;
        if (c && (typeof c == "object" || typeof c == "function") && typeof y == "function") return function() {
          y.apply(c, arguments);
        };
      }
      function i(c, y) {
        var x = !1;
        function C(P) {
          x || (x = !0, n.reject(c, P));
        }
        function E(P) {
          x || (x = !0, n.resolve(c, P));
        }
        var D = f(function() {
          y(E, C);
        });
        D.status === "error" && C(D.value);
      }
      function f(c, y) {
        var x = {};
        try {
          x.value = c(y), x.status = "success";
        } catch (C) {
          x.status = "error", x.value = C;
        }
        return x;
      }
      (p.exports = _).prototype.finally = function(c) {
        if (typeof c != "function") return this;
        var y = this.constructor;
        return this.then(function(x) {
          return y.resolve(c()).then(function() {
            return x;
          });
        }, function(x) {
          return y.resolve(c()).then(function() {
            throw x;
          });
        });
      }, _.prototype.catch = function(c) {
        return this.then(null, c);
      }, _.prototype.then = function(c, y) {
        if (typeof c != "function" && this.state === w || typeof y != "function" && this.state === h) return this;
        var x = new this.constructor(o);
        return this.state !== b ? a(x, this.state === w ? c : y, this.outcome) : this.queue.push(new v(x, c, y)), x;
      }, v.prototype.callFulfilled = function(c) {
        n.resolve(this.promise, c);
      }, v.prototype.otherCallFulfilled = function(c) {
        a(this.promise, this.onFulfilled, c);
      }, v.prototype.callRejected = function(c) {
        n.reject(this.promise, c);
      }, v.prototype.otherCallRejected = function(c) {
        a(this.promise, this.onRejected, c);
      }, n.resolve = function(c, y) {
        var x = f(g, y);
        if (x.status === "error") return n.reject(c, x.value);
        var C = x.value;
        if (C) i(c, C);
        else {
          c.state = w, c.outcome = y;
          for (var E = -1, D = c.queue.length; ++E < D; ) c.queue[E].callFulfilled(y);
        }
        return c;
      }, n.reject = function(c, y) {
        c.state = h, c.outcome = y;
        for (var x = -1, C = c.queue.length; ++x < C; ) c.queue[x].callRejected(y);
        return c;
      }, _.resolve = function(c) {
        return c instanceof this ? c : n.resolve(new this(o), c);
      }, _.reject = function(c) {
        var y = new this(o);
        return n.reject(y, c);
      }, _.all = function(c) {
        var y = this;
        if (Object.prototype.toString.call(c) !== "[object Array]") return this.reject(new TypeError("must be an array"));
        var x = c.length, C = !1;
        if (!x) return this.resolve([]);
        for (var E = new Array(x), D = 0, P = -1, U = new this(o); ++P < x; ) T(c[P], P);
        return U;
        function T(M, X) {
          y.resolve(M).then(function(k) {
            E[X] = k, ++D !== x || C || (C = !0, n.resolve(U, E));
          }, function(k) {
            C || (C = !0, n.reject(U, k));
          });
        }
      }, _.race = function(c) {
        var y = this;
        if (Object.prototype.toString.call(c) !== "[object Array]") return this.reject(new TypeError("must be an array"));
        var x = c.length, C = !1;
        if (!x) return this.resolve([]);
        for (var E = -1, D = new this(o); ++E < x; ) P = c[E], y.resolve(P).then(function(U) {
          C || (C = !0, n.resolve(D, U));
        }, function(U) {
          C || (C = !0, n.reject(D, U));
        });
        var P;
        return D;
      };
    }, { immediate: 36 }], 38: [function(e, p, u) {
      var s = {};
      (0, e("./lib/utils/common").assign)(s, e("./lib/deflate"), e("./lib/inflate"), e("./lib/zlib/constants")), p.exports = s;
    }, { "./lib/deflate": 39, "./lib/inflate": 40, "./lib/utils/common": 41, "./lib/zlib/constants": 44 }], 39: [function(e, p, u) {
      var s = e("./zlib/deflate"), o = e("./utils/common"), n = e("./utils/strings"), h = e("./zlib/messages"), w = e("./zlib/zstream"), b = Object.prototype.toString, _ = 0, v = -1, a = 0, g = 8;
      function i(c) {
        if (!(this instanceof i)) return new i(c);
        this.options = o.assign({ level: v, method: g, chunkSize: 16384, windowBits: 15, memLevel: 8, strategy: a, to: "" }, c || {});
        var y = this.options;
        y.raw && 0 < y.windowBits ? y.windowBits = -y.windowBits : y.gzip && 0 < y.windowBits && y.windowBits < 16 && (y.windowBits += 16), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new w(), this.strm.avail_out = 0;
        var x = s.deflateInit2(this.strm, y.level, y.method, y.windowBits, y.memLevel, y.strategy);
        if (x !== _) throw new Error(h[x]);
        if (y.header && s.deflateSetHeader(this.strm, y.header), y.dictionary) {
          var C;
          if (C = typeof y.dictionary == "string" ? n.string2buf(y.dictionary) : b.call(y.dictionary) === "[object ArrayBuffer]" ? new Uint8Array(y.dictionary) : y.dictionary, (x = s.deflateSetDictionary(this.strm, C)) !== _) throw new Error(h[x]);
          this._dict_set = !0;
        }
      }
      function f(c, y) {
        var x = new i(y);
        if (x.push(c, !0), x.err) throw x.msg || h[x.err];
        return x.result;
      }
      i.prototype.push = function(c, y) {
        var x, C, E = this.strm, D = this.options.chunkSize;
        if (this.ended) return !1;
        C = y === ~~y ? y : y === !0 ? 4 : 0, typeof c == "string" ? E.input = n.string2buf(c) : b.call(c) === "[object ArrayBuffer]" ? E.input = new Uint8Array(c) : E.input = c, E.next_in = 0, E.avail_in = E.input.length;
        do {
          if (E.avail_out === 0 && (E.output = new o.Buf8(D), E.next_out = 0, E.avail_out = D), (x = s.deflate(E, C)) !== 1 && x !== _) return this.onEnd(x), !(this.ended = !0);
          E.avail_out !== 0 && (E.avail_in !== 0 || C !== 4 && C !== 2) || (this.options.to === "string" ? this.onData(n.buf2binstring(o.shrinkBuf(E.output, E.next_out))) : this.onData(o.shrinkBuf(E.output, E.next_out)));
        } while ((0 < E.avail_in || E.avail_out === 0) && x !== 1);
        return C === 4 ? (x = s.deflateEnd(this.strm), this.onEnd(x), this.ended = !0, x === _) : C !== 2 || (this.onEnd(_), !(E.avail_out = 0));
      }, i.prototype.onData = function(c) {
        this.chunks.push(c);
      }, i.prototype.onEnd = function(c) {
        c === _ && (this.options.to === "string" ? this.result = this.chunks.join("") : this.result = o.flattenChunks(this.chunks)), this.chunks = [], this.err = c, this.msg = this.strm.msg;
      }, u.Deflate = i, u.deflate = f, u.deflateRaw = function(c, y) {
        return (y = y || {}).raw = !0, f(c, y);
      }, u.gzip = function(c, y) {
        return (y = y || {}).gzip = !0, f(c, y);
      };
    }, { "./utils/common": 41, "./utils/strings": 42, "./zlib/deflate": 46, "./zlib/messages": 51, "./zlib/zstream": 53 }], 40: [function(e, p, u) {
      var s = e("./zlib/inflate"), o = e("./utils/common"), n = e("./utils/strings"), h = e("./zlib/constants"), w = e("./zlib/messages"), b = e("./zlib/zstream"), _ = e("./zlib/gzheader"), v = Object.prototype.toString;
      function a(i) {
        if (!(this instanceof a)) return new a(i);
        this.options = o.assign({ chunkSize: 16384, windowBits: 0, to: "" }, i || {});
        var f = this.options;
        f.raw && 0 <= f.windowBits && f.windowBits < 16 && (f.windowBits = -f.windowBits, f.windowBits === 0 && (f.windowBits = -15)), !(0 <= f.windowBits && f.windowBits < 16) || i && i.windowBits || (f.windowBits += 32), 15 < f.windowBits && f.windowBits < 48 && !(15 & f.windowBits) && (f.windowBits |= 15), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new b(), this.strm.avail_out = 0;
        var c = s.inflateInit2(this.strm, f.windowBits);
        if (c !== h.Z_OK) throw new Error(w[c]);
        this.header = new _(), s.inflateGetHeader(this.strm, this.header);
      }
      function g(i, f) {
        var c = new a(f);
        if (c.push(i, !0), c.err) throw c.msg || w[c.err];
        return c.result;
      }
      a.prototype.push = function(i, f) {
        var c, y, x, C, E, D, P = this.strm, U = this.options.chunkSize, T = this.options.dictionary, M = !1;
        if (this.ended) return !1;
        y = f === ~~f ? f : f === !0 ? h.Z_FINISH : h.Z_NO_FLUSH, typeof i == "string" ? P.input = n.binstring2buf(i) : v.call(i) === "[object ArrayBuffer]" ? P.input = new Uint8Array(i) : P.input = i, P.next_in = 0, P.avail_in = P.input.length;
        do {
          if (P.avail_out === 0 && (P.output = new o.Buf8(U), P.next_out = 0, P.avail_out = U), (c = s.inflate(P, h.Z_NO_FLUSH)) === h.Z_NEED_DICT && T && (D = typeof T == "string" ? n.string2buf(T) : v.call(T) === "[object ArrayBuffer]" ? new Uint8Array(T) : T, c = s.inflateSetDictionary(this.strm, D)), c === h.Z_BUF_ERROR && M === !0 && (c = h.Z_OK, M = !1), c !== h.Z_STREAM_END && c !== h.Z_OK) return this.onEnd(c), !(this.ended = !0);
          P.next_out && (P.avail_out !== 0 && c !== h.Z_STREAM_END && (P.avail_in !== 0 || y !== h.Z_FINISH && y !== h.Z_SYNC_FLUSH) || (this.options.to === "string" ? (x = n.utf8border(P.output, P.next_out), C = P.next_out - x, E = n.buf2string(P.output, x), P.next_out = C, P.avail_out = U - C, C && o.arraySet(P.output, P.output, x, C, 0), this.onData(E)) : this.onData(o.shrinkBuf(P.output, P.next_out)))), P.avail_in === 0 && P.avail_out === 0 && (M = !0);
        } while ((0 < P.avail_in || P.avail_out === 0) && c !== h.Z_STREAM_END);
        return c === h.Z_STREAM_END && (y = h.Z_FINISH), y === h.Z_FINISH ? (c = s.inflateEnd(this.strm), this.onEnd(c), this.ended = !0, c === h.Z_OK) : y !== h.Z_SYNC_FLUSH || (this.onEnd(h.Z_OK), !(P.avail_out = 0));
      }, a.prototype.onData = function(i) {
        this.chunks.push(i);
      }, a.prototype.onEnd = function(i) {
        i === h.Z_OK && (this.options.to === "string" ? this.result = this.chunks.join("") : this.result = o.flattenChunks(this.chunks)), this.chunks = [], this.err = i, this.msg = this.strm.msg;
      }, u.Inflate = a, u.inflate = g, u.inflateRaw = function(i, f) {
        return (f = f || {}).raw = !0, g(i, f);
      }, u.ungzip = g;
    }, { "./utils/common": 41, "./utils/strings": 42, "./zlib/constants": 44, "./zlib/gzheader": 47, "./zlib/inflate": 49, "./zlib/messages": 51, "./zlib/zstream": 53 }], 41: [function(e, p, u) {
      var s = typeof Uint8Array < "u" && typeof Uint16Array < "u" && typeof Int32Array < "u";
      u.assign = function(h) {
        for (var w = Array.prototype.slice.call(arguments, 1); w.length; ) {
          var b = w.shift();
          if (b) {
            if (typeof b != "object") throw new TypeError(b + "must be non-object");
            for (var _ in b) b.hasOwnProperty(_) && (h[_] = b[_]);
          }
        }
        return h;
      }, u.shrinkBuf = function(h, w) {
        return h.length === w ? h : h.subarray ? h.subarray(0, w) : (h.length = w, h);
      };
      var o = { arraySet: function(h, w, b, _, v) {
        if (w.subarray && h.subarray) h.set(w.subarray(b, b + _), v);
        else for (var a = 0; a < _; a++) h[v + a] = w[b + a];
      }, flattenChunks: function(h) {
        var w, b, _, v, a, g;
        for (w = _ = 0, b = h.length; w < b; w++) _ += h[w].length;
        for (g = new Uint8Array(_), w = v = 0, b = h.length; w < b; w++) a = h[w], g.set(a, v), v += a.length;
        return g;
      } }, n = { arraySet: function(h, w, b, _, v) {
        for (var a = 0; a < _; a++) h[v + a] = w[b + a];
      }, flattenChunks: function(h) {
        return [].concat.apply([], h);
      } };
      u.setTyped = function(h) {
        h ? (u.Buf8 = Uint8Array, u.Buf16 = Uint16Array, u.Buf32 = Int32Array, u.assign(u, o)) : (u.Buf8 = Array, u.Buf16 = Array, u.Buf32 = Array, u.assign(u, n));
      }, u.setTyped(s);
    }, {}], 42: [function(e, p, u) {
      var s = e("./common"), o = !0, n = !0;
      try {
        String.fromCharCode.apply(null, [0]);
      } catch {
        o = !1;
      }
      try {
        String.fromCharCode.apply(null, new Uint8Array(1));
      } catch {
        n = !1;
      }
      for (var h = new s.Buf8(256), w = 0; w < 256; w++) h[w] = 252 <= w ? 6 : 248 <= w ? 5 : 240 <= w ? 4 : 224 <= w ? 3 : 192 <= w ? 2 : 1;
      function b(_, v) {
        if (v < 65537 && (_.subarray && n || !_.subarray && o)) return String.fromCharCode.apply(null, s.shrinkBuf(_, v));
        for (var a = "", g = 0; g < v; g++) a += String.fromCharCode(_[g]);
        return a;
      }
      h[254] = h[254] = 1, u.string2buf = function(_) {
        var v, a, g, i, f, c = _.length, y = 0;
        for (i = 0; i < c; i++) (64512 & (a = _.charCodeAt(i))) == 55296 && i + 1 < c && (64512 & (g = _.charCodeAt(i + 1))) == 56320 && (a = 65536 + (a - 55296 << 10) + (g - 56320), i++), y += a < 128 ? 1 : a < 2048 ? 2 : a < 65536 ? 3 : 4;
        for (v = new s.Buf8(y), i = f = 0; f < y; i++) (64512 & (a = _.charCodeAt(i))) == 55296 && i + 1 < c && (64512 & (g = _.charCodeAt(i + 1))) == 56320 && (a = 65536 + (a - 55296 << 10) + (g - 56320), i++), a < 128 ? v[f++] = a : (a < 2048 ? v[f++] = 192 | a >>> 6 : (a < 65536 ? v[f++] = 224 | a >>> 12 : (v[f++] = 240 | a >>> 18, v[f++] = 128 | a >>> 12 & 63), v[f++] = 128 | a >>> 6 & 63), v[f++] = 128 | 63 & a);
        return v;
      }, u.buf2binstring = function(_) {
        return b(_, _.length);
      }, u.binstring2buf = function(_) {
        for (var v = new s.Buf8(_.length), a = 0, g = v.length; a < g; a++) v[a] = _.charCodeAt(a);
        return v;
      }, u.buf2string = function(_, v) {
        var a, g, i, f, c = v || _.length, y = new Array(2 * c);
        for (a = g = 0; a < c; ) if ((i = _[a++]) < 128) y[g++] = i;
        else if (4 < (f = h[i])) y[g++] = 65533, a += f - 1;
        else {
          for (i &= f === 2 ? 31 : f === 3 ? 15 : 7; 1 < f && a < c; ) i = i << 6 | 63 & _[a++], f--;
          1 < f ? y[g++] = 65533 : i < 65536 ? y[g++] = i : (i -= 65536, y[g++] = 55296 | i >> 10 & 1023, y[g++] = 56320 | 1023 & i);
        }
        return b(y, g);
      }, u.utf8border = function(_, v) {
        var a;
        for ((v = v || _.length) > _.length && (v = _.length), a = v - 1; 0 <= a && (192 & _[a]) == 128; ) a--;
        return a < 0 || a === 0 ? v : a + h[_[a]] > v ? a : v;
      };
    }, { "./common": 41 }], 43: [function(e, p, u) {
      p.exports = function(s, o, n, h) {
        for (var w = 65535 & s | 0, b = s >>> 16 & 65535 | 0, _ = 0; n !== 0; ) {
          for (n -= _ = 2e3 < n ? 2e3 : n; b = b + (w = w + o[h++] | 0) | 0, --_; ) ;
          w %= 65521, b %= 65521;
        }
        return w | b << 16 | 0;
      };
    }, {}], 44: [function(e, p, u) {
      p.exports = { Z_NO_FLUSH: 0, Z_PARTIAL_FLUSH: 1, Z_SYNC_FLUSH: 2, Z_FULL_FLUSH: 3, Z_FINISH: 4, Z_BLOCK: 5, Z_TREES: 6, Z_OK: 0, Z_STREAM_END: 1, Z_NEED_DICT: 2, Z_ERRNO: -1, Z_STREAM_ERROR: -2, Z_DATA_ERROR: -3, Z_BUF_ERROR: -5, Z_NO_COMPRESSION: 0, Z_BEST_SPEED: 1, Z_BEST_COMPRESSION: 9, Z_DEFAULT_COMPRESSION: -1, Z_FILTERED: 1, Z_HUFFMAN_ONLY: 2, Z_RLE: 3, Z_FIXED: 4, Z_DEFAULT_STRATEGY: 0, Z_BINARY: 0, Z_TEXT: 1, Z_UNKNOWN: 2, Z_DEFLATED: 8 };
    }, {}], 45: [function(e, p, u) {
      var s = function() {
        for (var o, n = [], h = 0; h < 256; h++) {
          o = h;
          for (var w = 0; w < 8; w++) o = 1 & o ? 3988292384 ^ o >>> 1 : o >>> 1;
          n[h] = o;
        }
        return n;
      }();
      p.exports = function(o, n, h, w) {
        var b = s, _ = w + h;
        o ^= -1;
        for (var v = w; v < _; v++) o = o >>> 8 ^ b[255 & (o ^ n[v])];
        return -1 ^ o;
      };
    }, {}], 46: [function(e, p, u) {
      var s, o = e("../utils/common"), n = e("./trees"), h = e("./adler32"), w = e("./crc32"), b = e("./messages"), _ = 0, v = 4, a = 0, g = -2, i = -1, f = 4, c = 2, y = 8, x = 9, C = 286, E = 30, D = 19, P = 2 * C + 1, U = 15, T = 3, M = 258, X = M + T + 1, k = 42, R = 113, r = 1, B = 2, tt = 3, W = 4;
      function et(t, F) {
        return t.msg = b[F], F;
      }
      function j(t) {
        return (t << 1) - (4 < t ? 9 : 0);
      }
      function Q(t) {
        for (var F = t.length; 0 <= --F; ) t[F] = 0;
      }
      function z(t) {
        var F = t.state, O = F.pending;
        O > t.avail_out && (O = t.avail_out), O !== 0 && (o.arraySet(t.output, F.pending_buf, F.pending_out, O, t.next_out), t.next_out += O, F.pending_out += O, t.total_out += O, t.avail_out -= O, F.pending -= O, F.pending === 0 && (F.pending_out = 0));
      }
      function I(t, F) {
        n._tr_flush_block(t, 0 <= t.block_start ? t.block_start : -1, t.strstart - t.block_start, F), t.block_start = t.strstart, z(t.strm);
      }
      function J(t, F) {
        t.pending_buf[t.pending++] = F;
      }
      function V(t, F) {
        t.pending_buf[t.pending++] = F >>> 8 & 255, t.pending_buf[t.pending++] = 255 & F;
      }
      function q(t, F) {
        var O, m, d = t.max_chain_length, S = t.strstart, L = t.prev_length, N = t.nice_match, A = t.strstart > t.w_size - X ? t.strstart - (t.w_size - X) : 0, Z = t.window, K = t.w_mask, G = t.prev, Y = t.strstart + M, at = Z[S + L - 1], nt = Z[S + L];
        t.prev_length >= t.good_match && (d >>= 2), N > t.lookahead && (N = t.lookahead);
        do
          if (Z[(O = F) + L] === nt && Z[O + L - 1] === at && Z[O] === Z[S] && Z[++O] === Z[S + 1]) {
            S += 2, O++;
            do
              ;
            while (Z[++S] === Z[++O] && Z[++S] === Z[++O] && Z[++S] === Z[++O] && Z[++S] === Z[++O] && Z[++S] === Z[++O] && Z[++S] === Z[++O] && Z[++S] === Z[++O] && Z[++S] === Z[++O] && S < Y);
            if (m = M - (Y - S), S = Y - M, L < m) {
              if (t.match_start = F, N <= (L = m)) break;
              at = Z[S + L - 1], nt = Z[S + L];
            }
          }
        while ((F = G[F & K]) > A && --d != 0);
        return L <= t.lookahead ? L : t.lookahead;
      }
      function ot(t) {
        var F, O, m, d, S, L, N, A, Z, K, G = t.w_size;
        do {
          if (d = t.window_size - t.lookahead - t.strstart, t.strstart >= G + (G - X)) {
            for (o.arraySet(t.window, t.window, G, G, 0), t.match_start -= G, t.strstart -= G, t.block_start -= G, F = O = t.hash_size; m = t.head[--F], t.head[F] = G <= m ? m - G : 0, --O; ) ;
            for (F = O = G; m = t.prev[--F], t.prev[F] = G <= m ? m - G : 0, --O; ) ;
            d += G;
          }
          if (t.strm.avail_in === 0) break;
          if (L = t.strm, N = t.window, A = t.strstart + t.lookahead, Z = d, K = void 0, K = L.avail_in, Z < K && (K = Z), O = K === 0 ? 0 : (L.avail_in -= K, o.arraySet(N, L.input, L.next_in, K, A), L.state.wrap === 1 ? L.adler = h(L.adler, N, K, A) : L.state.wrap === 2 && (L.adler = w(L.adler, N, K, A)), L.next_in += K, L.total_in += K, K), t.lookahead += O, t.lookahead + t.insert >= T) for (S = t.strstart - t.insert, t.ins_h = t.window[S], t.ins_h = (t.ins_h << t.hash_shift ^ t.window[S + 1]) & t.hash_mask; t.insert && (t.ins_h = (t.ins_h << t.hash_shift ^ t.window[S + T - 1]) & t.hash_mask, t.prev[S & t.w_mask] = t.head[t.ins_h], t.head[t.ins_h] = S, S++, t.insert--, !(t.lookahead + t.insert < T)); ) ;
        } while (t.lookahead < X && t.strm.avail_in !== 0);
      }
      function dt(t, F) {
        for (var O, m; ; ) {
          if (t.lookahead < X) {
            if (ot(t), t.lookahead < X && F === _) return r;
            if (t.lookahead === 0) break;
          }
          if (O = 0, t.lookahead >= T && (t.ins_h = (t.ins_h << t.hash_shift ^ t.window[t.strstart + T - 1]) & t.hash_mask, O = t.prev[t.strstart & t.w_mask] = t.head[t.ins_h], t.head[t.ins_h] = t.strstart), O !== 0 && t.strstart - O <= t.w_size - X && (t.match_length = q(t, O)), t.match_length >= T) if (m = n._tr_tally(t, t.strstart - t.match_start, t.match_length - T), t.lookahead -= t.match_length, t.match_length <= t.max_lazy_match && t.lookahead >= T) {
            for (t.match_length--; t.strstart++, t.ins_h = (t.ins_h << t.hash_shift ^ t.window[t.strstart + T - 1]) & t.hash_mask, O = t.prev[t.strstart & t.w_mask] = t.head[t.ins_h], t.head[t.ins_h] = t.strstart, --t.match_length != 0; ) ;
            t.strstart++;
          } else t.strstart += t.match_length, t.match_length = 0, t.ins_h = t.window[t.strstart], t.ins_h = (t.ins_h << t.hash_shift ^ t.window[t.strstart + 1]) & t.hash_mask;
          else m = n._tr_tally(t, 0, t.window[t.strstart]), t.lookahead--, t.strstart++;
          if (m && (I(t, !1), t.strm.avail_out === 0)) return r;
        }
        return t.insert = t.strstart < T - 1 ? t.strstart : T - 1, F === v ? (I(t, !0), t.strm.avail_out === 0 ? tt : W) : t.last_lit && (I(t, !1), t.strm.avail_out === 0) ? r : B;
      }
      function rt(t, F) {
        for (var O, m, d; ; ) {
          if (t.lookahead < X) {
            if (ot(t), t.lookahead < X && F === _) return r;
            if (t.lookahead === 0) break;
          }
          if (O = 0, t.lookahead >= T && (t.ins_h = (t.ins_h << t.hash_shift ^ t.window[t.strstart + T - 1]) & t.hash_mask, O = t.prev[t.strstart & t.w_mask] = t.head[t.ins_h], t.head[t.ins_h] = t.strstart), t.prev_length = t.match_length, t.prev_match = t.match_start, t.match_length = T - 1, O !== 0 && t.prev_length < t.max_lazy_match && t.strstart - O <= t.w_size - X && (t.match_length = q(t, O), t.match_length <= 5 && (t.strategy === 1 || t.match_length === T && 4096 < t.strstart - t.match_start) && (t.match_length = T - 1)), t.prev_length >= T && t.match_length <= t.prev_length) {
            for (d = t.strstart + t.lookahead - T, m = n._tr_tally(t, t.strstart - 1 - t.prev_match, t.prev_length - T), t.lookahead -= t.prev_length - 1, t.prev_length -= 2; ++t.strstart <= d && (t.ins_h = (t.ins_h << t.hash_shift ^ t.window[t.strstart + T - 1]) & t.hash_mask, O = t.prev[t.strstart & t.w_mask] = t.head[t.ins_h], t.head[t.ins_h] = t.strstart), --t.prev_length != 0; ) ;
            if (t.match_available = 0, t.match_length = T - 1, t.strstart++, m && (I(t, !1), t.strm.avail_out === 0)) return r;
          } else if (t.match_available) {
            if ((m = n._tr_tally(t, 0, t.window[t.strstart - 1])) && I(t, !1), t.strstart++, t.lookahead--, t.strm.avail_out === 0) return r;
          } else t.match_available = 1, t.strstart++, t.lookahead--;
        }
        return t.match_available && (m = n._tr_tally(t, 0, t.window[t.strstart - 1]), t.match_available = 0), t.insert = t.strstart < T - 1 ? t.strstart : T - 1, F === v ? (I(t, !0), t.strm.avail_out === 0 ? tt : W) : t.last_lit && (I(t, !1), t.strm.avail_out === 0) ? r : B;
      }
      function st(t, F, O, m, d) {
        this.good_length = t, this.max_lazy = F, this.nice_length = O, this.max_chain = m, this.func = d;
      }
      function ut() {
        this.strm = null, this.status = 0, this.pending_buf = null, this.pending_buf_size = 0, this.pending_out = 0, this.pending = 0, this.wrap = 0, this.gzhead = null, this.gzindex = 0, this.method = y, this.last_flush = -1, this.w_size = 0, this.w_bits = 0, this.w_mask = 0, this.window = null, this.window_size = 0, this.prev = null, this.head = null, this.ins_h = 0, this.hash_size = 0, this.hash_bits = 0, this.hash_mask = 0, this.hash_shift = 0, this.block_start = 0, this.match_length = 0, this.prev_match = 0, this.match_available = 0, this.strstart = 0, this.match_start = 0, this.lookahead = 0, this.prev_length = 0, this.max_chain_length = 0, this.max_lazy_match = 0, this.level = 0, this.strategy = 0, this.good_match = 0, this.nice_match = 0, this.dyn_ltree = new o.Buf16(2 * P), this.dyn_dtree = new o.Buf16(2 * (2 * E + 1)), this.bl_tree = new o.Buf16(2 * (2 * D + 1)), Q(this.dyn_ltree), Q(this.dyn_dtree), Q(this.bl_tree), this.l_desc = null, this.d_desc = null, this.bl_desc = null, this.bl_count = new o.Buf16(U + 1), this.heap = new o.Buf16(2 * C + 1), Q(this.heap), this.heap_len = 0, this.heap_max = 0, this.depth = new o.Buf16(2 * C + 1), Q(this.depth), this.l_buf = 0, this.lit_bufsize = 0, this.last_lit = 0, this.d_buf = 0, this.opt_len = 0, this.static_len = 0, this.matches = 0, this.insert = 0, this.bi_buf = 0, this.bi_valid = 0;
      }
      function lt(t) {
        var F;
        return t && t.state ? (t.total_in = t.total_out = 0, t.data_type = c, (F = t.state).pending = 0, F.pending_out = 0, F.wrap < 0 && (F.wrap = -F.wrap), F.status = F.wrap ? k : R, t.adler = F.wrap === 2 ? 0 : 1, F.last_flush = _, n._tr_init(F), a) : et(t, g);
      }
      function _t(t) {
        var F = lt(t);
        return F === a && function(O) {
          O.window_size = 2 * O.w_size, Q(O.head), O.max_lazy_match = s[O.level].max_lazy, O.good_match = s[O.level].good_length, O.nice_match = s[O.level].nice_length, O.max_chain_length = s[O.level].max_chain, O.strstart = 0, O.block_start = 0, O.lookahead = 0, O.insert = 0, O.match_length = O.prev_length = T - 1, O.match_available = 0, O.ins_h = 0;
        }(t.state), F;
      }
      function gt(t, F, O, m, d, S) {
        if (!t) return g;
        var L = 1;
        if (F === i && (F = 6), m < 0 ? (L = 0, m = -m) : 15 < m && (L = 2, m -= 16), d < 1 || x < d || O !== y || m < 8 || 15 < m || F < 0 || 9 < F || S < 0 || f < S) return et(t, g);
        m === 8 && (m = 9);
        var N = new ut();
        return (t.state = N).strm = t, N.wrap = L, N.gzhead = null, N.w_bits = m, N.w_size = 1 << N.w_bits, N.w_mask = N.w_size - 1, N.hash_bits = d + 7, N.hash_size = 1 << N.hash_bits, N.hash_mask = N.hash_size - 1, N.hash_shift = ~~((N.hash_bits + T - 1) / T), N.window = new o.Buf8(2 * N.w_size), N.head = new o.Buf16(N.hash_size), N.prev = new o.Buf16(N.w_size), N.lit_bufsize = 1 << d + 6, N.pending_buf_size = 4 * N.lit_bufsize, N.pending_buf = new o.Buf8(N.pending_buf_size), N.d_buf = 1 * N.lit_bufsize, N.l_buf = 3 * N.lit_bufsize, N.level = F, N.strategy = S, N.method = O, _t(t);
      }
      s = [new st(0, 0, 0, 0, function(t, F) {
        var O = 65535;
        for (O > t.pending_buf_size - 5 && (O = t.pending_buf_size - 5); ; ) {
          if (t.lookahead <= 1) {
            if (ot(t), t.lookahead === 0 && F === _) return r;
            if (t.lookahead === 0) break;
          }
          t.strstart += t.lookahead, t.lookahead = 0;
          var m = t.block_start + O;
          if ((t.strstart === 0 || t.strstart >= m) && (t.lookahead = t.strstart - m, t.strstart = m, I(t, !1), t.strm.avail_out === 0) || t.strstart - t.block_start >= t.w_size - X && (I(t, !1), t.strm.avail_out === 0)) return r;
        }
        return t.insert = 0, F === v ? (I(t, !0), t.strm.avail_out === 0 ? tt : W) : (t.strstart > t.block_start && (I(t, !1), t.strm.avail_out), r);
      }), new st(4, 4, 8, 4, dt), new st(4, 5, 16, 8, dt), new st(4, 6, 32, 32, dt), new st(4, 4, 16, 16, rt), new st(8, 16, 32, 32, rt), new st(8, 16, 128, 128, rt), new st(8, 32, 128, 256, rt), new st(32, 128, 258, 1024, rt), new st(32, 258, 258, 4096, rt)], u.deflateInit = function(t, F) {
        return gt(t, F, y, 15, 8, 0);
      }, u.deflateInit2 = gt, u.deflateReset = _t, u.deflateResetKeep = lt, u.deflateSetHeader = function(t, F) {
        return t && t.state ? t.state.wrap !== 2 ? g : (t.state.gzhead = F, a) : g;
      }, u.deflate = function(t, F) {
        var O, m, d, S;
        if (!t || !t.state || 5 < F || F < 0) return t ? et(t, g) : g;
        if (m = t.state, !t.output || !t.input && t.avail_in !== 0 || m.status === 666 && F !== v) return et(t, t.avail_out === 0 ? -5 : g);
        if (m.strm = t, O = m.last_flush, m.last_flush = F, m.status === k) if (m.wrap === 2) t.adler = 0, J(m, 31), J(m, 139), J(m, 8), m.gzhead ? (J(m, (m.gzhead.text ? 1 : 0) + (m.gzhead.hcrc ? 2 : 0) + (m.gzhead.extra ? 4 : 0) + (m.gzhead.name ? 8 : 0) + (m.gzhead.comment ? 16 : 0)), J(m, 255 & m.gzhead.time), J(m, m.gzhead.time >> 8 & 255), J(m, m.gzhead.time >> 16 & 255), J(m, m.gzhead.time >> 24 & 255), J(m, m.level === 9 ? 2 : 2 <= m.strategy || m.level < 2 ? 4 : 0), J(m, 255 & m.gzhead.os), m.gzhead.extra && m.gzhead.extra.length && (J(m, 255 & m.gzhead.extra.length), J(m, m.gzhead.extra.length >> 8 & 255)), m.gzhead.hcrc && (t.adler = w(t.adler, m.pending_buf, m.pending, 0)), m.gzindex = 0, m.status = 69) : (J(m, 0), J(m, 0), J(m, 0), J(m, 0), J(m, 0), J(m, m.level === 9 ? 2 : 2 <= m.strategy || m.level < 2 ? 4 : 0), J(m, 3), m.status = R);
        else {
          var L = y + (m.w_bits - 8 << 4) << 8;
          L |= (2 <= m.strategy || m.level < 2 ? 0 : m.level < 6 ? 1 : m.level === 6 ? 2 : 3) << 6, m.strstart !== 0 && (L |= 32), L += 31 - L % 31, m.status = R, V(m, L), m.strstart !== 0 && (V(m, t.adler >>> 16), V(m, 65535 & t.adler)), t.adler = 1;
        }
        if (m.status === 69) if (m.gzhead.extra) {
          for (d = m.pending; m.gzindex < (65535 & m.gzhead.extra.length) && (m.pending !== m.pending_buf_size || (m.gzhead.hcrc && m.pending > d && (t.adler = w(t.adler, m.pending_buf, m.pending - d, d)), z(t), d = m.pending, m.pending !== m.pending_buf_size)); ) J(m, 255 & m.gzhead.extra[m.gzindex]), m.gzindex++;
          m.gzhead.hcrc && m.pending > d && (t.adler = w(t.adler, m.pending_buf, m.pending - d, d)), m.gzindex === m.gzhead.extra.length && (m.gzindex = 0, m.status = 73);
        } else m.status = 73;
        if (m.status === 73) if (m.gzhead.name) {
          d = m.pending;
          do {
            if (m.pending === m.pending_buf_size && (m.gzhead.hcrc && m.pending > d && (t.adler = w(t.adler, m.pending_buf, m.pending - d, d)), z(t), d = m.pending, m.pending === m.pending_buf_size)) {
              S = 1;
              break;
            }
            S = m.gzindex < m.gzhead.name.length ? 255 & m.gzhead.name.charCodeAt(m.gzindex++) : 0, J(m, S);
          } while (S !== 0);
          m.gzhead.hcrc && m.pending > d && (t.adler = w(t.adler, m.pending_buf, m.pending - d, d)), S === 0 && (m.gzindex = 0, m.status = 91);
        } else m.status = 91;
        if (m.status === 91) if (m.gzhead.comment) {
          d = m.pending;
          do {
            if (m.pending === m.pending_buf_size && (m.gzhead.hcrc && m.pending > d && (t.adler = w(t.adler, m.pending_buf, m.pending - d, d)), z(t), d = m.pending, m.pending === m.pending_buf_size)) {
              S = 1;
              break;
            }
            S = m.gzindex < m.gzhead.comment.length ? 255 & m.gzhead.comment.charCodeAt(m.gzindex++) : 0, J(m, S);
          } while (S !== 0);
          m.gzhead.hcrc && m.pending > d && (t.adler = w(t.adler, m.pending_buf, m.pending - d, d)), S === 0 && (m.status = 103);
        } else m.status = 103;
        if (m.status === 103 && (m.gzhead.hcrc ? (m.pending + 2 > m.pending_buf_size && z(t), m.pending + 2 <= m.pending_buf_size && (J(m, 255 & t.adler), J(m, t.adler >> 8 & 255), t.adler = 0, m.status = R)) : m.status = R), m.pending !== 0) {
          if (z(t), t.avail_out === 0) return m.last_flush = -1, a;
        } else if (t.avail_in === 0 && j(F) <= j(O) && F !== v) return et(t, -5);
        if (m.status === 666 && t.avail_in !== 0) return et(t, -5);
        if (t.avail_in !== 0 || m.lookahead !== 0 || F !== _ && m.status !== 666) {
          var N = m.strategy === 2 ? function(A, Z) {
            for (var K; ; ) {
              if (A.lookahead === 0 && (ot(A), A.lookahead === 0)) {
                if (Z === _) return r;
                break;
              }
              if (A.match_length = 0, K = n._tr_tally(A, 0, A.window[A.strstart]), A.lookahead--, A.strstart++, K && (I(A, !1), A.strm.avail_out === 0)) return r;
            }
            return A.insert = 0, Z === v ? (I(A, !0), A.strm.avail_out === 0 ? tt : W) : A.last_lit && (I(A, !1), A.strm.avail_out === 0) ? r : B;
          }(m, F) : m.strategy === 3 ? function(A, Z) {
            for (var K, G, Y, at, nt = A.window; ; ) {
              if (A.lookahead <= M) {
                if (ot(A), A.lookahead <= M && Z === _) return r;
                if (A.lookahead === 0) break;
              }
              if (A.match_length = 0, A.lookahead >= T && 0 < A.strstart && (G = nt[Y = A.strstart - 1]) === nt[++Y] && G === nt[++Y] && G === nt[++Y]) {
                at = A.strstart + M;
                do
                  ;
                while (G === nt[++Y] && G === nt[++Y] && G === nt[++Y] && G === nt[++Y] && G === nt[++Y] && G === nt[++Y] && G === nt[++Y] && G === nt[++Y] && Y < at);
                A.match_length = M - (at - Y), A.match_length > A.lookahead && (A.match_length = A.lookahead);
              }
              if (A.match_length >= T ? (K = n._tr_tally(A, 1, A.match_length - T), A.lookahead -= A.match_length, A.strstart += A.match_length, A.match_length = 0) : (K = n._tr_tally(A, 0, A.window[A.strstart]), A.lookahead--, A.strstart++), K && (I(A, !1), A.strm.avail_out === 0)) return r;
            }
            return A.insert = 0, Z === v ? (I(A, !0), A.strm.avail_out === 0 ? tt : W) : A.last_lit && (I(A, !1), A.strm.avail_out === 0) ? r : B;
          }(m, F) : s[m.level].func(m, F);
          if (N !== tt && N !== W || (m.status = 666), N === r || N === tt) return t.avail_out === 0 && (m.last_flush = -1), a;
          if (N === B && (F === 1 ? n._tr_align(m) : F !== 5 && (n._tr_stored_block(m, 0, 0, !1), F === 3 && (Q(m.head), m.lookahead === 0 && (m.strstart = 0, m.block_start = 0, m.insert = 0))), z(t), t.avail_out === 0)) return m.last_flush = -1, a;
        }
        return F !== v ? a : m.wrap <= 0 ? 1 : (m.wrap === 2 ? (J(m, 255 & t.adler), J(m, t.adler >> 8 & 255), J(m, t.adler >> 16 & 255), J(m, t.adler >> 24 & 255), J(m, 255 & t.total_in), J(m, t.total_in >> 8 & 255), J(m, t.total_in >> 16 & 255), J(m, t.total_in >> 24 & 255)) : (V(m, t.adler >>> 16), V(m, 65535 & t.adler)), z(t), 0 < m.wrap && (m.wrap = -m.wrap), m.pending !== 0 ? a : 1);
      }, u.deflateEnd = function(t) {
        var F;
        return t && t.state ? (F = t.state.status) !== k && F !== 69 && F !== 73 && F !== 91 && F !== 103 && F !== R && F !== 666 ? et(t, g) : (t.state = null, F === R ? et(t, -3) : a) : g;
      }, u.deflateSetDictionary = function(t, F) {
        var O, m, d, S, L, N, A, Z, K = F.length;
        if (!t || !t.state || (S = (O = t.state).wrap) === 2 || S === 1 && O.status !== k || O.lookahead) return g;
        for (S === 1 && (t.adler = h(t.adler, F, K, 0)), O.wrap = 0, K >= O.w_size && (S === 0 && (Q(O.head), O.strstart = 0, O.block_start = 0, O.insert = 0), Z = new o.Buf8(O.w_size), o.arraySet(Z, F, K - O.w_size, O.w_size, 0), F = Z, K = O.w_size), L = t.avail_in, N = t.next_in, A = t.input, t.avail_in = K, t.next_in = 0, t.input = F, ot(O); O.lookahead >= T; ) {
          for (m = O.strstart, d = O.lookahead - (T - 1); O.ins_h = (O.ins_h << O.hash_shift ^ O.window[m + T - 1]) & O.hash_mask, O.prev[m & O.w_mask] = O.head[O.ins_h], O.head[O.ins_h] = m, m++, --d; ) ;
          O.strstart = m, O.lookahead = T - 1, ot(O);
        }
        return O.strstart += O.lookahead, O.block_start = O.strstart, O.insert = O.lookahead, O.lookahead = 0, O.match_length = O.prev_length = T - 1, O.match_available = 0, t.next_in = N, t.input = A, t.avail_in = L, O.wrap = S, a;
      }, u.deflateInfo = "pako deflate (from Nodeca project)";
    }, { "../utils/common": 41, "./adler32": 43, "./crc32": 45, "./messages": 51, "./trees": 52 }], 47: [function(e, p, u) {
      p.exports = function() {
        this.text = 0, this.time = 0, this.xflags = 0, this.os = 0, this.extra = null, this.extra_len = 0, this.name = "", this.comment = "", this.hcrc = 0, this.done = !1;
      };
    }, {}], 48: [function(e, p, u) {
      p.exports = function(s, o) {
        var n, h, w, b, _, v, a, g, i, f, c, y, x, C, E, D, P, U, T, M, X, k, R, r, B;
        n = s.state, h = s.next_in, r = s.input, w = h + (s.avail_in - 5), b = s.next_out, B = s.output, _ = b - (o - s.avail_out), v = b + (s.avail_out - 257), a = n.dmax, g = n.wsize, i = n.whave, f = n.wnext, c = n.window, y = n.hold, x = n.bits, C = n.lencode, E = n.distcode, D = (1 << n.lenbits) - 1, P = (1 << n.distbits) - 1;
        t: do {
          x < 15 && (y += r[h++] << x, x += 8, y += r[h++] << x, x += 8), U = C[y & D];
          e: for (; ; ) {
            if (y >>>= T = U >>> 24, x -= T, (T = U >>> 16 & 255) === 0) B[b++] = 65535 & U;
            else {
              if (!(16 & T)) {
                if (!(64 & T)) {
                  U = C[(65535 & U) + (y & (1 << T) - 1)];
                  continue e;
                }
                if (32 & T) {
                  n.mode = 12;
                  break t;
                }
                s.msg = "invalid literal/length code", n.mode = 30;
                break t;
              }
              M = 65535 & U, (T &= 15) && (x < T && (y += r[h++] << x, x += 8), M += y & (1 << T) - 1, y >>>= T, x -= T), x < 15 && (y += r[h++] << x, x += 8, y += r[h++] << x, x += 8), U = E[y & P];
              r: for (; ; ) {
                if (y >>>= T = U >>> 24, x -= T, !(16 & (T = U >>> 16 & 255))) {
                  if (!(64 & T)) {
                    U = E[(65535 & U) + (y & (1 << T) - 1)];
                    continue r;
                  }
                  s.msg = "invalid distance code", n.mode = 30;
                  break t;
                }
                if (X = 65535 & U, x < (T &= 15) && (y += r[h++] << x, (x += 8) < T && (y += r[h++] << x, x += 8)), a < (X += y & (1 << T) - 1)) {
                  s.msg = "invalid distance too far back", n.mode = 30;
                  break t;
                }
                if (y >>>= T, x -= T, (T = b - _) < X) {
                  if (i < (T = X - T) && n.sane) {
                    s.msg = "invalid distance too far back", n.mode = 30;
                    break t;
                  }
                  if (R = c, (k = 0) === f) {
                    if (k += g - T, T < M) {
                      for (M -= T; B[b++] = c[k++], --T; ) ;
                      k = b - X, R = B;
                    }
                  } else if (f < T) {
                    if (k += g + f - T, (T -= f) < M) {
                      for (M -= T; B[b++] = c[k++], --T; ) ;
                      if (k = 0, f < M) {
                        for (M -= T = f; B[b++] = c[k++], --T; ) ;
                        k = b - X, R = B;
                      }
                    }
                  } else if (k += f - T, T < M) {
                    for (M -= T; B[b++] = c[k++], --T; ) ;
                    k = b - X, R = B;
                  }
                  for (; 2 < M; ) B[b++] = R[k++], B[b++] = R[k++], B[b++] = R[k++], M -= 3;
                  M && (B[b++] = R[k++], 1 < M && (B[b++] = R[k++]));
                } else {
                  for (k = b - X; B[b++] = B[k++], B[b++] = B[k++], B[b++] = B[k++], 2 < (M -= 3); ) ;
                  M && (B[b++] = B[k++], 1 < M && (B[b++] = B[k++]));
                }
                break;
              }
            }
            break;
          }
        } while (h < w && b < v);
        h -= M = x >> 3, y &= (1 << (x -= M << 3)) - 1, s.next_in = h, s.next_out = b, s.avail_in = h < w ? w - h + 5 : 5 - (h - w), s.avail_out = b < v ? v - b + 257 : 257 - (b - v), n.hold = y, n.bits = x;
      };
    }, {}], 49: [function(e, p, u) {
      var s = e("../utils/common"), o = e("./adler32"), n = e("./crc32"), h = e("./inffast"), w = e("./inftrees"), b = 1, _ = 2, v = 0, a = -2, g = 1, i = 852, f = 592;
      function c(k) {
        return (k >>> 24 & 255) + (k >>> 8 & 65280) + ((65280 & k) << 8) + ((255 & k) << 24);
      }
      function y() {
        this.mode = 0, this.last = !1, this.wrap = 0, this.havedict = !1, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = new s.Buf16(320), this.work = new s.Buf16(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0;
      }
      function x(k) {
        var R;
        return k && k.state ? (R = k.state, k.total_in = k.total_out = R.total = 0, k.msg = "", R.wrap && (k.adler = 1 & R.wrap), R.mode = g, R.last = 0, R.havedict = 0, R.dmax = 32768, R.head = null, R.hold = 0, R.bits = 0, R.lencode = R.lendyn = new s.Buf32(i), R.distcode = R.distdyn = new s.Buf32(f), R.sane = 1, R.back = -1, v) : a;
      }
      function C(k) {
        var R;
        return k && k.state ? ((R = k.state).wsize = 0, R.whave = 0, R.wnext = 0, x(k)) : a;
      }
      function E(k, R) {
        var r, B;
        return k && k.state ? (B = k.state, R < 0 ? (r = 0, R = -R) : (r = 1 + (R >> 4), R < 48 && (R &= 15)), R && (R < 8 || 15 < R) ? a : (B.window !== null && B.wbits !== R && (B.window = null), B.wrap = r, B.wbits = R, C(k))) : a;
      }
      function D(k, R) {
        var r, B;
        return k ? (B = new y(), (k.state = B).window = null, (r = E(k, R)) !== v && (k.state = null), r) : a;
      }
      var P, U, T = !0;
      function M(k) {
        if (T) {
          var R;
          for (P = new s.Buf32(512), U = new s.Buf32(32), R = 0; R < 144; ) k.lens[R++] = 8;
          for (; R < 256; ) k.lens[R++] = 9;
          for (; R < 280; ) k.lens[R++] = 7;
          for (; R < 288; ) k.lens[R++] = 8;
          for (w(b, k.lens, 0, 288, P, 0, k.work, { bits: 9 }), R = 0; R < 32; ) k.lens[R++] = 5;
          w(_, k.lens, 0, 32, U, 0, k.work, { bits: 5 }), T = !1;
        }
        k.lencode = P, k.lenbits = 9, k.distcode = U, k.distbits = 5;
      }
      function X(k, R, r, B) {
        var tt, W = k.state;
        return W.window === null && (W.wsize = 1 << W.wbits, W.wnext = 0, W.whave = 0, W.window = new s.Buf8(W.wsize)), B >= W.wsize ? (s.arraySet(W.window, R, r - W.wsize, W.wsize, 0), W.wnext = 0, W.whave = W.wsize) : (B < (tt = W.wsize - W.wnext) && (tt = B), s.arraySet(W.window, R, r - B, tt, W.wnext), (B -= tt) ? (s.arraySet(W.window, R, r - B, B, 0), W.wnext = B, W.whave = W.wsize) : (W.wnext += tt, W.wnext === W.wsize && (W.wnext = 0), W.whave < W.wsize && (W.whave += tt))), 0;
      }
      u.inflateReset = C, u.inflateReset2 = E, u.inflateResetKeep = x, u.inflateInit = function(k) {
        return D(k, 15);
      }, u.inflateInit2 = D, u.inflate = function(k, R) {
        var r, B, tt, W, et, j, Q, z, I, J, V, q, ot, dt, rt, st, ut, lt, _t, gt, t, F, O, m, d = 0, S = new s.Buf8(4), L = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
        if (!k || !k.state || !k.output || !k.input && k.avail_in !== 0) return a;
        (r = k.state).mode === 12 && (r.mode = 13), et = k.next_out, tt = k.output, Q = k.avail_out, W = k.next_in, B = k.input, j = k.avail_in, z = r.hold, I = r.bits, J = j, V = Q, F = v;
        t: for (; ; ) switch (r.mode) {
          case g:
            if (r.wrap === 0) {
              r.mode = 13;
              break;
            }
            for (; I < 16; ) {
              if (j === 0) break t;
              j--, z += B[W++] << I, I += 8;
            }
            if (2 & r.wrap && z === 35615) {
              S[r.check = 0] = 255 & z, S[1] = z >>> 8 & 255, r.check = n(r.check, S, 2, 0), I = z = 0, r.mode = 2;
              break;
            }
            if (r.flags = 0, r.head && (r.head.done = !1), !(1 & r.wrap) || (((255 & z) << 8) + (z >> 8)) % 31) {
              k.msg = "incorrect header check", r.mode = 30;
              break;
            }
            if ((15 & z) != 8) {
              k.msg = "unknown compression method", r.mode = 30;
              break;
            }
            if (I -= 4, t = 8 + (15 & (z >>>= 4)), r.wbits === 0) r.wbits = t;
            else if (t > r.wbits) {
              k.msg = "invalid window size", r.mode = 30;
              break;
            }
            r.dmax = 1 << t, k.adler = r.check = 1, r.mode = 512 & z ? 10 : 12, I = z = 0;
            break;
          case 2:
            for (; I < 16; ) {
              if (j === 0) break t;
              j--, z += B[W++] << I, I += 8;
            }
            if (r.flags = z, (255 & r.flags) != 8) {
              k.msg = "unknown compression method", r.mode = 30;
              break;
            }
            if (57344 & r.flags) {
              k.msg = "unknown header flags set", r.mode = 30;
              break;
            }
            r.head && (r.head.text = z >> 8 & 1), 512 & r.flags && (S[0] = 255 & z, S[1] = z >>> 8 & 255, r.check = n(r.check, S, 2, 0)), I = z = 0, r.mode = 3;
          case 3:
            for (; I < 32; ) {
              if (j === 0) break t;
              j--, z += B[W++] << I, I += 8;
            }
            r.head && (r.head.time = z), 512 & r.flags && (S[0] = 255 & z, S[1] = z >>> 8 & 255, S[2] = z >>> 16 & 255, S[3] = z >>> 24 & 255, r.check = n(r.check, S, 4, 0)), I = z = 0, r.mode = 4;
          case 4:
            for (; I < 16; ) {
              if (j === 0) break t;
              j--, z += B[W++] << I, I += 8;
            }
            r.head && (r.head.xflags = 255 & z, r.head.os = z >> 8), 512 & r.flags && (S[0] = 255 & z, S[1] = z >>> 8 & 255, r.check = n(r.check, S, 2, 0)), I = z = 0, r.mode = 5;
          case 5:
            if (1024 & r.flags) {
              for (; I < 16; ) {
                if (j === 0) break t;
                j--, z += B[W++] << I, I += 8;
              }
              r.length = z, r.head && (r.head.extra_len = z), 512 & r.flags && (S[0] = 255 & z, S[1] = z >>> 8 & 255, r.check = n(r.check, S, 2, 0)), I = z = 0;
            } else r.head && (r.head.extra = null);
            r.mode = 6;
          case 6:
            if (1024 & r.flags && (j < (q = r.length) && (q = j), q && (r.head && (t = r.head.extra_len - r.length, r.head.extra || (r.head.extra = new Array(r.head.extra_len)), s.arraySet(r.head.extra, B, W, q, t)), 512 & r.flags && (r.check = n(r.check, B, q, W)), j -= q, W += q, r.length -= q), r.length)) break t;
            r.length = 0, r.mode = 7;
          case 7:
            if (2048 & r.flags) {
              if (j === 0) break t;
              for (q = 0; t = B[W + q++], r.head && t && r.length < 65536 && (r.head.name += String.fromCharCode(t)), t && q < j; ) ;
              if (512 & r.flags && (r.check = n(r.check, B, q, W)), j -= q, W += q, t) break t;
            } else r.head && (r.head.name = null);
            r.length = 0, r.mode = 8;
          case 8:
            if (4096 & r.flags) {
              if (j === 0) break t;
              for (q = 0; t = B[W + q++], r.head && t && r.length < 65536 && (r.head.comment += String.fromCharCode(t)), t && q < j; ) ;
              if (512 & r.flags && (r.check = n(r.check, B, q, W)), j -= q, W += q, t) break t;
            } else r.head && (r.head.comment = null);
            r.mode = 9;
          case 9:
            if (512 & r.flags) {
              for (; I < 16; ) {
                if (j === 0) break t;
                j--, z += B[W++] << I, I += 8;
              }
              if (z !== (65535 & r.check)) {
                k.msg = "header crc mismatch", r.mode = 30;
                break;
              }
              I = z = 0;
            }
            r.head && (r.head.hcrc = r.flags >> 9 & 1, r.head.done = !0), k.adler = r.check = 0, r.mode = 12;
            break;
          case 10:
            for (; I < 32; ) {
              if (j === 0) break t;
              j--, z += B[W++] << I, I += 8;
            }
            k.adler = r.check = c(z), I = z = 0, r.mode = 11;
          case 11:
            if (r.havedict === 0) return k.next_out = et, k.avail_out = Q, k.next_in = W, k.avail_in = j, r.hold = z, r.bits = I, 2;
            k.adler = r.check = 1, r.mode = 12;
          case 12:
            if (R === 5 || R === 6) break t;
          case 13:
            if (r.last) {
              z >>>= 7 & I, I -= 7 & I, r.mode = 27;
              break;
            }
            for (; I < 3; ) {
              if (j === 0) break t;
              j--, z += B[W++] << I, I += 8;
            }
            switch (r.last = 1 & z, I -= 1, 3 & (z >>>= 1)) {
              case 0:
                r.mode = 14;
                break;
              case 1:
                if (M(r), r.mode = 20, R !== 6) break;
                z >>>= 2, I -= 2;
                break t;
              case 2:
                r.mode = 17;
                break;
              case 3:
                k.msg = "invalid block type", r.mode = 30;
            }
            z >>>= 2, I -= 2;
            break;
          case 14:
            for (z >>>= 7 & I, I -= 7 & I; I < 32; ) {
              if (j === 0) break t;
              j--, z += B[W++] << I, I += 8;
            }
            if ((65535 & z) != (z >>> 16 ^ 65535)) {
              k.msg = "invalid stored block lengths", r.mode = 30;
              break;
            }
            if (r.length = 65535 & z, I = z = 0, r.mode = 15, R === 6) break t;
          case 15:
            r.mode = 16;
          case 16:
            if (q = r.length) {
              if (j < q && (q = j), Q < q && (q = Q), q === 0) break t;
              s.arraySet(tt, B, W, q, et), j -= q, W += q, Q -= q, et += q, r.length -= q;
              break;
            }
            r.mode = 12;
            break;
          case 17:
            for (; I < 14; ) {
              if (j === 0) break t;
              j--, z += B[W++] << I, I += 8;
            }
            if (r.nlen = 257 + (31 & z), z >>>= 5, I -= 5, r.ndist = 1 + (31 & z), z >>>= 5, I -= 5, r.ncode = 4 + (15 & z), z >>>= 4, I -= 4, 286 < r.nlen || 30 < r.ndist) {
              k.msg = "too many length or distance symbols", r.mode = 30;
              break;
            }
            r.have = 0, r.mode = 18;
          case 18:
            for (; r.have < r.ncode; ) {
              for (; I < 3; ) {
                if (j === 0) break t;
                j--, z += B[W++] << I, I += 8;
              }
              r.lens[L[r.have++]] = 7 & z, z >>>= 3, I -= 3;
            }
            for (; r.have < 19; ) r.lens[L[r.have++]] = 0;
            if (r.lencode = r.lendyn, r.lenbits = 7, O = { bits: r.lenbits }, F = w(0, r.lens, 0, 19, r.lencode, 0, r.work, O), r.lenbits = O.bits, F) {
              k.msg = "invalid code lengths set", r.mode = 30;
              break;
            }
            r.have = 0, r.mode = 19;
          case 19:
            for (; r.have < r.nlen + r.ndist; ) {
              for (; st = (d = r.lencode[z & (1 << r.lenbits) - 1]) >>> 16 & 255, ut = 65535 & d, !((rt = d >>> 24) <= I); ) {
                if (j === 0) break t;
                j--, z += B[W++] << I, I += 8;
              }
              if (ut < 16) z >>>= rt, I -= rt, r.lens[r.have++] = ut;
              else {
                if (ut === 16) {
                  for (m = rt + 2; I < m; ) {
                    if (j === 0) break t;
                    j--, z += B[W++] << I, I += 8;
                  }
                  if (z >>>= rt, I -= rt, r.have === 0) {
                    k.msg = "invalid bit length repeat", r.mode = 30;
                    break;
                  }
                  t = r.lens[r.have - 1], q = 3 + (3 & z), z >>>= 2, I -= 2;
                } else if (ut === 17) {
                  for (m = rt + 3; I < m; ) {
                    if (j === 0) break t;
                    j--, z += B[W++] << I, I += 8;
                  }
                  I -= rt, t = 0, q = 3 + (7 & (z >>>= rt)), z >>>= 3, I -= 3;
                } else {
                  for (m = rt + 7; I < m; ) {
                    if (j === 0) break t;
                    j--, z += B[W++] << I, I += 8;
                  }
                  I -= rt, t = 0, q = 11 + (127 & (z >>>= rt)), z >>>= 7, I -= 7;
                }
                if (r.have + q > r.nlen + r.ndist) {
                  k.msg = "invalid bit length repeat", r.mode = 30;
                  break;
                }
                for (; q--; ) r.lens[r.have++] = t;
              }
            }
            if (r.mode === 30) break;
            if (r.lens[256] === 0) {
              k.msg = "invalid code -- missing end-of-block", r.mode = 30;
              break;
            }
            if (r.lenbits = 9, O = { bits: r.lenbits }, F = w(b, r.lens, 0, r.nlen, r.lencode, 0, r.work, O), r.lenbits = O.bits, F) {
              k.msg = "invalid literal/lengths set", r.mode = 30;
              break;
            }
            if (r.distbits = 6, r.distcode = r.distdyn, O = { bits: r.distbits }, F = w(_, r.lens, r.nlen, r.ndist, r.distcode, 0, r.work, O), r.distbits = O.bits, F) {
              k.msg = "invalid distances set", r.mode = 30;
              break;
            }
            if (r.mode = 20, R === 6) break t;
          case 20:
            r.mode = 21;
          case 21:
            if (6 <= j && 258 <= Q) {
              k.next_out = et, k.avail_out = Q, k.next_in = W, k.avail_in = j, r.hold = z, r.bits = I, h(k, V), et = k.next_out, tt = k.output, Q = k.avail_out, W = k.next_in, B = k.input, j = k.avail_in, z = r.hold, I = r.bits, r.mode === 12 && (r.back = -1);
              break;
            }
            for (r.back = 0; st = (d = r.lencode[z & (1 << r.lenbits) - 1]) >>> 16 & 255, ut = 65535 & d, !((rt = d >>> 24) <= I); ) {
              if (j === 0) break t;
              j--, z += B[W++] << I, I += 8;
            }
            if (st && !(240 & st)) {
              for (lt = rt, _t = st, gt = ut; st = (d = r.lencode[gt + ((z & (1 << lt + _t) - 1) >> lt)]) >>> 16 & 255, ut = 65535 & d, !(lt + (rt = d >>> 24) <= I); ) {
                if (j === 0) break t;
                j--, z += B[W++] << I, I += 8;
              }
              z >>>= lt, I -= lt, r.back += lt;
            }
            if (z >>>= rt, I -= rt, r.back += rt, r.length = ut, st === 0) {
              r.mode = 26;
              break;
            }
            if (32 & st) {
              r.back = -1, r.mode = 12;
              break;
            }
            if (64 & st) {
              k.msg = "invalid literal/length code", r.mode = 30;
              break;
            }
            r.extra = 15 & st, r.mode = 22;
          case 22:
            if (r.extra) {
              for (m = r.extra; I < m; ) {
                if (j === 0) break t;
                j--, z += B[W++] << I, I += 8;
              }
              r.length += z & (1 << r.extra) - 1, z >>>= r.extra, I -= r.extra, r.back += r.extra;
            }
            r.was = r.length, r.mode = 23;
          case 23:
            for (; st = (d = r.distcode[z & (1 << r.distbits) - 1]) >>> 16 & 255, ut = 65535 & d, !((rt = d >>> 24) <= I); ) {
              if (j === 0) break t;
              j--, z += B[W++] << I, I += 8;
            }
            if (!(240 & st)) {
              for (lt = rt, _t = st, gt = ut; st = (d = r.distcode[gt + ((z & (1 << lt + _t) - 1) >> lt)]) >>> 16 & 255, ut = 65535 & d, !(lt + (rt = d >>> 24) <= I); ) {
                if (j === 0) break t;
                j--, z += B[W++] << I, I += 8;
              }
              z >>>= lt, I -= lt, r.back += lt;
            }
            if (z >>>= rt, I -= rt, r.back += rt, 64 & st) {
              k.msg = "invalid distance code", r.mode = 30;
              break;
            }
            r.offset = ut, r.extra = 15 & st, r.mode = 24;
          case 24:
            if (r.extra) {
              for (m = r.extra; I < m; ) {
                if (j === 0) break t;
                j--, z += B[W++] << I, I += 8;
              }
              r.offset += z & (1 << r.extra) - 1, z >>>= r.extra, I -= r.extra, r.back += r.extra;
            }
            if (r.offset > r.dmax) {
              k.msg = "invalid distance too far back", r.mode = 30;
              break;
            }
            r.mode = 25;
          case 25:
            if (Q === 0) break t;
            if (q = V - Q, r.offset > q) {
              if ((q = r.offset - q) > r.whave && r.sane) {
                k.msg = "invalid distance too far back", r.mode = 30;
                break;
              }
              ot = q > r.wnext ? (q -= r.wnext, r.wsize - q) : r.wnext - q, q > r.length && (q = r.length), dt = r.window;
            } else dt = tt, ot = et - r.offset, q = r.length;
            for (Q < q && (q = Q), Q -= q, r.length -= q; tt[et++] = dt[ot++], --q; ) ;
            r.length === 0 && (r.mode = 21);
            break;
          case 26:
            if (Q === 0) break t;
            tt[et++] = r.length, Q--, r.mode = 21;
            break;
          case 27:
            if (r.wrap) {
              for (; I < 32; ) {
                if (j === 0) break t;
                j--, z |= B[W++] << I, I += 8;
              }
              if (V -= Q, k.total_out += V, r.total += V, V && (k.adler = r.check = r.flags ? n(r.check, tt, V, et - V) : o(r.check, tt, V, et - V)), V = Q, (r.flags ? z : c(z)) !== r.check) {
                k.msg = "incorrect data check", r.mode = 30;
                break;
              }
              I = z = 0;
            }
            r.mode = 28;
          case 28:
            if (r.wrap && r.flags) {
              for (; I < 32; ) {
                if (j === 0) break t;
                j--, z += B[W++] << I, I += 8;
              }
              if (z !== (4294967295 & r.total)) {
                k.msg = "incorrect length check", r.mode = 30;
                break;
              }
              I = z = 0;
            }
            r.mode = 29;
          case 29:
            F = 1;
            break t;
          case 30:
            F = -3;
            break t;
          case 31:
            return -4;
          case 32:
          default:
            return a;
        }
        return k.next_out = et, k.avail_out = Q, k.next_in = W, k.avail_in = j, r.hold = z, r.bits = I, (r.wsize || V !== k.avail_out && r.mode < 30 && (r.mode < 27 || R !== 4)) && X(k, k.output, k.next_out, V - k.avail_out) ? (r.mode = 31, -4) : (J -= k.avail_in, V -= k.avail_out, k.total_in += J, k.total_out += V, r.total += V, r.wrap && V && (k.adler = r.check = r.flags ? n(r.check, tt, V, k.next_out - V) : o(r.check, tt, V, k.next_out - V)), k.data_type = r.bits + (r.last ? 64 : 0) + (r.mode === 12 ? 128 : 0) + (r.mode === 20 || r.mode === 15 ? 256 : 0), (J == 0 && V === 0 || R === 4) && F === v && (F = -5), F);
      }, u.inflateEnd = function(k) {
        if (!k || !k.state) return a;
        var R = k.state;
        return R.window && (R.window = null), k.state = null, v;
      }, u.inflateGetHeader = function(k, R) {
        var r;
        return k && k.state && 2 & (r = k.state).wrap ? ((r.head = R).done = !1, v) : a;
      }, u.inflateSetDictionary = function(k, R) {
        var r, B = R.length;
        return k && k.state ? (r = k.state).wrap !== 0 && r.mode !== 11 ? a : r.mode === 11 && o(1, R, B, 0) !== r.check ? -3 : X(k, R, B, B) ? (r.mode = 31, -4) : (r.havedict = 1, v) : a;
      }, u.inflateInfo = "pako inflate (from Nodeca project)";
    }, { "../utils/common": 41, "./adler32": 43, "./crc32": 45, "./inffast": 48, "./inftrees": 50 }], 50: [function(e, p, u) {
      var s = e("../utils/common"), o = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0], n = [16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78], h = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 0, 0], w = [16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64];
      p.exports = function(b, _, v, a, g, i, f, c) {
        var y, x, C, E, D, P, U, T, M, X = c.bits, k = 0, R = 0, r = 0, B = 0, tt = 0, W = 0, et = 0, j = 0, Q = 0, z = 0, I = null, J = 0, V = new s.Buf16(16), q = new s.Buf16(16), ot = null, dt = 0;
        for (k = 0; k <= 15; k++) V[k] = 0;
        for (R = 0; R < a; R++) V[_[v + R]]++;
        for (tt = X, B = 15; 1 <= B && V[B] === 0; B--) ;
        if (B < tt && (tt = B), B === 0) return g[i++] = 20971520, g[i++] = 20971520, c.bits = 1, 0;
        for (r = 1; r < B && V[r] === 0; r++) ;
        for (tt < r && (tt = r), k = j = 1; k <= 15; k++) if (j <<= 1, (j -= V[k]) < 0) return -1;
        if (0 < j && (b === 0 || B !== 1)) return -1;
        for (q[1] = 0, k = 1; k < 15; k++) q[k + 1] = q[k] + V[k];
        for (R = 0; R < a; R++) _[v + R] !== 0 && (f[q[_[v + R]]++] = R);
        if (P = b === 0 ? (I = ot = f, 19) : b === 1 ? (I = o, J -= 257, ot = n, dt -= 257, 256) : (I = h, ot = w, -1), k = r, D = i, et = R = z = 0, C = -1, E = (Q = 1 << (W = tt)) - 1, b === 1 && 852 < Q || b === 2 && 592 < Q) return 1;
        for (; ; ) {
          for (U = k - et, M = f[R] < P ? (T = 0, f[R]) : f[R] > P ? (T = ot[dt + f[R]], I[J + f[R]]) : (T = 96, 0), y = 1 << k - et, r = x = 1 << W; g[D + (z >> et) + (x -= y)] = U << 24 | T << 16 | M | 0, x !== 0; ) ;
          for (y = 1 << k - 1; z & y; ) y >>= 1;
          if (y !== 0 ? (z &= y - 1, z += y) : z = 0, R++, --V[k] == 0) {
            if (k === B) break;
            k = _[v + f[R]];
          }
          if (tt < k && (z & E) !== C) {
            for (et === 0 && (et = tt), D += r, j = 1 << (W = k - et); W + et < B && !((j -= V[W + et]) <= 0); ) W++, j <<= 1;
            if (Q += 1 << W, b === 1 && 852 < Q || b === 2 && 592 < Q) return 1;
            g[C = z & E] = tt << 24 | W << 16 | D - i | 0;
          }
        }
        return z !== 0 && (g[D + z] = k - et << 24 | 64 << 16 | 0), c.bits = tt, 0;
      };
    }, { "../utils/common": 41 }], 51: [function(e, p, u) {
      p.exports = { 2: "need dictionary", 1: "stream end", 0: "", "-1": "file error", "-2": "stream error", "-3": "data error", "-4": "insufficient memory", "-5": "buffer error", "-6": "incompatible version" };
    }, {}], 52: [function(e, p, u) {
      var s = e("../utils/common"), o = 0, n = 1;
      function h(d) {
        for (var S = d.length; 0 <= --S; ) d[S] = 0;
      }
      var w = 0, b = 29, _ = 256, v = _ + 1 + b, a = 30, g = 19, i = 2 * v + 1, f = 15, c = 16, y = 7, x = 256, C = 16, E = 17, D = 18, P = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0], U = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13], T = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7], M = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15], X = new Array(2 * (v + 2));
      h(X);
      var k = new Array(2 * a);
      h(k);
      var R = new Array(512);
      h(R);
      var r = new Array(256);
      h(r);
      var B = new Array(b);
      h(B);
      var tt, W, et, j = new Array(a);
      function Q(d, S, L, N, A) {
        this.static_tree = d, this.extra_bits = S, this.extra_base = L, this.elems = N, this.max_length = A, this.has_stree = d && d.length;
      }
      function z(d, S) {
        this.dyn_tree = d, this.max_code = 0, this.stat_desc = S;
      }
      function I(d) {
        return d < 256 ? R[d] : R[256 + (d >>> 7)];
      }
      function J(d, S) {
        d.pending_buf[d.pending++] = 255 & S, d.pending_buf[d.pending++] = S >>> 8 & 255;
      }
      function V(d, S, L) {
        d.bi_valid > c - L ? (d.bi_buf |= S << d.bi_valid & 65535, J(d, d.bi_buf), d.bi_buf = S >> c - d.bi_valid, d.bi_valid += L - c) : (d.bi_buf |= S << d.bi_valid & 65535, d.bi_valid += L);
      }
      function q(d, S, L) {
        V(d, L[2 * S], L[2 * S + 1]);
      }
      function ot(d, S) {
        for (var L = 0; L |= 1 & d, d >>>= 1, L <<= 1, 0 < --S; ) ;
        return L >>> 1;
      }
      function dt(d, S, L) {
        var N, A, Z = new Array(f + 1), K = 0;
        for (N = 1; N <= f; N++) Z[N] = K = K + L[N - 1] << 1;
        for (A = 0; A <= S; A++) {
          var G = d[2 * A + 1];
          G !== 0 && (d[2 * A] = ot(Z[G]++, G));
        }
      }
      function rt(d) {
        var S;
        for (S = 0; S < v; S++) d.dyn_ltree[2 * S] = 0;
        for (S = 0; S < a; S++) d.dyn_dtree[2 * S] = 0;
        for (S = 0; S < g; S++) d.bl_tree[2 * S] = 0;
        d.dyn_ltree[2 * x] = 1, d.opt_len = d.static_len = 0, d.last_lit = d.matches = 0;
      }
      function st(d) {
        8 < d.bi_valid ? J(d, d.bi_buf) : 0 < d.bi_valid && (d.pending_buf[d.pending++] = d.bi_buf), d.bi_buf = 0, d.bi_valid = 0;
      }
      function ut(d, S, L, N) {
        var A = 2 * S, Z = 2 * L;
        return d[A] < d[Z] || d[A] === d[Z] && N[S] <= N[L];
      }
      function lt(d, S, L) {
        for (var N = d.heap[L], A = L << 1; A <= d.heap_len && (A < d.heap_len && ut(S, d.heap[A + 1], d.heap[A], d.depth) && A++, !ut(S, N, d.heap[A], d.depth)); ) d.heap[L] = d.heap[A], L = A, A <<= 1;
        d.heap[L] = N;
      }
      function _t(d, S, L) {
        var N, A, Z, K, G = 0;
        if (d.last_lit !== 0) for (; N = d.pending_buf[d.d_buf + 2 * G] << 8 | d.pending_buf[d.d_buf + 2 * G + 1], A = d.pending_buf[d.l_buf + G], G++, N === 0 ? q(d, A, S) : (q(d, (Z = r[A]) + _ + 1, S), (K = P[Z]) !== 0 && V(d, A -= B[Z], K), q(d, Z = I(--N), L), (K = U[Z]) !== 0 && V(d, N -= j[Z], K)), G < d.last_lit; ) ;
        q(d, x, S);
      }
      function gt(d, S) {
        var L, N, A, Z = S.dyn_tree, K = S.stat_desc.static_tree, G = S.stat_desc.has_stree, Y = S.stat_desc.elems, at = -1;
        for (d.heap_len = 0, d.heap_max = i, L = 0; L < Y; L++) Z[2 * L] !== 0 ? (d.heap[++d.heap_len] = at = L, d.depth[L] = 0) : Z[2 * L + 1] = 0;
        for (; d.heap_len < 2; ) Z[2 * (A = d.heap[++d.heap_len] = at < 2 ? ++at : 0)] = 1, d.depth[A] = 0, d.opt_len--, G && (d.static_len -= K[2 * A + 1]);
        for (S.max_code = at, L = d.heap_len >> 1; 1 <= L; L--) lt(d, Z, L);
        for (A = Y; L = d.heap[1], d.heap[1] = d.heap[d.heap_len--], lt(d, Z, 1), N = d.heap[1], d.heap[--d.heap_max] = L, d.heap[--d.heap_max] = N, Z[2 * A] = Z[2 * L] + Z[2 * N], d.depth[A] = (d.depth[L] >= d.depth[N] ? d.depth[L] : d.depth[N]) + 1, Z[2 * L + 1] = Z[2 * N + 1] = A, d.heap[1] = A++, lt(d, Z, 1), 2 <= d.heap_len; ) ;
        d.heap[--d.heap_max] = d.heap[1], function(nt, mt) {
          var xt, yt, St, ht, At, Dt, bt = mt.dyn_tree, Bt = mt.max_code, Ut = mt.stat_desc.static_tree, Wt = mt.stat_desc.has_stree, jt = mt.stat_desc.extra_bits, Lt = mt.stat_desc.extra_base, Et = mt.stat_desc.max_length, It = 0;
          for (ht = 0; ht <= f; ht++) nt.bl_count[ht] = 0;
          for (bt[2 * nt.heap[nt.heap_max] + 1] = 0, xt = nt.heap_max + 1; xt < i; xt++) Et < (ht = bt[2 * bt[2 * (yt = nt.heap[xt]) + 1] + 1] + 1) && (ht = Et, It++), bt[2 * yt + 1] = ht, Bt < yt || (nt.bl_count[ht]++, At = 0, Lt <= yt && (At = jt[yt - Lt]), Dt = bt[2 * yt], nt.opt_len += Dt * (ht + At), Wt && (nt.static_len += Dt * (Ut[2 * yt + 1] + At)));
          if (It !== 0) {
            do {
              for (ht = Et - 1; nt.bl_count[ht] === 0; ) ht--;
              nt.bl_count[ht]--, nt.bl_count[ht + 1] += 2, nt.bl_count[Et]--, It -= 2;
            } while (0 < It);
            for (ht = Et; ht !== 0; ht--) for (yt = nt.bl_count[ht]; yt !== 0; ) Bt < (St = nt.heap[--xt]) || (bt[2 * St + 1] !== ht && (nt.opt_len += (ht - bt[2 * St + 1]) * bt[2 * St], bt[2 * St + 1] = ht), yt--);
          }
        }(d, S), dt(Z, at, d.bl_count);
      }
      function t(d, S, L) {
        var N, A, Z = -1, K = S[1], G = 0, Y = 7, at = 4;
        for (K === 0 && (Y = 138, at = 3), S[2 * (L + 1) + 1] = 65535, N = 0; N <= L; N++) A = K, K = S[2 * (N + 1) + 1], ++G < Y && A === K || (G < at ? d.bl_tree[2 * A] += G : A !== 0 ? (A !== Z && d.bl_tree[2 * A]++, d.bl_tree[2 * C]++) : G <= 10 ? d.bl_tree[2 * E]++ : d.bl_tree[2 * D]++, Z = A, at = (G = 0) === K ? (Y = 138, 3) : A === K ? (Y = 6, 3) : (Y = 7, 4));
      }
      function F(d, S, L) {
        var N, A, Z = -1, K = S[1], G = 0, Y = 7, at = 4;
        for (K === 0 && (Y = 138, at = 3), N = 0; N <= L; N++) if (A = K, K = S[2 * (N + 1) + 1], !(++G < Y && A === K)) {
          if (G < at) for (; q(d, A, d.bl_tree), --G != 0; ) ;
          else A !== 0 ? (A !== Z && (q(d, A, d.bl_tree), G--), q(d, C, d.bl_tree), V(d, G - 3, 2)) : G <= 10 ? (q(d, E, d.bl_tree), V(d, G - 3, 3)) : (q(d, D, d.bl_tree), V(d, G - 11, 7));
          Z = A, at = (G = 0) === K ? (Y = 138, 3) : A === K ? (Y = 6, 3) : (Y = 7, 4);
        }
      }
      h(j);
      var O = !1;
      function m(d, S, L, N) {
        V(d, (w << 1) + (N ? 1 : 0), 3), function(A, Z, K, G) {
          st(A), J(A, K), J(A, ~K), s.arraySet(A.pending_buf, A.window, Z, K, A.pending), A.pending += K;
        }(d, S, L);
      }
      u._tr_init = function(d) {
        O || (function() {
          var S, L, N, A, Z, K = new Array(f + 1);
          for (A = N = 0; A < b - 1; A++) for (B[A] = N, S = 0; S < 1 << P[A]; S++) r[N++] = A;
          for (r[N - 1] = A, A = Z = 0; A < 16; A++) for (j[A] = Z, S = 0; S < 1 << U[A]; S++) R[Z++] = A;
          for (Z >>= 7; A < a; A++) for (j[A] = Z << 7, S = 0; S < 1 << U[A] - 7; S++) R[256 + Z++] = A;
          for (L = 0; L <= f; L++) K[L] = 0;
          for (S = 0; S <= 143; ) X[2 * S + 1] = 8, S++, K[8]++;
          for (; S <= 255; ) X[2 * S + 1] = 9, S++, K[9]++;
          for (; S <= 279; ) X[2 * S + 1] = 7, S++, K[7]++;
          for (; S <= 287; ) X[2 * S + 1] = 8, S++, K[8]++;
          for (dt(X, v + 1, K), S = 0; S < a; S++) k[2 * S + 1] = 5, k[2 * S] = ot(S, 5);
          tt = new Q(X, P, _ + 1, v, f), W = new Q(k, U, 0, a, f), et = new Q(new Array(0), T, 0, g, y);
        }(), O = !0), d.l_desc = new z(d.dyn_ltree, tt), d.d_desc = new z(d.dyn_dtree, W), d.bl_desc = new z(d.bl_tree, et), d.bi_buf = 0, d.bi_valid = 0, rt(d);
      }, u._tr_stored_block = m, u._tr_flush_block = function(d, S, L, N) {
        var A, Z, K = 0;
        0 < d.level ? (d.strm.data_type === 2 && (d.strm.data_type = function(G) {
          var Y, at = 4093624447;
          for (Y = 0; Y <= 31; Y++, at >>>= 1) if (1 & at && G.dyn_ltree[2 * Y] !== 0) return o;
          if (G.dyn_ltree[18] !== 0 || G.dyn_ltree[20] !== 0 || G.dyn_ltree[26] !== 0) return n;
          for (Y = 32; Y < _; Y++) if (G.dyn_ltree[2 * Y] !== 0) return n;
          return o;
        }(d)), gt(d, d.l_desc), gt(d, d.d_desc), K = function(G) {
          var Y;
          for (t(G, G.dyn_ltree, G.l_desc.max_code), t(G, G.dyn_dtree, G.d_desc.max_code), gt(G, G.bl_desc), Y = g - 1; 3 <= Y && G.bl_tree[2 * M[Y] + 1] === 0; Y--) ;
          return G.opt_len += 3 * (Y + 1) + 5 + 5 + 4, Y;
        }(d), A = d.opt_len + 3 + 7 >>> 3, (Z = d.static_len + 3 + 7 >>> 3) <= A && (A = Z)) : A = Z = L + 5, L + 4 <= A && S !== -1 ? m(d, S, L, N) : d.strategy === 4 || Z === A ? (V(d, 2 + (N ? 1 : 0), 3), _t(d, X, k)) : (V(d, 4 + (N ? 1 : 0), 3), function(G, Y, at, nt) {
          var mt;
          for (V(G, Y - 257, 5), V(G, at - 1, 5), V(G, nt - 4, 4), mt = 0; mt < nt; mt++) V(G, G.bl_tree[2 * M[mt] + 1], 3);
          F(G, G.dyn_ltree, Y - 1), F(G, G.dyn_dtree, at - 1);
        }(d, d.l_desc.max_code + 1, d.d_desc.max_code + 1, K + 1), _t(d, d.dyn_ltree, d.dyn_dtree)), rt(d), N && st(d);
      }, u._tr_tally = function(d, S, L) {
        return d.pending_buf[d.d_buf + 2 * d.last_lit] = S >>> 8 & 255, d.pending_buf[d.d_buf + 2 * d.last_lit + 1] = 255 & S, d.pending_buf[d.l_buf + d.last_lit] = 255 & L, d.last_lit++, S === 0 ? d.dyn_ltree[2 * L]++ : (d.matches++, S--, d.dyn_ltree[2 * (r[L] + _ + 1)]++, d.dyn_dtree[2 * I(S)]++), d.last_lit === d.lit_bufsize - 1;
      }, u._tr_align = function(d) {
        V(d, 2, 3), q(d, x, X), function(S) {
          S.bi_valid === 16 ? (J(S, S.bi_buf), S.bi_buf = 0, S.bi_valid = 0) : 8 <= S.bi_valid && (S.pending_buf[S.pending++] = 255 & S.bi_buf, S.bi_buf >>= 8, S.bi_valid -= 8);
        }(d);
      };
    }, { "../utils/common": 41 }], 53: [function(e, p, u) {
      p.exports = function() {
        this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = "", this.state = null, this.data_type = 2, this.adler = 0;
      };
    }, {}], 54: [function(e, p, u) {
      (function(s) {
        (function(o, n) {
          if (!o.setImmediate) {
            var h, w, b, _, v = 1, a = {}, g = !1, i = o.document, f = Object.getPrototypeOf && Object.getPrototypeOf(o);
            f = f && f.setTimeout ? f : o, h = {}.toString.call(o.process) === "[object process]" ? function(C) {
              process.nextTick(function() {
                y(C);
              });
            } : function() {
              if (o.postMessage && !o.importScripts) {
                var C = !0, E = o.onmessage;
                return o.onmessage = function() {
                  C = !1;
                }, o.postMessage("", "*"), o.onmessage = E, C;
              }
            }() ? (_ = "setImmediate$" + Math.random() + "$", o.addEventListener ? o.addEventListener("message", x, !1) : o.attachEvent("onmessage", x), function(C) {
              o.postMessage(_ + C, "*");
            }) : o.MessageChannel ? ((b = new MessageChannel()).port1.onmessage = function(C) {
              y(C.data);
            }, function(C) {
              b.port2.postMessage(C);
            }) : i && "onreadystatechange" in i.createElement("script") ? (w = i.documentElement, function(C) {
              var E = i.createElement("script");
              E.onreadystatechange = function() {
                y(C), E.onreadystatechange = null, w.removeChild(E), E = null;
              }, w.appendChild(E);
            }) : function(C) {
              setTimeout(y, 0, C);
            }, f.setImmediate = function(C) {
              typeof C != "function" && (C = new Function("" + C));
              for (var E = new Array(arguments.length - 1), D = 0; D < E.length; D++) E[D] = arguments[D + 1];
              var P = { callback: C, args: E };
              return a[v] = P, h(v), v++;
            }, f.clearImmediate = c;
          }
          function c(C) {
            delete a[C];
          }
          function y(C) {
            if (g) setTimeout(y, 0, C);
            else {
              var E = a[C];
              if (E) {
                g = !0;
                try {
                  (function(D) {
                    var P = D.callback, U = D.args;
                    switch (U.length) {
                      case 0:
                        P();
                        break;
                      case 1:
                        P(U[0]);
                        break;
                      case 2:
                        P(U[0], U[1]);
                        break;
                      case 3:
                        P(U[0], U[1], U[2]);
                        break;
                      default:
                        P.apply(n, U);
                    }
                  })(E);
                } finally {
                  c(C), g = !1;
                }
              }
            }
          }
          function x(C) {
            C.source === o && typeof C.data == "string" && C.data.indexOf(_) === 0 && y(+C.data.slice(_.length));
          }
        })(typeof self > "u" ? s === void 0 ? this : s : self);
      }).call(this, typeof Ot < "u" ? Ot : typeof self < "u" ? self : typeof window < "u" ? window : {});
    }, {}] }, {}, [10])(10);
  });
})(Nt);
var Gt = Nt.exports;
const qt = /* @__PURE__ */ Ht(Gt), ct = class ct {
  constructor(l, e, p) {
    $(this, "idref");
    $(this, "href");
    $(this, "cfi");
    $(this, "linear");
    $(this, "page_spread");
    $(this, "rendition_viewport");
    $(this, "rendition_spread");
    $(this, "rendition_orientation");
    $(this, "rendition_layout");
    $(this, "rendition_flow");
    $(this, "media_overlay_id");
    $(this, "media_type");
    $(this, "index");
    $(this, "spine");
    this.idref = l.idref, this.href = l.href, this.cfi = l.cfi, this.linear = l.linear ? l.linear.toLowerCase() : "yes", this.page_spread = l.page_spread, this.index = e, this.spine = p, this.rendition_viewport = l.rendition_viewport, this.rendition_spread = l.rendition_spread, this.rendition_layout = l.rendition_layout, this.rendition_flow = l.rendition_flow, this.media_type = l.media_type, this.media_overlay_id = l.media_overlay_id, this.validateSpread();
  }
  validateSpread() {
    this.page_spread && this.page_spread !== ct.SPREAD_LEFT && this.page_spread !== ct.SPREAD_RIGHT && this.page_spread !== ct.SPREAD_CENTER && console.warn(`${this.page_spread} is not a recognized spread type`);
  }
  // Helpers
  isReflowable() {
    return !this.isFixedLayout();
  }
  isFixedLayout() {
    const l = this.getRenditionLayout();
    return l ? l === ct.RENDITION_LAYOUT_PREPAGINATED : this.spine.package.isFixedLayout();
  }
  getRenditionLayout() {
    return this.rendition_layout || this.spine.package.rendition_layout;
  }
  // Additional methods based on legacy SpineItem.js...
  static alternateSpread(l) {
    return l === ct.SPREAD_LEFT ? ct.SPREAD_RIGHT : l === ct.SPREAD_RIGHT ? ct.SPREAD_LEFT : l;
  }
};
$(ct, "readonlyRENDITION_LAYOUT_REFLOWABLE", "reflowable"), $(ct, "RENDITION_LAYOUT_PREPAGINATED", "pre-paginated"), $(ct, "SPREAD_LEFT", "page-spread-left"), $(ct, "SPREAD_RIGHT", "page-spread-right"), $(ct, "SPREAD_CENTER", "page-spread-center"), $(ct, "SPREAD_NONE", "none"), $(ct, "SPREAD_AUTO", "auto"), $(ct, "FLOW_PAGINATED", "paginated"), $(ct, "FLOW_SCROLLED_CONTINUOUS", "scrolled-continuous"), $(ct, "FLOW_SCROLLED_DOC", "scrolled-doc"), $(ct, "FLOW_AUTO", "auto");
let Ft = ct;
class $t {
  // Default behavior
  constructor(l, e) {
    $(this, "package");
    $(this, "items", []);
    $(this, "direction", "ltr");
    $(this, "handleLinear", !0);
    this.package = l, e && (this.direction = e.direction || "ltr", e.items && e.items.forEach((p, u) => {
      this.items.push(new Ft(p, u, this));
    }));
  }
  isValidLinearItem(l) {
    if (l < 0 || l >= this.items.length) return !1;
    const e = this.items[l];
    return this.handleLinear ? e.linear !== "no" : !0;
  }
  item(l) {
    return this.items[l];
  }
  getItemByHref(l) {
    return this.items.find((e) => l.endsWith(e.href) || e.href.endsWith(l));
  }
  first() {
    return this.items[0];
  }
  firstLinear() {
    return this.items.find((l) => l.linear !== "no");
  }
  nextItem(l) {
    const e = l.index + 1;
    if (e < this.items.length) return this.items[e];
  }
  prevItem(l) {
    const e = l.index - 1;
    if (e >= 0) return this.items[e];
  }
  nextLinear(l) {
    let e = l.index + 1;
    for (; e < this.items.length; ) {
      if (this.items[e].linear !== "no") return this.items[e];
      e++;
    }
  }
  prevLinear(l) {
    let e = l.index - 1;
    for (; e >= 0; ) {
      if (this.items[e].linear !== "no") return this.items[e];
      e--;
    }
  }
  last() {
    return this.items[this.items.length - 1];
  }
}
class Vt {
  constructor(l) {
    $(this, "identifier");
    $(this, "title");
    $(this, "author");
    $(this, "description");
    $(this, "publisher");
    $(this, "language");
    $(this, "rights");
    $(this, "modifiedDate");
    $(this, "publishedDate");
    $(this, "epubVersion");
    l && (this.identifier = l.id, this.title = l.title, this.author = l.author, this.description = l.description, this.language = l.language, this.publisher = l.publisher, this.rights = l.rights, this.modifiedDate = l.modified_date, this.publishedDate = l.pubdate, this.epubVersion = l.epub_version);
  }
}
class Kt {
  constructor(l) {
    $(this, "rootUrl");
    $(this, "rootUrlMO");
    $(this, "spine");
    $(this, "metadata");
    // Add metadata
    $(this, "zip");
    // Add zip property
    $(this, "rendition_viewport");
    $(this, "rendition_layout");
    $(this, "rendition_flow");
    $(this, "rendition_orientation");
    $(this, "rendition_spread");
    $(this, "toc");
    this.rootUrl = l.rootUrl, this.rootUrlMO = l.rootUrlMO, this.rendition_layout = l.rendition_layout, this.rendition_flow = l.rendition_flow, this.rendition_spread = l.rendition_spread, this.spine = new $t(this, l.spine), this.metadata = new Vt(l.metadata), this.toc = l.toc, this.zip = l.zip || null;
  }
  resolveRelativeUrl(l) {
    return this.rootUrl ? this.rootUrl.endsWith("/") ? this.rootUrl + l : this.rootUrl + "/" + l : l;
  }
  isFixedLayout() {
    return this.rendition_layout === "pre-paginated";
  }
  async loadFile(l) {
    if (this.zip) {
      let e = this.zip.file(l);
      if (e) return await e.async("string");
      const p = this.resolveRelativeUrl(l), u = p.indexOf(".epub");
      if (u !== -1) {
        let s = p.substring(u + 5);
        if (s.startsWith("/") && (s = s.substring(1)), e = this.zip.file(s), e) return await e.async("string");
      }
      if (l.startsWith("/")) {
        const s = l.substring(1);
        if (e = this.zip.file(s), e) return await e.async("string");
      }
      return console.warn("File not found in zip:", l), null;
    } else {
      const e = this.resolveRelativeUrl(l), p = await fetch(e);
      return p.ok ? await p.text() : null;
    }
  }
  async loadBlob(l) {
    if (this.zip) {
      let e = this.zip.file(l);
      if (!e) {
        const p = this.resolveRelativeUrl(l), u = p.indexOf(".epub");
        if (u !== -1) {
          let s = p.substring(u + 5);
          s.startsWith("/") && (s = s.substring(1)), e = this.zip.file(s);
        }
      }
      return !e && l.startsWith("/") && (e = this.zip.file(l.substring(1))), e ? await e.async("blob") : null;
    } else {
      const e = this.resolveRelativeUrl(l), p = await fetch(e);
      return p.ok ? await p.blob() : null;
    }
  }
}
class Rt {
  static async load(l) {
    let e = null, p = async (_) => {
      const v = await fetch(l + (l.endsWith("/") ? "" : "/") + _);
      return v.ok ? v.text() : null;
    };
    if (l.toLowerCase().endsWith(".epub"))
      try {
        const v = await (await fetch(l)).arrayBuffer();
        e = await qt.loadAsync(v), p = async (g) => {
          const i = e == null ? void 0 : e.file(g);
          return i ? await i.async("string") : null;
        };
      } catch (_) {
        console.warn("Retrying as unzipped folder...", _);
      }
    const u = await p("META-INF/container.xml");
    if (!u) throw new Error("Could not find META-INF/container.xml");
    const s = new DOMParser(), n = s.parseFromString(u, "application/xml").querySelector("rootfile");
    if (!n) throw new Error("No rootfile in container.xml");
    const h = n.getAttribute("full-path");
    if (!h) throw new Error("No full-path in rootfile");
    const w = await p(h);
    if (!w) throw new Error("Could not find OPF: " + h);
    const b = s.parseFromString(w, "application/xml");
    return await Rt.parseOpf(b, l, h, p, e);
  }
  static async parseOpf(l, e, p, u, s) {
    var f, c, y, x, C, E;
    const o = l.querySelector("metadata"), n = l.querySelector("manifest"), h = l.querySelector("spine");
    if (!o || !n || !h) throw new Error("Invalid OPF");
    const w = {
      title: ((f = o.querySelector("title")) == null ? void 0 : f.textContent) || "Unknown Title",
      creator: ((c = o.querySelector("creator")) == null ? void 0 : c.textContent) || "",
      language: ((y = o.querySelector("language")) == null ? void 0 : y.textContent) || "",
      identifier: ((x = o.querySelector("identifier")) == null ? void 0 : x.textContent) || "",
      pubDate: ((C = o.querySelector("date")) == null ? void 0 : C.textContent) || ""
    }, b = {};
    n.querySelectorAll("item").forEach((D) => {
      const P = D.getAttribute("id"), U = D.getAttribute("href");
      P && U && (b[P] = U);
    });
    const _ = [], v = p.substring(0, p.lastIndexOf("/") + 1), a = e + v;
    h.querySelectorAll("itemref").forEach((D) => {
      const P = D.getAttribute("idref");
      P && b[P] && _.push({
        idref: P,
        href: b[P],
        // This is relative to OPF
        linear: D.getAttribute("linear") || "yes"
      });
    });
    let g = [];
    const i = h.getAttribute("toc");
    if (i && b[i]) {
      const D = b[i], U = p.substring(0, p.lastIndexOf("/") + 1) + D;
      try {
        const T = await u(U);
        if (T) {
          const X = new DOMParser().parseFromString(T, "application/xml");
          g = Rt.parseNcx(X);
        }
      } catch (T) {
        console.warn("Failed to parse NCX", T);
      }
    }
    return new Kt({
      rootUrl: a,
      // The root for resolving spine items
      metadata: w,
      spine: {
        items: _
      },
      toc: g,
      zip: s,
      rendition_layout: ((E = o.querySelector("meta[property='rendition:layout']")) == null ? void 0 : E.textContent) || "reflowable"
    });
  }
  static parseNcx(l) {
    const e = l.querySelector("navMap");
    if (!e) return [];
    const p = (u) => {
      const s = [];
      return Array.from(u.children).forEach((o) => {
        var n, h;
        if (o.tagName.toLowerCase() === "navpoint") {
          const w = ((n = o.querySelector("navLabel > text")) == null ? void 0 : n.textContent) || "Untitled", b = ((h = o.querySelector("content")) == null ? void 0 : h.getAttribute("src")) || "", _ = p(o);
          s.push({ name: w, Id_link: b, sub: _ });
        }
      }), s;
    };
    return p(e);
  }
}
class Yt {
  constructor(l) {
    $(this, "container");
    $(this, "epubPackage");
    $(this, "iframe");
    $(this, "internalWrapper");
    // Wrapper for responsive padding
    $(this, "resizeObserver");
    $(this, "isSingleImageMode", !1);
    // Pagination & Style State
    $(this, "columnGap", 40);
    $(this, "currentPageIndex", 0);
    $(this, "pageCount", 0);
    $(this, "currentSettings", {});
    $(this, "currentBookStyles", []);
    // Frame Management
    $(this, "frames", []);
    $(this, "isLoadingNext", !1);
    $(this, "activeFrameObserver", null);
    $(this, "currentItem");
    this.container = l, this.internalWrapper = document.createElement("div"), this.internalWrapper.classList.add("tr-internal-wrapper"), this.container.appendChild(this.internalWrapper), console.log("ReaderView: Internal wrapper created and appended", this.internalWrapper), this.container.addEventListener("scroll", this.onContainerScroll.bind(this)), this.resizeObserver = new ResizeObserver(() => {
      this.onContainerResize();
    }), this.resizeObserver.observe(this.container);
  }
  onContainerResize() {
    if (!this.iframe) return;
    let l = null;
    const e = this.currentSettings.scroll !== "scroll-continuous";
    if (e && this.iframe.contentDocument && (l = this.getVisibleElement()), this.updatePagination(this.iframe), l ? this.scrollToElement(l) : e && this.scrollToPage(this.currentPageIndex), this.currentSettings.scroll === "scroll-continuous" && this.isSingleImageMode) {
      const p = this.container.clientHeight, u = this.container.clientWidth;
      if (this.iframe.style.height = `${p}px`, this.iframe.contentDocument) {
        const s = this.iframe.contentDocument.getElementsByTagName("svg");
        if (s.length > 0) {
          const n = s[0];
          n.style.height = `${p}px`, n.style.width = `${u}px`, n.style.maxHeight = "100%", n.style.maxWidth = "100%";
        }
        const o = this.iframe.contentDocument.getElementsByTagName("img");
        if (o.length > 0) {
          const n = o[0];
          n.style.maxHeight = "100%", n.style.maxWidth = "100%";
        }
      }
      console.log("Syncing Single Image Height:", p);
    }
  }
  openBook(l) {
    this.epubPackage = l;
    const e = l.spine.firstLinear();
    e && this.openSpineItem(e);
  }
  // ... Methods ...
  // ... (rest of method)
  async openPageRight() {
    if (this.currentPageIndex < this.pageCount - 1)
      this.currentPageIndex++, this.scrollToPage(this.currentPageIndex);
    else {
      if (!this.epubPackage || !this.currentItem) return;
      const l = this.epubPackage.spine.nextLinear(this.currentItem);
      l && (this.currentPageIndex = 0, await this.openSpineItem(l));
    }
  }
  async openPageLeft() {
    if (this.currentPageIndex > 0)
      this.currentPageIndex--, this.scrollToPage(this.currentPageIndex);
    else {
      if (!this.epubPackage || !this.currentItem) return;
      const l = this.epubPackage.spine.prevLinear(this.currentItem);
      l && (this.currentPageIndex = -1, await this.openSpineItem(l));
    }
  }
  async openSpineItem(l, e = !1) {
    e || (this.internalWrapper.innerHTML = "", this.frames = [], this.iframe = void 0);
    const p = document.createElement("iframe");
    if (p.style.width = "100%", p.style.border = "none", this.currentSettings.scroll === "scroll-continuous" ? (p.style.height = "100vh", p.scrolling = "no", this.container.style.overflowY = "auto") : (p.style.height = "100%", this.container.style.overflowY = "hidden"), this.internalWrapper.appendChild(p), this.frames.push({ item: l, element: p }), e || (this.iframe = p), this.epubPackage) {
      let u = null;
      if (l.media_type && l.media_type.startsWith("image/")) {
        const s = await this.epubPackage.loadBlob(l.href);
        s && (u = `<!DOCTYPE html>
                    <html style="height:100%"><head>
                        <title>Image Content</title>
                        <style>
                            body { margin:0; padding:0; height:100%; display:flex; 
                                   align-items:center; justify-content:center; }
                            img { max-height:100%; max-width:100%; object-fit:contain; }
                        </style>
                    </head><body>
                        <img src="${URL.createObjectURL(s)}">
                    </body></html>`);
      } else
        u = await this.epubPackage.loadFile(l.href), u && this.epubPackage.zip && (u = await this.injectResources(u, l.href));
      u ? (p.srcdoc = u, p.onload = () => {
        this.initFrameContent(p);
      }, console.log(`Loading spine item: ${l.href}`), e || (this.currentItem = l)) : console.error("Failed to load content for", l.href);
    }
  }
  onContainerScroll() {
    if (this.currentSettings.scroll !== "scroll-continuous" || this.isLoadingNext) return;
    const { scrollTop: l, scrollHeight: e, clientHeight: p } = this.container;
    l + p > e - 500 && this.loadNextChapter();
  }
  async loadNextChapter() {
    if (!this.epubPackage || !this.frames.length) return;
    const l = this.frames[this.frames.length - 1], e = this.epubPackage.spine.nextLinear(l.item);
    e && (console.log("Auto-loading next chapter:", e.href), this.isLoadingNext = !0, await this.openSpineItem(e, !0), this.isLoadingNext = !1);
  }
  initFrameContent(l) {
    if (!l || !l.contentDocument) return;
    const e = l.contentDocument, p = e.documentElement, u = e.body;
    u.addEventListener("click", (b) => {
      let _ = b.target;
      for (; _ && _ !== u && _.tagName !== "A"; )
        _ = _.parentElement;
      if (_ && _.tagName === "A") {
        const v = _.getAttribute("href");
        v && (b.preventDefault(), this.handleLinkClick(v));
      }
    }), this.applySettingsToDoc(e, l), this.applyStylesToFrame(l);
    const s = u.getElementsByTagName("img"), o = u.getElementsByTagName("svg"), h = (u.textContent || "").replace(/\s/g, "").length < 50;
    let w = !1;
    if (s.length === 1 && o.length === 0 && h || o.length === 1 && s.length === 0 && h) {
      if (w = !0, console.log("Detected Single Image / Cover Page. Applying 'Contain' styles."), p.style.height = "100%", u.style.height = "100%", u.style.margin = "0", u.style.display = "flex", u.style.flexDirection = "column", u.style.justifyContent = "center", u.style.alignItems = "center", u.style.overflow = "hidden", s.length > 0) {
        const b = s[0];
        b.style.maxWidth = "100%", b.style.maxHeight = "100%", b.style.objectFit = "contain", b.style.margin = "0 auto", b.style.display = "block";
      } else if (o.length > 0) {
        const b = o[0];
        b.style.width = "100%", b.style.height = "100%", b.style.maxHeight = "100%", b.style.maxWidth = "100%", b.style.margin = "0 auto", b.style.display = "block", b.style.backgroundColor = "transparent", this.currentSettings.scroll === "scroll-continuous" && (b.style.height = "100vh", b.style.maxHeight = "100vh");
      }
    }
    this.isSingleImageMode = w, this.updatePagination(l), window.addEventListener("resize", () => {
      this.updatePagination(l);
    }), this.setupFrameHeightLogic(l, w), this.currentSettings.scroll !== "scroll-continuous" && this.currentPageIndex < 0 && (this.currentPageIndex = this.pageCount - 1, this.scrollToPage(this.currentPageIndex));
  }
  updateSettings(l) {
    let e = null;
    this.currentSettings.scroll !== "scroll-continuous" && this.iframe && (e = this.getVisibleElement()), this.currentSettings = { ...this.currentSettings, ...l }, this.frames.forEach((p) => {
      p.element.contentDocument && (this.setupFrameHeightLogic(p.element, this.isSingleImageMode), this.applySettingsToDoc(p.element.contentDocument, p.element), this.updatePagination(p.element));
    }), e && this.iframe && (console.log("Restoring position to anchor element:", e), this.scrollToElement(e)), this.currentSettings.scroll === "scroll-continuous" ? this.container.style.overflowY = "auto" : (this.container.style.overflowY = "hidden", this.activeFrameObserver && (this.activeFrameObserver.disconnect(), this.activeFrameObserver = null));
  }
  getVisibleElement() {
    if (!this.iframe || !this.iframe.contentDocument) return null;
    const e = this.iframe.contentDocument.body, p = this.iframe.clientWidth, u = Array.from(e.querySelectorAll("p, h1, h2, h3, h4, h5, h6, li, blockquote, div"));
    for (const s of u) {
      const o = s.getBoundingClientRect();
      if (o.left >= -50 && o.top >= 0 && o.left < p)
        return s;
    }
    return null;
  }
  scrollToElement(l) {
    if (!this.iframe || !this.iframe.contentDocument) return;
    const e = this.iframe.contentDocument.documentElement, p = Math.abs(parseFloat(e.style.left || "0")), s = l.getBoundingClientRect().left + p, n = this.iframe.clientWidth + this.columnGap, h = Math.floor(s / n);
    console.log(`Restoring Element: absoluteLeft=${s}, newPageIndex=${h}`), this.currentPageIndex = h, this.currentPageIndex >= this.pageCount && (this.currentPageIndex = this.pageCount - 1), this.currentPageIndex < 0 && (this.currentPageIndex = 0), this.scrollToPage(this.currentPageIndex);
  }
  setBookStyles(l) {
    this.currentBookStyles = l;
    const e = document.querySelector(".tr-epub-reader-element"), p = l.find((u) => u.selector === "body" || u.selector === ":not(a):not(hypothesis-highlight)") || (l.length > 0 ? l[0] : null);
    console.log("setBookStyles: Applying styles to container. Found element:", !!e, e), console.log("setBookStyles: Body style found:", p), e ? p && p.declarations && p.declarations.backgroundColor ? (console.log("setBookStyles: Setting background color to", p.declarations.backgroundColor), e.style.backgroundColor = p.declarations.backgroundColor) : (console.log("setBookStyles: Clearing background color"), e.style.backgroundColor = "") : console.warn("setBookStyles: .tr-epub-reader-element NOT FOUND in DOM"), this.frames.forEach((u) => {
      this.applyStylesToFrame(u.element);
    });
  }
  applyStylesToFrame(l) {
    if (!l || !l.contentDocument) return;
    const e = l.contentDocument, p = e.getElementById("readium-theme-style");
    p && p.remove();
    const u = e.createElement("style");
    u.id = "readium-theme-style";
    let s = "";
    this.currentBookStyles && this.currentBookStyles.length > 0 && this.currentBookStyles.forEach((o) => {
      let n = "";
      for (const [h, w] of Object.entries(o.declarations)) {
        const b = h.replace(/[A-Z]/g, (_) => "-" + _.toLowerCase());
        n += `${b}: ${w} !important; `;
      }
      s += `${o.selector} { ${n} } 
`;
    }), s += `
                img { max-width: 100%; box-sizing: border-box; break-inside: avoid; page-break-inside: avoid; }
                p, h1, h2, h3, h4, h5, h6 { break-inside: avoid; page-break-inside: avoid; }
                
                /* User Request: Force specific EPUB cover class to be transparent */
                .x-ebookmaker-cover { background-color: transparent !important; background: transparent !important; }

                /* User Request: Hide Scrollbars inside iframe (Horizontal & Vertical) */
                html, body {
                    scrollbar-width: none; /* Firefox */
                    -ms-overflow-style: none; /* IE/Edge */
                }
                html::-webkit-scrollbar, body::-webkit-scrollbar {
                    display: none; /* Chrome/Safari */
                }
            `, u.textContent = s, e.head.appendChild(u);
  }
  applySettingsToDoc(l, e) {
    const p = l.documentElement, u = l.body;
    this.currentSettings.fontSize && (p.style.fontSize = `${this.currentSettings.fontSize}%`);
    const s = this.iframe.clientWidth, o = this.iframe.clientHeight, n = this.currentSettings.scroll === "scroll-continuous";
    if (e.style.borderLeft = "0", e.style.borderRight = "0", n) {
      if (this.isSingleImageMode) {
        p.style.height = "100%", p.style.width = "100%", p.style.overflow = "hidden", u.style.height = "100%", u.style.overflow = "hidden";
        const h = u.querySelector("svg");
        h && (h.style.height = "100vh", h.style.maxHeight = "100vh");
      } else
        p.style.height = "auto", p.style.width = "100vw", p.style.overflowY = "auto";
      p.style.overflowX = "hidden", u.style.height = "auto", u.style.overflowY = "visible", p.style.columnWidth = "auto", p.style.columnGap = "0", p.style.position = "static", p.style.left = "0", e.style.overflow = "hidden";
    } else {
      e.style.height = "100%", p.style.height = `${o}px`, p.style.width = "100%", p.style.position = "relative", p.style.margin = "0", p.style.padding = "0", p.style.top = "0", p.style.left = "0";
      const h = s > o, w = this.currentSettings.syntheticSpread;
      let b = w === "double";
      if ((!w || w === "auto") && (b = h && s > 800), b) {
        const _ = (s - this.columnGap) / 2;
        p.style.columnWidth = `${_}px`;
      } else
        p.style.columnWidth = `${s - this.columnGap}px`;
      p.style.columnGap = `${this.columnGap}px`, p.style.columnFill = "auto", u.style.margin = "0", u.style.padding = "0", e && (e.style.overflow = "hidden");
    }
  }
  setupFrameHeightLogic(l, e) {
    var s;
    const p = l.contentDocument;
    if (!p) return;
    const u = p.body;
    if (this.currentSettings.scroll === "scroll-continuous")
      if (e)
        this.activeFrameObserver && (this.activeFrameObserver.disconnect(), this.activeFrameObserver = null), l.style.height = "100%", l.scrolling = "no";
      else {
        const o = () => {
          if (this.currentSettings.scroll !== "scroll-continuous") {
            l.style.height = "100%", this.activeFrameObserver && (this.activeFrameObserver.disconnect(), this.activeFrameObserver = null);
            return;
          }
          if (l.contentDocument) {
            const n = l.contentDocument.documentElement.scrollHeight;
            l.style.height = `${n}px`;
          }
        };
        this.activeFrameObserver && this.activeFrameObserver.disconnect(), this.activeFrameObserver = new ResizeObserver(o), this.activeFrameObserver.observe(u), setTimeout(o, 100), (s = l.contentWindow) == null || s.addEventListener("load", o);
      }
    else
      this.activeFrameObserver && (this.activeFrameObserver.disconnect(), this.activeFrameObserver = null), l.style.height = "100%";
  }
  handleLinkClick(l) {
    if (console.log("Internal link clicked:", l), l.startsWith("http")) {
      window.open(l, "_blank");
      return;
    }
    if (this.currentItem) {
      if (l.startsWith("#")) {
        this.scrollToAnchor(l.substring(1));
        return;
      }
      const e = this.resolvePath(this.currentItem.href, l);
      console.log("Resolved link path:", e), this.openContentUrl(e);
    }
  }
  updatePagination(l) {
    if (!l || !l.contentDocument || this.currentSettings.scroll === "scroll-continuous") return;
    console.log("updatePagination executing..."), l.style.height = "100%", l.style.width = "100%";
    const e = l.contentDocument.documentElement, p = l.clientWidth, u = e.scrollWidth;
    this.pageCount = Math.ceil(u / (p + this.columnGap)), this.pageCount === 0 && (this.pageCount = 1), console.log(`Pagination: ${u} / ${p} = ${this.pageCount} pages`), this.currentPageIndex >= this.pageCount && (this.currentPageIndex = this.pageCount - 1), this.currentPageIndex < 0 && (this.currentPageIndex = 0), this.scrollToPage(this.currentPageIndex);
  }
  scrollToPage(l) {
    if (!this.iframe || !this.iframe.contentDocument) return;
    const e = this.iframe.contentDocument.documentElement, p = this.iframe.clientWidth, u = l * (p + this.columnGap);
    console.log(`scrollToPage: index=${l}, offset=${u}`), e.style.left = `-${u}px`;
  }
  async openContentUrl(l) {
    if (!this.epubPackage) return;
    console.log("ReaderView.openContentUrl called with:", l);
    const [e, p] = l.split("#");
    console.log("Looking for spine item with path:", e);
    const u = this.epubPackage.spine.getItemByHref(e);
    if (u) {
      if (console.log("Found item:", u), this.currentItem && this.currentItem.href === u.href) {
        p && this.scrollToAnchor(p);
        return;
      }
      this.currentPageIndex = 0, await this.openSpineItem(u), p && setTimeout(() => {
        this.scrollToAnchor(p);
      }, 100);
    } else
      console.warn("Item not found for href", l), console.log("Available spine items:", this.epubPackage.spine.items.map((s) => s.href));
  }
  scrollToAnchor(l) {
    if (!this.iframe || !this.iframe.contentDocument) return;
    const e = this.iframe.contentDocument, p = e.getElementById(l);
    if (p) {
      const u = e.documentElement, s = Math.abs(parseFloat(u.style.left || "0")), n = p.getBoundingClientRect().left + s, w = this.iframe.clientWidth + this.columnGap;
      if (this.currentSettings.scroll === "scroll-continuous") {
        p.scrollIntoView();
        return;
      }
      let b = Math.floor(n / w);
      console.log(`Scrolling to anchor #${l}: absLeft=${n}, pageIndex=${b}`), this.currentPageIndex = b, this.currentPageIndex >= this.pageCount && (this.currentPageIndex = this.pageCount - 1), this.currentPageIndex < 0 && (this.currentPageIndex = 0), this.scrollToPage(this.currentPageIndex);
    } else
      console.warn(`Anchor element #${l} not found`);
  }
  async injectResources(l, e) {
    var h, w, b;
    const u = new DOMParser().parseFromString(l, "text/html"), s = Array.from(u.querySelectorAll("img"));
    for (const _ of s) {
      const v = _.getAttribute("src");
      if (v && !v.startsWith("http") && !v.startsWith("data:")) {
        const a = this.resolvePath(e, v), g = await ((h = this.epubPackage) == null ? void 0 : h.loadBlob(a));
        g && (_.src = URL.createObjectURL(g));
      }
    }
    const o = Array.from(u.querySelectorAll("image"));
    for (const _ of o) {
      const v = _.getAttribute("xlink:href") || _.getAttribute("href");
      if (v && !v.startsWith("http") && !v.startsWith("data:")) {
        const a = this.resolvePath(e, v), g = await ((w = this.epubPackage) == null ? void 0 : w.loadBlob(a));
        g && (_.setAttribute("xlink:href", URL.createObjectURL(g)), _.setAttribute("href", URL.createObjectURL(g)));
      }
    }
    const n = Array.from(u.querySelectorAll('link[rel="stylesheet"]'));
    for (const _ of n) {
      const v = _.getAttribute("href");
      if (v && !v.startsWith("http")) {
        const a = this.resolvePath(e, v), g = await ((b = this.epubPackage) == null ? void 0 : b.loadFile(a));
        if (g) {
          const i = u.createElement("style");
          i.textContent = g, _.replaceWith(i);
        }
      }
    }
    return u.documentElement.outerHTML;
  }
  resolvePath(l, e) {
    try {
      if (e.startsWith("/")) return e.substring(1);
      const p = l.split("/");
      p.pop();
      const u = e.split("/");
      for (const s of u)
        s !== "." && (s === ".." ? p.pop() : p.push(s));
      return p.join("/");
    } catch {
      return console.error("Path resolution error", l, e), e;
    }
  }
}
const it = {
  readium: null,
  readerView: null,
  // Added property
  currentPackageDocument: null,
  ebookURL_filepath: null,
  embeded: !0,
  init: (H) => {
    console.log("Initializing Modern TreineticEpubReader..."), ft.init();
    let l;
    return typeof H == "string" ? l = document.querySelector(H) : l = H, l ? (it.initReader(l), pt.getInstance()) : (console.error("TreineticEpubReader: Element not found", H), null);
  },
  /**
   * Alias for init() to align with standard library patterns.
   */
  create: (H) => it.init(H),
  open: (H) => {
    console.log("Opening: ", H);
    const l = it.setReaderPreferences();
    it.ebookURL_filepath = H;
    const e = it.getOpenPageRequest(l, H);
    let p = { syntheticSpread: "auto", scroll: "auto" };
    it.embeded && l && l.reader && (p = l.reader), it.loadEpub(p, H, e);
  },
  initReader: (H) => {
    H.classList.add("tr-epub-reader-element");
    const l = it.setReaderPreferences();
    it.readerView = new Yt(H), ft.init(), ft.on(ft.PageNext, "reader", () => it.nextPage()), ft.on(ft.PagePrevious, "reader", () => it.prevPage());
    let e = { syntheticSpread: "auto", scroll: "auto" };
    it.embeded && l && l.reader && (e = l.reader), wt.updateReader(it.readerView, e);
  },
  handleReaderEvents: () => {
    var u, s, o;
    if (!it.readium) return;
    const H = it.readium.reader, l = ((u = ReadiumSDK == null ? void 0 : ReadiumSDK.Events) == null ? void 0 : u.CONTENT_DOCUMENT_LOAD_START) || "CONTENT_DOCUMENT_LOAD_START", e = ((s = ReadiumSDK == null ? void 0 : ReadiumSDK.Events) == null ? void 0 : s.CONTENT_DOCUMENT_LOADED) || "CONTENT_DOCUMENT_LOADED", p = ((o = ReadiumSDK == null ? void 0 : ReadiumSDK.Events) == null ? void 0 : o.PAGINATION_CHANGED) || "PAGINATION_CHANGED";
    H.on(l, (n, h) => {
      console.log("Event: Load Start");
    }), H.on(e, (n, h) => {
      console.log("Event: Loaded");
    }), H.on(p, (n) => {
      console.log("Event: Pagination Changed"), pt.getInstance().isAutoBookmark() && it.savePlace();
    });
  },
  loadEpub: async (H, l, e) => {
    try {
      console.log("Loading epub via modern parser:", l);
      const p = await Rt.load(l);
      it.readerView && (it.readerView.openBook(p), it.currentPackageDocument = p, p.toc && pt.getInstance().onTOCLoad(p.toc), pt.getInstance().epubLoaded(
        p.metadata,
        p,
        it.readerView
      ));
    } catch (p) {
      console.error("Failed to load epub", p), pt.getInstance().epubFailed("Indeterminate error");
    }
  },
  setReaderPreferences: () => {
    let H = Ct.get("reader") || { fontSize: 100, theme: "default-theme", scroll: "auto" };
    return H.scroll === "scroll-continuous" && (H.scroll = "auto"), Ct.put("reader", H), { reader: H };
  },
  getOpenPageRequest: (H, l) => null,
  savePlace: () => {
  },
  // Public API Methods (proxied to handler/helpers)
  nextPage: () => pt.getInstance().nextPage(),
  prevPage: () => pt.getInstance().prevPage(),
  goToPage: (H) => pt.getInstance().goToPage(H),
  setTheme: (H) => {
    pt.getInstance().setTheme(H);
  },
  registerTheme: (H) => {
    Pt.getInstance().registerTheme(H);
  },
  setFontSize: (H) => {
    pt.getInstance().changeFontSize(H);
  },
  setScrollOption: (H) => {
    pt.getInstance().setScrollOption(H);
  },
  clearSettings: () => {
    Ct.clear("reader"), console.log("Reader settings cleared.");
  }
}, Jt = it.create, Qt = it.init, te = it.open, ee = it.setScrollOption, re = it.setTheme, ne = it.registerTheme, ie = it.clearSettings, se = it.setFontSize, ae = it.goToPage, oe = it.nextPage, le = it.prevPage;
export {
  ie as clearSettings,
  Jt as create,
  it as default,
  ae as goToPage,
  Qt as init,
  oe as nextPage,
  te as open,
  le as prevPage,
  ne as registerTheme,
  se as setFontSize,
  ee as setScrollOption,
  re as setTheme
};
