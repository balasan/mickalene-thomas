var flexImages = (function(){
    // "use strict";
    function flexImages(options){
        if (!document.querySelector) return;

        var self = this;

        function makeGrid(grid, items, o, noresize){
            var x, new_w, exact_w, ratio = 1, rows = 1, max_w = grid.clientWidth-2, row = [], row_width = 0, h, row_h = o.rowHeight;

            // define inside makeGrid to access variables in scope
            function _helper(lastRow){
                if (o.maxRows && rows > o.maxRows || o.truncate && lastRow && rows > 1)
                    row[x][0].style.display = 'none';
                else {
                    if (row[x][4]) {
                        row[x][3].setAttribute('src', row[x][4]); row[x][4] = '';
                    }
                    row[x][0].style.width = new_w+'px';
                    row[x][0].style.height = row_h+'px';
                    // row[x][0].style.display = 'block';
                }
            }

            for (var i=0; i<items.length; i++) {
                row.push(items[i]);
                row_width += items[i][2] + o.margin;
                if (row_width >= max_w) {
                    var margins_in_row = row.length * o.margin;
                    ratio = (max_w-margins_in_row) / (row_width-margins_in_row), row_h = Math.ceil(o.rowHeight*ratio), exact_w = 0, new_w;
                    for (x=0; x<row.length; x++) {
                        new_w = Math.ceil(row[x][2]*ratio);
                        exact_w += new_w + o.margin;
                        if (exact_w > max_w) new_w -= exact_w - max_w;
                        if(!options.noRender)
                            _helper();
                    }
                    //adds a class to the row "rowID-i"
                    setTransitionDelay(row,rows);

                    // reset for next row
                    row = [], row_width = 0;
                    rows++;
                }
                //adds a class to the row "rowID-i"
                setTransitionDelay(row,rows);
            }
            // layout last row - match height of last row to previous row
            for (x=0; x<row.length; x++) {
                new_w = Math.round(row[x][2]*ratio), h = Math.round(o.rowHeight*ratio);
                _helper(true);
            }

            // scroll bars added or removed during rendering new layout?
            if (!noresize && max_w != grid.clientWidth) makeGrid(grid, items, o, true);
        }

        function setTransitionDelay(row,rows){
            self.maxDelay = 0;
            row.forEach(function(itm,i){
                var el = itm[0];
                // clearClass(el, 'example-enter');
                // el.className += " example-enter";
                var tDelay = .066 * i + .033 * ((rows-1)%3);
                el.style.transitionDelay = tDelay + 's';
                el.style.WebkitTransitionDelay = tDelay + 's';
                self.maxDelay = Math.max(self.maxDelay,tDelay)
            })
        }

        // function clearClass(el, prefix){
        //     var classes = el.className.split(" ").filter(function(c) {
        //         return c.lastIndexOf(prefix, 0) !== 0;
        //     });
        //     el.className = classes.join(" ").trim();
        // }

        var o = { selector: 0, container: '.item', object: 'img', rowHeight: 180, maxRows: 0, truncate: 0 };
        for (var k in options) { if (options.hasOwnProperty(k)) o[k] = options[k]; }
        var grids = typeof o.selector == 'object' ? [o.selector] : document.querySelectorAll(o.selector);

        for (var i=0;i<grids.length;i++) {
            var grid = grids[i],
                containers = grid.querySelectorAll(o.container),
                items = [],
                t = new Date().getTime();
            if (!containers.length) continue;
            var s = window.getComputedStyle ? getComputedStyle(containers[0], null) : containers[0].currentStyle;
            o.margin = (parseInt(s.marginLeft) || 0) + (parseInt(s.marginRight) || 0) + (Math.round(parseFloat(s.borderLeftWidth)) || 0) + (Math.round(parseFloat(s.borderRightWidth)) || 0);

            for (var j=0;j<containers.length;j++) {
                var isNews = containers[j].classList.contains("newsItem");
                if (!isNews) {
                    var c = containers[j],
                    w = parseInt(c.getAttribute('data-w')),
                    norm_w = w*(o.rowHeight/parseInt(c.getAttribute('data-h'))), // normalized width
                    obj = c.querySelector(o.object);
                    items.push([c, w, norm_w, obj, obj.getAttribute('data-src')]);
                } else {
                    var c = containers[j],
                    w = parseInt(c.getAttribute('data-w')),
                    norm_w = w*(o.rowHeight/parseInt(c.getAttribute('data-h'))); // normalized width
                    items.push([c, w, norm_w]);
                }

            }

            makeGrid(grid, items, o);
            var tempf = function() { makeGrid(grid, items, o); };
            if (document.addEventListener) {
                window['flexImages_listener'+t] = tempf;
                window.removeEventListener('resize', window['flexImages_listener'+grid.getAttribute('data-flex-t')]);
                delete window['flexImages_listener'+grid.getAttribute('data-flex-t')];
                window.addEventListener('resize', window['flexImages_listener'+t]);
            } else
                grid.onresize = tempf;
            grid.setAttribute('data-flex-t', t)
        }
    }
    return flexImages;
})();

export default flexImages