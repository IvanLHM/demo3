$(document).ready(function() {
    const categories = {
        '😊': ['🕐', '😊', '👤', '🎈', '🍕', '🚗', '❤️'],
        ';-)': ['🕐', ':D', ':)', '(^o^)', ':(', '>:(', ':|', ':O'],
        'Ω': ['🕐', '📏', '①', '⚡', '❗', '➕', '⬛', 'Ω']
    };

    const tabMapping = {
        '😊': '表情符号',
        ';-)': '颜文字',
        'Ω': '符号'
    };

    const secondaryTabMapping = {
        // 表情符号的二级分类
        '🕐': '最近使用',
        '😊': '笑脸和动物',
        '👤': '人',
        '🎈': '庆祝和物品',
        '🍕': '食品和植物',
        '🚗': '交通和地点',
        '❤️': '爱心',
        
        // 颜文字的二级分类
        '🕐': '最近使用',
        ':D': '开心',
        ':)': '问候',
        '(^o^)': '卖萌',
        ':(': '忧伤',
        '>:(': '生气',
        ':|': '无语',
        ':O': '惊讶',
        
        // 符号的二级分类
        '🕐': '最近使用',
        '📏': '单位',
        '①': '序号',
        '⚡': '特殊符号',
        '❗': '标点符号',
        '➕': '数学',
        '⬛': '几何',
        'Ω': '字母'
    };

    const emojiData = {
        '笑脸和动物': ['🙂', '😊', '😀', '😄', '😅', '😆', '😂', '🤣', '😉', '😌', '😍', '😘', '😋', '😜', '😝', '😛', '🤑', '😎', '🤓', '🧐', '🤠', '🥳'],
        '人': ['👋', '🤚', '✋', '🖐️', '👌', '🤌', '🤏', '✌️', '🤞', '🫰', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎', '✊'],
        '开心': [
            '(*^▽^*)', '(◕‿◕)', '(｡♥‿♥｡)', 
            '(＾▽＾)', '(/◕ヮ◕)/', 'ヽ(´▽`)/'
        ],
        '问候': [
            '(｡･∀･)ﾉﾞ', 'ヾ(・ω・*)', 
            '(*´∀`)~♥', '(｀･ω･´)ゞ'
        ],
        '卖萌': [
            '(●´ω｀●)', '(｡◕‿◕｡)', 
            '(◕ᴗ◕✿)', '(｡◕ω◕｡)'
        ],
        '忧伤': [
            '(´;ω;｀)', '(╥﹏╥)', 
            '(;´д｀)', '(´；ω；｀)'
        ],
        '生气': [
            '(｀皿´＃)', '(╬ﾟдﾟ)', 
            '(╬`益´)', '(‡▼益▼)'
        ],
        '无语': [
            '(￣▽￣*)ゞ', '(-_-;)・・・', 
            '(￣～￣;)', '(；一_一)'
        ],
        '惊讶': [
            '(⊙_⊙)', '(⊙o⊙)', 
            'w(ﾟДﾟ)w', '(´⊙ω⊙`)'
        ],
        '单位': ['°', '℃', '℉', '㎎', '㎏', '㎜', '㎝', '㎞', '㎡', '℃', '‰', '％', '㎜Hg', '㏄', '〒'],
        '序号': ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩',
                'Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ', 'Ⅴ', 'Ⅵ', 'Ⅶ', 'Ⅷ', 'Ⅸ', 'Ⅹ',
                '⒈', '⒉', '⒊', '⒋', '⒌', '⒍', '⒎', '⒏', '⒐', '⒑'],
        '特殊符号': ['©', '®', '™', '℠', '§', '¶', '†', '‡', '⁂', '☮', '☯', '☪', '☭', '♨', 
                    '☢', '☣', '☤', '⚕', '⚜', '⚠', '☔', '♿', '⚡', '☎', '⌛', '☺', '☹'],
        '标点符号': ['·', '‥', '…', '‧', '﹒', '．', '「', '」', '『', '』', '〔', '〕',
                    '【', '】', '《', '》', '〈', '〉', '﹙', '﹚', '﹛', '﹜', '﹝', '﹞',
                    '〝', '〞', '‵', '′', '※', '§', '¿', '¡', '‼', '⁉'],
        '数学': ['＋', '－', '×', '÷', '＝', '≠', '≒', '∞', '±', '√', '∵', '∴', '∷',
                '≤', '≥', '∠', '⊥', '∪', '∩', '∈', '∑', '∏', '∅', 'π', 'Δ', 'Φ', 'Ω'],
        '几何': ['△', '▲', '▽', '▼', '◇', '◆', '○', '●', '□', '■', '▢', '▣', '▤',
                '▥', '▦', '▧', '▨', '▩', '▪', '▫', '▬', '▭', '▮', '▯', '▰', '▱'],
        '字母': ['α', 'β', 'γ', 'δ', '', 'ζ', 'η', 'θ', 'ι', 'κ', 'λ', 'μ', 'ν',
                'ξ', 'ο', 'π', 'ρ', 'σ', 'τ', 'υ', 'φ', 'χ', 'ψ', 'ω',
                'Α', 'Β', 'Γ', 'Δ', 'Ε', 'Ζ', 'Η', 'Θ', 'Ι', 'Κ', 'Λ', 'Μ', 'Ν',
                'Ξ', 'Ο', 'Π', 'Ρ', 'Σ', 'Τ', 'Υ', 'Φ', 'Χ', 'Ψ', 'Ω']
    };

    const recentEmojis = new Set();

    let currentPrimaryTab = '😊';
    let currentSecondaryTab = categories['😊'][1];

    // 初始化函数
    function initializePicker() {
        // 设置初始标题
        $('.picker-title').text(tabMapping[currentPrimaryTab]);
        
        // 设置初始一级分类激活状态
        $('.primary-tab').first().addClass('active');
        
        // 更新二级分类和内容
        updateSecondaryTabs();
        updateEmojiContent();
    }

    // 切换表情选择器显示/隐藏
    $('#togglePicker').click(function(e) {
        e.stopPropagation();
        const picker = $('.emoji-picker');
        
        if (!picker.is(':visible')) {
            // 如果是首次显示或重新显示，重新初始化
            currentPrimaryTab = '😊';
            currentSecondaryTab = categories['😊'][1];
            
            // 重置所有一级分类tab的样式
            $('.primary-tab').removeClass('active');
            $('.primary-tab').first().addClass('active');  // 选中第一个tab
            
            initializePicker();
        }
        
        picker.toggle();
        
        // 定位表情选择器
        const button = $(this);
        const buttonPos = button.offset();
        picker.css({
            top: buttonPos.top + button.outerHeight() + 5,
            left: buttonPos.left
        });
    });

    // 点击其他地方关闭选择器
    $(document).click(function(e) {
        if (!$(e.target).closest('.emoji-picker').length) {
            $('.emoji-picker').hide();
        }
    });

    // 一级分类标签点击事件
    $('.primary-tab').click(function() {
        $('.primary-tab').removeClass('active');
        $(this).addClass('active');
        currentPrimaryTab = $(this).text();
        
        // 更新标题
        $('.picker-title').text(tabMapping[currentPrimaryTab]);
        
        // 设置当前二级分类为该分类下的第二个选项
        currentSecondaryTab = categories[currentPrimaryTab][1];  // 获取第二个选项
        
        updateSecondaryTabs();
        updateEmojiContent();
    });

    // 更新二级分类标签
    function updateSecondaryTabs() {
        const secondaryTabs = categories[currentPrimaryTab];
        $('.secondary-tabs').empty();
        
        secondaryTabs.forEach(tab => {
            const isActive = tab === currentSecondaryTab ? 'active' : '';
            $('.secondary-tabs').append(
                `<button class="secondary-tab ${isActive}" title="${secondaryTabMapping[tab]}">${tab}</button>`
            );
        });

        // 二级分类标签点击事件
        $('.secondary-tab').click(function() {
            $('.secondary-tab').removeClass('active');
            $(this).addClass('active');
            currentSecondaryTab = $(this).text();
            updateEmojiContent();
        });
    }

    // 更新表情内容
    function updateEmojiContent() {
        const content = $('.emoji-content');
        content.empty();

        const categoryName = secondaryTabMapping[currentSecondaryTab];
        
        if (categoryName === '最近使用') {
            Array.from(recentEmojis).forEach(emoji => {
                content.append(`<span class="emoji-item" title="点击插入表情">${emoji}</span>`);
            });
            return;
        }

        const emojis = emojiData[categoryName] || [];
        
        // 判断当前是否在颜文字分类
        const isKaomoji = currentPrimaryTab === ';-)';
        
        emojis.forEach(emoji => {
            content.append(
                `<span class="emoji-item ${isKaomoji ? 'kaomoji-item' : ''}" 
                       title="点击插入表情">${emoji}</span>`
            );
        });
    }

    // 点击表情插入输入框
    $(document).on('click', '.emoji-item', function() {
        const emoji = $(this).text();
        const input = $('#emojiInput');
        const pos = input[0].selectionStart;
        const text = input.val();
        
        input.val(text.slice(0, pos) + emoji + text.slice(pos));
        input[0].setSelectionRange(pos + emoji.length, pos + emoji.length);
        input.focus();

        // 添加到最近使用
        recentEmojis.add(emoji);
        if (recentEmojis.size > 30) {
            recentEmojis.delete(Array.from(recentEmojis)[0]);
        }
    });

    // 关闭按钮点击事件
    $('.close-btn').click(function() {
        $('.emoji-picker').hide();
    });
}); 