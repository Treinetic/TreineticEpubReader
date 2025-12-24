define([],function () {

    var _ob= {};

    getRootOL = function(dom){
        var root = $("<div></div>").append(dom);
        if(root.find("ol[xmlns]").length){
            return root.find("ol[xmlns]");
        }else{
            return root.find("ol").first();
        }
    };



     function findRecursively(ol){
        var ob = [];
        ol.find('> li').each(function(i,item){
            var anchor = $(item).find("> a");
            var tocItem = createTOCItem(anchor);
            ob.push(tocItem);
            if($(item).find("> ol").length > 0){
                tocItem.sub = (findRecursively($(item).find("> ol")));
            }
        });
        return ob;
    }

    createTOCItem =  function(a){
        return {
            Id_link : a.attr("href"),
            name : a.html(),
            sub : []
        }
    };

    _ob.createTOCJson = function(toc){
        if(toc){
            var rootOl = getRootOL(toc);
            return findRecursively(rootOl);
        }
        return [];
    };

    _ob.getFixedTocElement = function (dom) {
        $('script', dom).remove();
        var tocNav;
        var $navs = $('nav', dom);
        Array.prototype.every.call($navs, function (nav) {
            if (nav.getAttributeNS('http://www.idpf.org/2007/ops', 'type') == 'toc') {
                tocNav = nav;
                return false;
            }
            return true;
        });
        var toc = (tocNav && $(tocNav).html()) || $('body', dom).html() || $(dom).html();
        return (toc && toc.length)  ? $(toc) : null;
    };

    return _ob;

});
