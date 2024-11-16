;(function($) {
    'use strict';

    // 插件默认配置
    const defaults = {
        inputTarget: null,  // 输入目标元素
        position: 'bottom',  // 弹出位置：bottom, top, left, right
        onSelect: null,  // 选择表情后的回调函数
    };

    class EmojiPicker {
        constructor(element, options) {
            this.element = element;
            this.settings = $.extend({}, defaults, options);
            this.init();
        }

        // 常量数据
        static get CATEGORIES() {
            return {
                '😊': ['🕐', '😀', '👤', '🎈', '🍕', '🚗', '❤️'],
                ';-)': ['🕐', ':D', ':)', '(^o^)', ':(', '>:(', ':|', ':O'],
                'Ω': ['🕐', '📏', '①', '⚡', '❗', '➕', '⬛', 'Ω']
            };
        }

        static get TAB_MAPPING() {
            return {
                '😊': '表情符号',
                ';-)': '颜文字',
                'Ω': '符号'
            };
        }

        static get SECONDARY_TAB_MAPPING() {
            return {
                '🕐': '最近使用',
                '😀': '笑脸和动物',
                '👤': '人',
                '🎈': '庆祝和物品',
                '🍕': '食品和植物',
                '🚗': '交通和地点',
                '❤️': '爱心',
                
                ':D': '开心',
                ':)': '问候',
                '(^o^)': '卖萌',
                ':(': '忧伤',
                '>:(': '生气',
                ':|': '无语',
                ':O': '惊讶',
                
                '📏': '单位',
                '①': '序号',
                '⚡': '特殊符号',
                '❗': '标点符号',
                '➕': '数学',
                '⬛': '几何',
                'Ω': '字母'
            };
        }

        static get EMOJI_DATA() {
            return {
                '笑脸和动物': ['😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳'],
                '人': ['👶', '👧', '🧒', '👦', '👩', '🧑', '👨', '👩‍🦱', '👨‍🦱', '👩‍🦰', '👨‍🦰', '👱‍♀️', '👱‍♂️', '👩‍🦳', '👨‍🦳', '👩‍🦲', '👨‍🦲', '🧔', '👵', '🧓', '👴'],
                '开心': ['(◕‿◕)', '(｡♥‿♥｡)', '(◠‿◠)', 'ヽ(♡‿♡)ノ', '(｀・ω・´)"'],
                '问候': ['(｡･∀･)ﾉﾞ', 'ヾ(・ω・*)', '(*´∀`)~♥', '(｀･ω･´)ゞ'],
                '单位': ['°', '℃', '℉', '㎎', '㎏', '㎜', '㎝', '㎞', '㎡', '‰', '％', '㎜Hg', '㏄'],
                '序号': ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩', 'Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ', 'Ⅴ'],
                '特殊符号': ['©', '®', '™', '℠', '§', '¶', '†', '‡', '⁂', '☮', '☯', '☪'],
                '标点符号': ['·', '‥', '…', '', '﹒', '．', '「', '」', '『', '』', '〔', '〕'],
                '数学': ['＋', '－', '×', '÷', '＝', '≠', '≒', '∞', '±', '√', '∵', '∴'],
                '几何': ['△', '▲', '▽', '▼', '◇', '◆', '○', '●', '□', '■', '▢', '▣'],
                '字母': ['α', 'β', 'γ', 'δ', 'ε', 'ζ', 'η', 'θ', 'ι', 'κ', 'λ', 'μ', 'ν']
            };
        }

        init() {
            this.currentPrimaryTab = '😊';
            this.currentSecondaryTab = EmojiPicker.CATEGORIES['😊'][1];
            this.recentEmojis = new Set();
            
            this.createPickerElement();
            this.bindEvents();
        }

        createPickerElement() {
            // 创建选择器HTML结构
            const pickerHtml = `
                <div class="emoji-picker">
                    <div class="picker-header">
                        <span class="picker-title">表情符号</span>
                        <button class="close-btn">✕</button>
                    </div>
                    <div class="primary-tabs">
                        <button class="primary-tab active">😊</button>
                        <button class="primary-tab">;-)</button>
                        <button class="primary-tab">Ω</button>
                    </div>
                    <div class="emoji-content"></div>
                    <div class="secondary-tabs"></div>
                </div>
            `;

            this.$picker = $(pickerHtml);
            $('body').append(this.$picker);
            this.initializePicker();
        }

        bindEvents() {
            // 绑定按钮点击事件
            $(this.element).on('click', (e) => {
                e.stopPropagation();
                this.toggle();
            });

            // 绑定关闭按钮事件
            this.$picker.find('.close-btn').on('click', () => this.hide());

            // 绑定一级分类点击事件
            this.$picker.find('.primary-tab').on('click', (e) => this.onPrimaryTabClick(e));

            // 点击其他地方关闭
            $(document).on('click', (e) => {
                if (!$(e.target).closest('.emoji-picker').length) {
                    this.hide();
                }
            });
        }

        // 其他方法...
        initializePicker() {
            this.$picker.find('.picker-title').text(EmojiPicker.TAB_MAPPING[this.currentPrimaryTab]);
            this.updateSecondaryTabs();
            this.updateEmojiContent();
        }

        toggle() {
            if (!this.$picker.is(':visible')) {
                this.show();
            } else {
                this.hide();
            }
        }

        show() {
            this.currentPrimaryTab = '😊';
            this.currentSecondaryTab = EmojiPicker.CATEGORIES['😊'][1];
            
            this.$picker.find('.primary-tab').removeClass('active')
                       .first().addClass('active');
            
            this.initializePicker();
            this.updatePosition();
            this.$picker.show();
        }

        hide() {
            this.$picker.hide();
        }

        updatePosition() {
            const buttonPos = $(this.element).offset();
            const buttonHeight = $(this.element).outerHeight();
            
            this.$picker.css({
                top: buttonPos.top + buttonHeight + 5,
                left: buttonPos.left
            });
        }

        // 添加缺失的方法
        onPrimaryTabClick(e) {
            const $tab = $(e.currentTarget);
            this.currentPrimaryTab = $tab.text();
            
            this.$picker.find('.primary-tab').removeClass('active');
            $tab.addClass('active');
            
            this.$picker.find('.picker-title').text(EmojiPicker.TAB_MAPPING[this.currentPrimaryTab]);
            this.currentSecondaryTab = EmojiPicker.CATEGORIES[this.currentPrimaryTab][1];
            
            this.updateSecondaryTabs();
            this.updateEmojiContent();
        }

        updateSecondaryTabs() {
            const secondaryTabs = EmojiPicker.CATEGORIES[this.currentPrimaryTab];
            const $secondaryTabs = this.$picker.find('.secondary-tabs');
            $secondaryTabs.empty();
            
            secondaryTabs.forEach(tab => {
                const isActive = tab === this.currentSecondaryTab ? 'active' : '';
                $secondaryTabs.append(
                    `<button class="secondary-tab ${isActive}" title="${EmojiPicker.SECONDARY_TAB_MAPPING[tab]}">${tab}</button>`
                );
            });

            // ��二级分类标签点击事件
            this.$picker.find('.secondary-tab').on('click', (e) => {
                const $tab = $(e.currentTarget);
                this.$picker.find('.secondary-tab').removeClass('active');
                $tab.addClass('active');
                this.currentSecondaryTab = $tab.text();
                this.updateEmojiContent();
            });
        }

        updateEmojiContent() {
            const $content = this.$picker.find('.emoji-content');
            $content.empty();
            
            // 移除之前的额外类名
            $content.removeClass('kaomoji-content symbol-content');

            const categoryName = EmojiPicker.SECONDARY_TAB_MAPPING[this.currentSecondaryTab];
            
            if (categoryName === '最近使用') {
                Array.from(this.recentEmojis).forEach(emoji => {
                    $content.append(this.createEmojiElement(emoji));
                });
                return;
            }

            const emojis = EmojiPicker.EMOJI_DATA[categoryName] || [];
            
            // 判断当前分类类型
            const isKaomoji = this.currentPrimaryTab === ';-)';
            const isSymbol = this.currentPrimaryTab === 'Ω';
            
            if (isKaomoji) {
                $content.addClass('kaomoji-content');
            } else if (isSymbol) {
                $content.addClass('symbol-content');
            }
            
            emojis.forEach(emoji => {
                let className = 'emoji-item';
                if (isKaomoji) {
                    className = 'kaomoji-item';
                } else if (isSymbol) {
                    className = 'symbol-item';
                }
                
                const $element = this.createEmojiElement(emoji, className);
                $content.append($element);
            });
        }

        createEmojiElement(emoji, className = 'emoji-item') {
            const $emoji = $(`<span class="${className}" title="点击插入表情">${emoji}</span>`);
            
            $emoji.on('click', () => {
                this.insertEmoji(emoji);
            });
            
            return $emoji;
        }

        insertEmoji(emoji) {
            if (this.settings.inputTarget) {
                const $input = $(this.settings.inputTarget);
                const pos = $input[0].selectionStart;
                const text = $input.val();
                
                $input.val(text.slice(0, pos) + emoji + text.slice(pos));
                $input[0].setSelectionRange(pos + emoji.length, pos + emoji.length);
                $input.focus();
            }

            // 添加到最近使用
            this.recentEmojis.add(emoji);
            if (this.recentEmojis.size > 30) {
                this.recentEmojis.delete(Array.from(this.recentEmojis)[0]);
            }

            // 触发选择回调
            if (typeof this.settings.onSelect === 'function') {
                this.settings.onSelect(emoji);
            }
        }
    }

    // 注册为jQuery插件
    $.fn.emojiPicker = function(options) {
        return this.each(function() {
            if (!$.data(this, 'emojiPicker')) {
                $.data(this, 'emojiPicker', new EmojiPicker(this, options));
            }
        });
    };

})(jQuery); 