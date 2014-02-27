/**
 * Created by 朱天龙 on 14-2-20.
 * email:ztl@yitong.com.cn
 * qq:540205204
 *
 * 固定数字键盘通用工具
 * 直接调用 keyboard.init();初始化数字键
 */
;
(function ($) {
    "use strict";
    /**
     * 扩展类 用于插入符号
     * @param options
     * @param opt2
     * @returns {*}
     */
    $.fn.caret = function (options, opt2) {
        if (typeof this[0] === 'undefined' || this.is(':hidden') || this.css('visibility') === 'hidden') {
            return this;
        }
        var s, start, e, end, selRange, range, stored_range, te, val,
            selection = document.selection, t = this[0], sTop = t.scrollTop,
            ss = typeof t.selectionStart !== 'undefined';
        if (typeof options === 'number' && typeof opt2 === 'number') {
            start = options;
            end = opt2;
        }
        if (typeof start !== 'undefined') {
            if (ss) {
                t.selectionStart = start;
                t.selectionEnd = end;
            } else {
                selRange = t.createTextRange();
                selRange.collapse(true);
                selRange.moveStart('character', start);
                selRange.moveEnd('character', end - start);
                selRange.select();
            }
            // must be visible or IE8 crashes; IE9 in compatibility mode works fine - issue #56
            if (this.is(':visible') || this.css('visibility') !== 'hidden') {
                this.focus();
            }
            t.scrollTop = sTop;
            return this;
        } else {
            if (ss) {
                s = t.selectionStart;
                e = t.selectionEnd;
            } else {
                if (t.tagName === 'TEXTAREA') {
                    val = this.val();
                    range = selection[createRange]();
                    stored_range = range[duplicate]();
                    stored_range.moveToElementText(t);
                    stored_range.setEndPoint('EndToEnd', range);
                    // thanks to the awesome comments in the rangy plugin
                    s = stored_range.text.replace(/\r/g, '\n')[len];
                    e = s + range.text.replace(/\r/g, '\n')[len];
                } else {
                    val = this.val().replace(/\r/g, '\n');
                    range = selection[createRange]()[duplicate]();
                    range.moveEnd('character', val[len]);
                    s = (range.text === '' ? val[len] : val.lastIndexOf(range.text));
                    range = selection[createRange]()[duplicate]();
                    range.moveStart('character', -val[len]);
                    e = range.text[len];
                }
            }
            te = (t.value || '').substring(s, e);
            return { start: s, end: e, text: te, replace: function (st) {
                return t.value.substring(0, s) + st + t.value.substring(e, t.value[len]);
            }};
        }
    };

    window.keyboard = {
        $el: {},//输入框的焦点
        keySet: [
            '1 2 3 4 {clear}',
            '5 6 7 8 {bksp}',
            '9 0 . 00'
        ],
        display: {
            'bksp': '\u232b:Backspace',
            'clear': 'C:Clear'
        },
        $keyboard: {},
        $allKeys: {},
        keyaction: {
            bksp: function (base) {
                base.insertText('bksp'); // the script looks for the "bksp" string and initiates a backspace
            },
            clear: function (base) {
                base.$el.val('');
            }
        },
        keyBinding: 'mousedown touchstart',
        keyBtn: $('<button />')
            .attr({ 'role': 'button', 'aria-disabled': 'false', 'tabindex': '-1' })
            .addClass('ui-keyboard-button'),
        tmp: {},
        init: function () {
            var base = this;
            //base.options = $.extend(true, {}, keyboard.defaultOptions, options);
            // base.$el = $(el);
            base.create();
            base.bindKeys();
        },
        create: function () {
            var t, action, row, margin, newSet, isAction,
                currentSet, key, keys,
                base = this,
                keySet = this.keySet,
                container = $('<div />')
                    .addClass('ui-keyboard')
                    .attr({ 'role': 'textbox' }),
                newSet = $('<div />').addClass('ui-keyboard-keyset').appendTo(container);

            for (row = 0; row < keySet.length; row++) {
                currentSet = $.trim(keySet[row]).replace(/\{(\.?)[\s+]?:[\s+]?(\.?)\}/g, '{$1:$2}');
                keys = currentSet.split(/\s+/);
                //console.log(keys);

                for (key = 0; key < keys.length; key++) {
                    // used by addKey function
                    base.temp = [ newSet, row, key ];
                    isAction = false;

                    // ignore empty keys
                    if (keys[key].length === 0) {
                        continue;
                    }

                    if (/^\{\S+\}$/.test(keys[key])) {
                        action = keys[key].match(/^\{(\S+)\}$/)[1].toLowerCase();
                        // add active class if there are double exclamation points in the name
                        if (/\!\!/.test(action)) {
                            action = action.replace('!!', '');
                            isAction = true;
                        }

                        // add empty space
                        if (/^sp:((\d+)?([\.|,]\d+)?)(em|px)?$/.test(action)) {
                            // not perfect globalization, but allows you to use {sp:1,1em}, {sp:1.2em} or {sp:15px}
                            margin = parseFloat(action
                                .replace(/,/, '.')
                                .match(/^sp:((\d+)?([\.|,]\d+)?)(em|px)?$/)[1] || 0
                            );
                            $('<span>&nbsp;</span>')
                                // previously {sp:1} would add 1em margin to each side of a 0 width span
                                // now Firefox doesn't seem to render 0px dimensions, so now we set the
                                // 1em margin x 2 for the width
                                .width((action.match('px') ? margin + 'px' : (margin * 2) + 'em'))
                                .addClass('ui-keyboard-button ui-keyboard-spacer')
                                .appendTo(newSet);
                        }

                        // meta keys
                        if (/^meta\d+\:?(\w+)?/.test(action)) {
                            base.addKey(action, action);
                            continue;
                        }

                        // switch needed for action keys with multiple names/shortcuts or
                        // default will catch all others
                        switch (action) {
                            case 'b':
                                base.addKey('b', action);
                                break;

                            case 'c':
                                base.addKey('C', action);
                                break;

                            case 'empty':
                                base
                                    .addKey('', ' ')
                                    .attr('aria-disabled', true);
                                break;
                            default:
                                if (base.keyaction.hasOwnProperty(action)) {
                                    base.addKey(action, action);
                                }
                        }

                    } else {
                        t = keys[key];
                        //acceptedKeys.push(t === ':' ? t : t.split(':')[0]);
                        base.addKey(t, t, true);
                    }
                }

                newSet.find('.ui-keyboard-button:last').after('<br class="ui-keyboard-button-endrow">');

            }
            base.$keyboard = container;
            $("#keyboard").append(container);
        },
        addKey: function (keyName, name, regKey) {
            var t, keyType, m, map, nm, uiClass,
                base = this,
                n = (regKey === true) ? keyName : base.display[name] || keyName,
                kn = (regKey === true) ? keyName.charCodeAt(0) : keyName;

            // find key label
            nm = n.split(':');
            // corner case of ":(:):;" reduced to "::;", split as ["", "", ";"]
            if (nm[0] === '' && nm[1] === '') {
                n = ':';
            }
            n = (nm[0] !== '' && nm.length > 1) ? $.trim(nm[0]) : n;
            // added to title
            t = (nm.length > 1) ? $.trim(nm[1]).replace(/_/g, " ") || '' : '';

            keyType = (n.length > 1) ? ' ui-keyboard-widekey' : '';
            keyType += (regKey) ? '' : ' ui-keyboard-actionkey';
            uiClass = 'ui-keyboard-' + kn + keyType;
            return base.keyBtn
                .clone()
                .attr({
                    'data-value': n,
                    'name': kn,
                    'data-pos': base.temp[1] + ',' + base.temp[2],
                    'title': t,
                    'data-action': keyName,
                    'data-original': n,
                    'data-curtxt': n,
                    'data-curnum': 0
                })
                .addClass(uiClass)
                .addClass(n.length > 1 ? 'ui-keyboard-length-' + n.length : '')
                .html('<span>' + n + '</span>')
                .appendTo(base.temp[0]);
        },
        bindKeys: function () {
            var o = this,
                base = this,
                allEvents = (o.keyBinding)
                    .split(' ')
                    .join('.keyboard ');
            base.$allKeys = base.$keyboard.find('button.ui-keyboard-button')
                .unbind(allEvents)
                .bind(allEvents, function (e) {
                    if (!base.hadFocus()) {
                        return;
                    }
                    var txt,
                        $this = $(this),
                        action = $this.attr('data-action').split(':')[0];
                    base.$el.focus();
                    if (action.match('meta')) {
                        action = 'meta';
                    }
                    if (base.keyaction.hasOwnProperty(action) && $(this).hasClass('ui-keyboard-actionkey')) {
                        // stop processing if action returns false (close & cancel)
                        if (base.keyaction[action](base, this, e) === false) {
                            return false;
                        }
                    } else if (typeof action !== 'undefined') {
                        txt = base.lastKey = (base.wheel && !$(this).hasClass('ui-keyboard-actionkey')) ?
                            base.lastKey : action;
                        base.insertText(txt);
                    }
                    base.$el.focus().caret(base.lastCaret.start, base.lastCaret.end);
                    base.checkMaxLength();
                    base.checkNumber();
                    base.$el.trigger('change',base.$el);
                    //base.$el.trigger('change.keyboard', [ base, base.$el ]);
                    e.preventDefault();
                })
                .bind('click.keyboard', function () {
                    return false;
                });
        },
        hadFocus: function () {
            this.$el = $("input:focus");
            if (this.$el.attr('type')=="text"  && this.$el.length > 0) {
                return true;
            }
            console.log("没有选中任何输入框");
            return false;
        },
        checkMaxLength:function(){
            var base=this,
                t, p = base.$el.val(),
                maxLength= base.$el.attr("maxLength");
                if(maxLength!=undefined){
                    t = Math.min(base.$el.caret().start, maxLength);
                    base.$el.val( p.substring(0, maxLength) );
                    // restore caret on change, otherwise it ends up at the end.
                    base.$el.caret( t, t );
                    base.lastCaret = { start: t, end: t };
                }

        },
        checkNumber:function(){

            var matches = /\d+(\.\d*)?/.exec( this.$el.val() );
            if ( matches && matches[0] != undefined )
                this.$el.val(matches[0]);
            else
                this.$el.val('');

        },
        insertText: function (txt) {
            var base = this,
                bksp, t, h,
                val = base.$el.val(),
                pos = base.$el.caret(),
                scrL = base.$el.scrollLeft(),
                len = val.length; // save original content length

            // silly IE caret hacks... it should work correctly, but navigating using arrow keys in a textarea
            // is still difficult
            // in IE, pos.end can be zero after input loses focus
            if (pos.end < pos.start) {
                pos.end = pos.start;
            }
            if (pos.start > len) {
                pos.end = pos.start = len;
            }

            bksp = (txt === 'bksp' && pos.start === pos.end) ? true : false;
            txt = (txt === 'bksp') ? '' : txt;
            t = pos.start + (bksp ? -1 : txt.length);
            scrL += parseInt(base.$el.css('fontSize'), 10) * (txt === 'bksp' ? -1 : 1);

            base.$el
                .val(base.$el.val().substr(0, pos.start - (bksp ? 1 : 0)) + txt +
                    base.$el.val().substr(pos.end))
                .caret(t, t)
                .scrollLeft(scrL);

            base.lastCaret = { start: t, end: t }; // save caret in case of bksp

        }

    };

})(jQuery);

//自动初始化数字键盘
$(function () {
    keyboard.init({});
});
