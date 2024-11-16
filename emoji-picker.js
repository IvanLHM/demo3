
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
            this.recentEmojis = {
                '😊': new Set(),  // 表情符号的最近使用
                ';-)': new Set(), // 颜文字的最近使用 
                'Ω': new Set()    // 符号的最近使用
            };
            this.init();
        }

        // 常量数据
        static get CATEGORIES() {
            return {
                '😊': [
                    '🕐',      // 时钟图标代表"最近使用"
                    '😊',      // 笑脸图标代表"笑脸和动物"
                    '👩',      // 女性图标代表"人"
                    '🎈',      // 气球图标代表"庆祝和物品"
                    '🍕',      // 食图标代表"食品和植物"
                    '🚗',      // 汽车图标代表"交通和地点"
                    '♡'       // 空心爱心图标代表"爱心"
                ],
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
                '😊': '笑脸和动物',
                '👩': '人',
                '🎈': '庆祝和物品',
                '🍕': '食品和植物',
                '🚗': '交通和地点',
                '♡': '爱心',
                
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
                '笑脸和动物': [
                    // 第一行
                    '😀', '😁', '😂', '🤣', '😃', '😄', '😅', '😆',
                    // 第二行
                    '😉', '😊', '😋', '😎', '😍', '😘', '😗', '😙',
                    // 第三行
                    '😚', '🙂', '🤗', '🤩', '🤔', '🤨', '😐', '😑',
                    // 第四行
                    '😶', '🙄', '😏', '😣', '😥', '😮', '🤐', '😯',
                    // 第五行
                    '😪', '😫', '😴', '😌', '😛', '😜', '😝', '🤤',
                    // 第六行
                    '😒', '😓', '😔', '😕', '🙃', '🤑', '😲', '☹️',
                    // 第七行
                    '🙁', '😖', '😞', '😟', '😤', '😢', '😭', '😦',
                    // 第八行
                    '😧', '😨', '😩', '🤯', '😬', '😰', '😱', '🥵',
                    // 第九行
                    '🥶', '😳', '🤪', '😵', '😡', '😠', '🤬', '😷',
                    // 第十行
                    '🤒', '🤕', '🤢', '🤮', '🤧', '😇', '🤠', '🤡',
                    // 第十一行
                    '🥳', '🥴', '🥺', '🤥', '🤫', '🤭', '🧐', '🤓'
                ],
                '人': [
                    // 第一行 - 手势
                    '👋', '🤚', '✋', '🖐️', '👌', '👊', '🤏', '✌️',
                    // 第二行 - 手势
                    '🤞', '✌️', '🤟', '🤘', '🤙', '👈', '👉', '👆',
                    // 第三行 - 手势
                    '🖕', '👇', '☝️', '👍', '👎', '✊', '👊', '🤛',
                    // 第四行 - 手势和身体部位
                    '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️',
                    // 第五行 - 身体部位
                    '💪', '🦾', '🦿', '🦵', '🦶', '👂', '🦻', '👃',
                    // 第六行 - 人物
                    '👶', '👧', '🧒', '👦', '👩', '🧑', '👨', '👱‍♀️',
                    // 第七行 - 人物
                    '👱', '👱‍♂️', '👴', '👵', '🧓', '🙍‍♀️', '🙍', '🙍‍♂️',
                    // 第八行 - 人物动作
                    '🙎‍♀️', '🙎', '🙎‍♂️', '🙅‍♀️', '🙅', '🙅‍♂️', '🙆‍♀️', '🙆',
                    // 九行 - 人物动作
                    '🙆‍♂️', '💁‍♀️', '💁', '💁‍♂️', '🙋‍♀️', '🙋', '🙋‍♂️', '🧏‍♀️',
                    // 第十行 - 人物动作
                    '🧏', '🧏‍♂️', '🙇‍♀️', '🙇', '🙇‍♂️', '🤦‍♀️', '🤦', '🤦‍♂️',
                    // 第十一行 - 人物动作
                    '🤷‍♀️', '🤷', '🤷‍♂️', '👨‍⚕️', '👩‍⚕️', '👨‍🎓', '👩‍🎓', '👨‍🏫',
                    // ���十二行 - 职业
                    '👩‍🏫', '👨‍⚖️', '👩‍⚖️', '👨‍🌾', '👩‍🌾', '👨‍🍳', '👩‍🍳', '👨‍🔧',
                    // 第十三行 - 职业
                    '👩‍🔧', '👨‍🏭', '👩‍🏭', '👨‍💼', '👩‍', '👨‍🔬', '👩‍🔬', '👨‍💻',
                    // 第十四行 - 职业和其他
                    '👩‍💻', '👨‍🎤', '👩‍🎤', '👨‍🎨', '👩‍🎨', '👨‍✈️', '👩‍✈️', '👮'
                ],
                '开心': [
                    '(*^▽^*)',     '(◕‿◕)',       '(｡♥‿♥｡)',
                    'ヽ(´▽`)/',    '(＾▽＾)',      '(◠‿◠)',
                    'ヽ(♡‿♡)ノ',   '(｀・ω・´)',   '(´｡• ᵕ •｡`)',
                    '( ´ ▽ ` )ﾉ',  'ヽ(>∀<☆)ノ',  '＼(￣▽￣)／',
                    '(ﾉ´ヮ`)ﾉ*',    '(≧∀≦)',       'o(〃＾▽＾〃)o',
                    '(｀･ω･´)ゞ',   '(´･ᴗ･`)',     '(´◡`❁)',
                    '(๑˃ᴗ˂)ﻭ',     'o((*^▽^*))o',  '(◍•ᴗ•◍)',
                    '(ﾉ◕ヮ◕)ﾉ*',    'ヽ(o＾▽＾o)ノ', '٩(◕‿◕｡)۶',
                    '(〃￣︶￣)人',   '(ﾟ∀ﾟ)',      '(o´∀`o)',
                    '(๑¯∀¯๑)',     '(*´∀`*)',     '(｡´∀｀)ﾉ',
                    '(●´∀`●)',     'ヽ(･∀･)ﾉ',    'o(^▽^)o',
                    'ヽ(｡◕‿◕｡)ﾉ',   '(｀･㉨･´)',    '(●´ω｀●)',
                    '(*≧ω≦*)',     '(◕‿◕✿)',      '(´･ω･`)',
                    '(⌒‿⌒)',       '(*^‿^*)',      '(◠﹏◠)',
                    '(✿◠‿◠)',      '(◡‿◡✿)',      '(✿╹◡╹)',
                    '(◕ᴗ◕✿)',      '(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧', '(„• ֊ •„)',
                    '(｡♥‿♥｡)',     '(✿ ♥‿♥)',     '(◍•ᴗ•◍)❤'
                ],
                '问候': [
                    '(｡･∀･)ﾉﾞ',      'ヾ(・ω・*)',     '(*´∀`)~♥',
                    '(｀･ω･´)ゞ',     'ヾ(^▽^*)))',    '(。・ω・)ノ',
                    '(≧∀≦)ゞ',       '(●´∀｀●)ﾉ',     'ヾ(●゜▽゜●)',
                    '(*´・ｖ・)',     '(｀・ω・´)',    'ヾ(^▽^ヾ)',
                    '(〃･ω･)ﾉ~☆',    'ヽ(*・ω・)ﾉ',    '(o･ω･o)ﾉ',
                    'ヾ(･ω･`｡)',     '(｀･∀･´)ゞ',     'ヾ(･∀･`)ﾉ',
                    '(´･omega･｀)',   'ヽ(･∀･)ﾉ',      'ヾ(･ω･`●)ﾉ'
                ],
                '卖萌': [
                    '(｡◕‿◕｡)',      '(◕ω◕)',        '(●ゝω・)',
                    '(⌒)♡',      '(｡♥‿♥｡)',      '(◕‿◕✿)',
                    '(◠‿◠)',       '(◡‿◡✿)',      '(✿◠‿◠)',
                    '(◕ᴗ◕✿)',      '(◕‿◕)',        '(｡◕‿◕｡)',
                    '(●´ω｀●)',     '(◕‿◕✿)',       '(◠ω◠✿)',
                    '(◕△◕✿)',      '(｡◕‿◕｡)',      '(●´∀｀●)',
                    '(✿´‿`)',      '(◠‿◠✿)',      '(◕‿◕✿)'
                ],
                '忧伤': [
                    '(´;ω;｀)',      '(﹏╥)',        '(;´д｀)',
                    '(´；ω；｀)',     '(｡•́︿•̀｡)',     '(｡ŏ﹏ŏ)',
                    '(っ˘̩╭╮˘̩)っ',   '(｡ŏ﹏ŏ)',       '(´;︵;`)',
                    '(｡╯︵╰｡)',      '(╥_╥)',         '(っ- ‸ – ς)',
                    '(´;ω;｀)',      '(｡ᵕ︵ᵕ｡)',      '(｡•́︿•̀｡)',
                    '(๑◕︵◕๑)',      '(´;д;`)',       '(つ﹏<。)',
                    '(｡ŏ_ŏ)',       '(｡•́︿•̀｡)',     '(⋟﹏⋞)'
                ],
                '生气': [
                    '(｀皿´＃)',      '(╬ﾟдﾟ)',       '(╬`益´)',
                    '(‡▼益▼)',      '(╬ Ò﹏Ó)',      '(＃`Д´)',
                    '(●｀ε´●)',      '(◞‸◟；)',      'ヽ(｀⌒´メ)ノ',
                    '(｀Д´*)',       '(＃｀д´)ﾉ',     '(･｀´･)',
                    '(｀ε´)',        '(｀Д´)',        'ψ(｀∇´)ψ',
                    '(ノ｀Д´)ノ',     '(╬｀益´)',      '(｀ω´)',
                    '(｀◇´)',        '(｀ー´)',       '(ﾒ｀ﾛ´)/'
                ],
                '无语': [
                    '(￣▽￣*)ゞ',    '(-_-;)・・・',    '(￣～￣;)',
                    '(；一_一)',      '(¬_¬)',         '(←_←)',
                    '(；¬_¬)',       '(￣～￣)',       '(-_-メ)',
                    '(-_-;)ゞ',      '(；-_-)',       '(｀_´)ゞ',
                    '(￣ω￣;)',      '(￣□￣」)',     '(＃￣ω￣)',
                    '(￣‐￣)',       '(＃￣～￣＃)',   '(；￣Д￣)',
                    '(￣～￣)',      '(ー￣)',       '(ー_ー)!!'
                ],
                '惊讶': [
                    '(⊙_⊙)',        '(⊙o⊙)',        'w(ﾟДﾟ)w',
                    '(´⊙ω⊙`)',      '(｀・ω・´)',     '(°ー°〃)',
                    'Σ(゜ロ゜;)',    '(⊙_⊙;)',       '(;°Д°)',
                    '(。□。)',       '(ﾟдﾟ；)',      '(゜-゜)',
                    '(◎_◎;)',       '(●__●)',       '(ﾟ□ﾟ*)',
                    '(ﾟ〇ﾟ)',       '(ﾟ艸ﾟ;)',      '(;ﾟдﾟ)',
                    '(;゜○゜)',      '(；゜○゜)',     '(;￢_￢)'
                ],
                '单位': [
                    '°', '℃', '℉', '㎎', '㎏', '㎜', '㎝', '㎞',
                    '㎡', '㎥', '㎦', '㎛', '㎟', '㎠', '㎤', '㎪',
                    '㎫', '㎭', '㎮', '㎯', '㎰', '㎱', '㎲', '㎳',
                    '㎴', '㎵', '㎶', '㎷', '㎸', '㎹', '㎺', '㏄',
                    '㏎', '㏑', '㏒', '', '‰', '％', '‱', '℮'
                ],
                '序号': [
                    '①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧',
                    '⑨', '⑩', '⑪', '⑫', '⑬', '⑭', '⑮', '⑯',
                    'Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ', 'Ⅴ', 'Ⅵ', 'Ⅶ', 'Ⅷ',
                    'Ⅸ', 'Ⅹ', 'Ⅺ', 'Ⅻ', '⒈', '⒉', '⒊', '⒋',
                    '⒌', '⒍', '⒎', '⒏', '⒐', '⒑', '⒒', '⒓'
                ],
                '特殊符号': [
                    '©', '®', '™', '℠', '§', '¶', '†', '‡',
                    '※', '⁂', '☮', '☯', '☪', '☭', '♨', '☢',
                    '☣', '☤', '⚕', '⚜', '⚠', '☔', '♿', '⚡',
                    '☎', '⌛', '☺', '☹', '♠', '♥', '♣', '♦',
                    '✓', '✔', '✗', '✘', '♪', '♫', '♯', '♭'
                ],
                '标点符号': [
                    '·', '‥', '…', '‧', '﹒', '．', '「', '」',
                    '『', '』', '〔', '〕', '【', '】', '《', '》',
                    '〈', '〉', '﹙', '﹚', '﹛', '﹜', '﹝', '﹞',
                    '〝', '〞', '‵', '′', '〃', '～', '∥', '﹉',
                    '﹊', '﹋', '﹌', '﹍', '﹎', '﹏', '﹐', '﹑'
                ],
                '数学': [
                    '＋', '－', '×', '÷', '＝', '≠', '≒', '∞',
                    '±', '√', '∵', '∴', '∷', '≤', '≥', '∠',
                    '⊥', '∪', '∩', '∈', '∑', '∏', '∅', 'π',
                    'Δ', 'Φ', 'Ψ', 'Ω', '∫', '∮', '∝', '∟',
                    '∇', '∆', '∃', '∀', '∂', '∇', '≡', '≌'
                ],
                '几何': [
                    '△', '▲', '▽', '', '◇', '◆', '○', '●',
                    '□', '■', '▢', '▣', '▤', '▥', '▦', '▧',
                    '▨', '▩', '▪', '▫', '▬', '▭', '▮', '▯',
                    '▰', '▱', '▲', '▶', '▼', '◀', '◢', '◣',
                    '◤', '◥', '◐', '◑', '◒', '◓', '◔', '◕'
                ],
                '字母': [
                    'α', 'β', 'γ', 'δ', 'ε', 'ζ', 'η', 'θ',
                    'ι', 'κ', 'λ', 'μ', 'ν', 'ξ', 'ο', 'π',
                    'ρ', 'σ', 'τ', 'υ', 'φ', 'χ', 'ψ', 'ω',
                    'Α', 'Β', 'Γ', 'Δ', 'Ε', 'Ζ', 'Η', 'Θ',
                    'Ι', 'Κ', 'Λ', 'Μ', 'Ν', 'Ξ', 'Ο', 'Π'
                ],
                '庆祝和物品': [
                    // 庆祝相关
                    '🎈', '🎆', '', '✨', '🎉', '🎊', '🎋', '🎍',
                    '🎎', '🎏', '🎐', '🎑', '🎀', '🎁', '🎗', '🎟',
                    // 活动和娱乐
                    '🎫', '🎖', '🏆', '🏅', '🥇', '🥈', '🥉', '⚽',
                    '⚾', '🏀', '🏐', '🏈', '🏉', '🎾', '🎱', '🎳',
                    // 物品和工具
                    '📱', '📲', '💻', '⌨', '🖥', '🖨', '🖱', '🖲',
                    '💽', '💾', '💿', '📀', '🎥', '🎞', '📽', '🎬',
                    // 其他物品
                    '📺', '📷', '📸', '📹', '📼', '🔍', '🔎', '🔬',
                    '🔭', '📡', '', '💡', '🔦', '🏮', '📔', '📕'
                ],
                '食品和植物': [
                    // 水果
                    '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓',
                    '🍈', '🍒', '🍑', '🍍', '🥝', '🍅', '🥥', '🥑',
                    // 蔬菜
                    '🥦', '🥒', '🥬', '🥕', '🌽', '🥗', '🥔', '🍠',
                    '🥜', '🌰', '🍯', '🥐', '🥖', '🥨', '🥯', '🥞',
                    // 主食和肉类
                    '🍞', '🧀', '🍖', '🍗', '🥩', '🥓', '🍔', '🍟',
                    '🌭', '', '🥪', '🌮', '🌯', '🥙', '🥚', '🍳',
                    // 甜点和饮品
                    '🥘', '🍲', '🥣', '🥗', '🍿', '🧂', '🥫', '🍱',
                    '🍘', '🍙', '🍚', '🍛', '🍜', '🍝', '🍠', '🍢',
                    // 植物
                    '🌱', '🌲', '🌳', '🌴', '🌵', '🌾', '🌿', '☘',
                    '🍀', '🎍', '🎋', '🍃', '🍂', '🍁', '🍄', '🌸'
                ],
                '交通和地点': [
                    // 陆地交通
                    '🚗', '🚕', '🚙', '🚌', '🚎', '🏎', '🚓', '🚑',
                    '🚒', '🚐', '🚚', '🚛', '🚜', '🚲', '🛴', '🛵',
                    // 铁路交通
                    '🚂', '🚃', '🚄', '🚅', '🚆', '🚇', '🚈', '🚉',
                    '🚊', '🚝', '🚞', '🚋', '🚌', '🚍', '🚎', '🚐',
                    // 空中交通
                    '✈', '🛩', '🛫', '🛬', '🚁', '🚟', '🚠', '🚡',
                    '🛰', '🚀', '🛸', '💺', '🛶', '⛵', '🛥', '🚤',
                    // 地点和建筑
                    '🏠', '🏡', '🏢', '🏣', '🏤', '🏥', '🏦', '🏨',
                    '🏩', '🏪', '🏫', '🏬', '🏭', '🏯', '🏰', '💒'
                ],
                '爱心': [
                    // 第一行 - 彩色心形
                    '❤️', '🧡', '💛', '💚', '💙', '💜', '🤎', '🖤',
                    // 第二行 - 白色和特殊心形
                    '🤍', '❤️‍🔥', '❤️‍🩹', '💝', '💖', '💗', '💓', '💞',
                    // 第三行 - 装饰心形
                    '💕', '💟', '❣️', '💔', '♥️', '♡', '❥', '➳❤️',
                    // 第四行 - 设施图标
                    '🚾', '🅿️', '🚰', '🚹', '🚺', '🚻', '🚮', '📊',
                    // 第五行 - 文字图标
                    '🈁', '🈲', '🆗', '🆙', '🆒', '🆕', '🆓', '#️⃣',
                    // 第六行 - 数字 0-6
                    '*️⃣', '0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣',
                    // 第七行 - 数字 7-9 和控制
                    '7️⃣', '8️⃣', '9️⃣', '🔟', '🔢', '▶️', '⏸️', '⏭️',
                    // 第八行 - 播放控制
                    '⏹', '⏺', '⏩', '⏪', '⏫', '⏬', '🔀', '🔁',
                    // 第九行 - 控制和符号
                    '✓', '←', '←', '〜', '👁', '✓', '$', '↻',
                    // 第十行 - 数学符号
                    '+', '-', '×', '÷', '©', '®', '™', '◯',
                    // 第十一行 - 彩色圆形
                    '🔴', '🟠', '🟡', '🟢', '🔵', '🟣', '🟤', '⚫',
                    // 第十二行 - 彩色方形
                    '⬜', '🟥', '🟧', '🟨', '🟩', '🟦', '🟪', '🟫',
                    // 第十三行 - 黑色方形(由大到小)
                    '⬛', '⬜', '◾', '◽', '▪️', '▫️', '️', '▫️',
                    // 第十四行 - 宗教和和平符号
                    '☮', '✝', '☪', '🕉', '☸', '✡', '☯', '✴',
                    // 第十五行 - 指示符号
                    '💠', '🔷', '✳', '✴', '❌', '✅', '💫', '🌐',
                    // 第十六行 - 汉字符号
                    '割', '有', '無', '申', '営', '月', '✴', 'VS',
                    // 新增时钟系列 - 第一行
                    '🕐', '🕑', '🕒', '🕓', '🕔', '🕕', '🕖', '🕗',
                    // 时钟系列 - 第二行
                    '🕘', '🕙', '🕚', '🕛', '🕜', '🕝', '🕞', '🕟',
                    // 时钟系列 - 第三行
                    '🕠', '🕡', '🕢', '🕣', '🕤', '🕥', '🕦', '🕧',
                    // 对话框系列
                    '💭', '️', '💬', '🗯️', '👁️', '⏰', '⌚', '⏱️'
                ]
            };
        }

        init() {
            this.currentPrimaryTab = '😊';
            this.currentSecondaryTab = EmojiPicker.CATEGORIES['😊'][1];
            
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
                e.preventDefault();  // 防止默认行为
                e.stopPropagation();  // 阻止事件冒泡
                
                // 如果是 Summernote 相关的按钮，保存选区并保持焦点
                if (!this.settings.inputTarget) {
                    const $summernote = $('#summernote');
                    const $editor = $summernote.next('.note-editor');
                    const $editable = $editor.find('.note-editable');
                    
                    // 保存当前选区
                    const selection = window.getSelection();
                    if (selection && selection.rangeCount > 0) {
                        const range = selection.getRangeAt(0);
                        $summernote.data('lastRange', range);
                    } else {
                        // 如果没有选区，创建一个新的选区在编辑器末尾
                        const range = document.createRange();
                        const lastChild = $editable[0].lastChild || $editable[0];
                        range.setStart(lastChild, lastChild.length || 0);
                        range.setEnd(lastChild, lastChild.length || 0);
                        $summernote.data('lastRange', range);
                        
                        // 应用新选区
                        selection.removeAllRanges();
                        selection.addRange(range);
                    }
                    
                    // 保持编辑器焦点
                    $editable.focus();
                }
                
                this.toggle();
            });

            // 绑定关闭按钮事件
            this.$picker.find('.close-btn').on('click', () => {
                this.hide();
            });

            // 点击其他地方关闭
            $(document).on('click', (e) => {
                if (!$(e.target).closest('.emoji-picker').length && 
                    !$(e.target).closest(this.element).length) {
                    this.hide();
                }
            });

            // 绑定一级分类点击事件
            this.$picker.find('.primary-tab').on('click', (e) => this.onPrimaryTabClick(e));
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
            
            // 如果是 Summernote，保存当前选区
            if (!this.settings.inputTarget) {
                const $summernote = $('#summernote');
                const selection = window.getSelection();
                if (selection && selection.rangeCount > 0) {
                    const range = selection.getRangeAt(0);
                    $summernote.data('lastRange', range);
                }
            }
            
            this.updatePosition();
            this.$picker.show();
        }

        hide() {
            this.$picker.hide();
        }

        updatePosition() {
            const $input = $(this.settings.inputTarget);
            
            // 处理 Summernote 编辑器的情况
            if (!this.settings.inputTarget) {
                const $summernote = $('#summernote');
                const $editor = $summernote.next('.note-editor');
                const $editable = $editor.find('.note-editable');
                
                // 获取当前选区
                const selection = window.getSelection();
                if (selection && selection.rangeCount > 0) {
                    const range = selection.getRangeAt(0);
                    const rect = range.getBoundingClientRect();
                    
                    // 计算位置
                    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
                    
                    // 设置位置在光标所在行的下方
                    let top = rect.bottom + scrollTop + 5; // 光标底部位置加5px间距
                    let left = rect.left + scrollLeft;
                    
                    // 确保选择器不会超出窗口边界
                    const pickerWidth = this.$picker.outerWidth();
                    const pickerHeight = this.$picker.outerHeight();
                    const windowWidth = $(window).width();
                    const windowHeight = $(window).height();
                    
                    // 水平边界检查
                    if (left + pickerWidth > windowWidth) {
                        left = windowWidth - pickerWidth - 10;
                    }
                    if (left < 0) {
                        left = 10;
                    }
                    
                    // 垂直边界检查
                    if (top + pickerHeight > windowHeight + scrollTop) {
                        // 如果下方空间不足，显示在光标上方
                        top = rect.top + scrollTop - pickerHeight - 5;
                    }
                    
                    this.$picker.css({
                        top: top,
                        left: left
                    });
                    return;
                } else {
                    // 如果没有选区，默认显示在编辑器的当前视图位置
                    const editorPos = $editable.offset();
                    const scrollTop = $editable.scrollTop();
                    
                    this.$picker.css({
                        top: editorPos.top + 20,
                        left: editorPos.left + 20
                    });
                    return;
                }
            }
            
            // 处理普通 textarea 的情况
            if ($input.length) {
                const inputPos = $input.offset();
                const inputScrollTop = $input.scrollTop();
                const lineHeight = parseInt($input.css('lineHeight'));
                
                // 获取光标位置信息
                const cursorPosition = $input[0].selectionStart;
                const text = $input.val();
                const textBeforeCursor = text.substring(0, cursorPosition);
                
                // 计算光标所在行
                const lines = textBeforeCursor.split('\n');
                const currentLineNumber = lines.length - 1;
                const currentLineTop = currentLineNumber * lineHeight;
                
                // 创建临时元素来计算当前行光标的水平位置
                const currentLine = lines[lines.length - 1];
                const $temp = $('<span>').css({
                    position: 'absolute',
                    visibility: 'hidden',
                    whiteSpace: 'pre',
                    font: $input.css('font'),
                    fontSize: $input.css('fontSize'),
                    letterSpacing: $input.css('letterSpacing')
                }).text(currentLine);
                
                $('body').append($temp);
                const cursorOffset = $temp.width();
                $temp.remove();
                
                // 计算表情选择器的位置
                const pickerWidth = this.$picker.outerWidth();
                let left = inputPos.left + cursorOffset + parseInt($input.css('paddingLeft'));
                let top = inputPos.top + currentLineTop - inputScrollTop + lineHeight + parseInt($input.css('paddingTop'));
                
                // 确保选择器不会超出窗口边界
                const windowWidth = $(window).width();
                if (left + pickerWidth > windowWidth) {
                    left = windowWidth - pickerWidth - 10;
                }
                if (left < 0) {
                    left = 10;
                }
                
                // 如果选择器会超出窗口底部，则显示在光标上方
                const pickerHeight = this.$picker.outerHeight();
                const windowHeight = $(window).height();
                if (top + pickerHeight > windowHeight) {
                    top = top - pickerHeight - lineHeight;
                }
                
                this.$picker.css({
                    top: top,
                    left: left
                });
            }
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

            // 二级分类标签点击事件
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
            
            // 判断当前分类类型
            const isKaomoji = this.currentPrimaryTab === ';-)';
            const isSymbol = this.currentPrimaryTab === 'Ω';
            
            // 根据当前一级tab添加对应的内容样式类
            if (isKaomoji) {
                $content.addClass('kaomoji-content');
            } else if (isSymbol) {
                $content.addClass('symbol-content');
            }

            if (categoryName === '最近使用') {
                // 使用当前一级tab对应的最近使用记录
                Array.from(this.recentEmojis[this.currentPrimaryTab]).forEach(emoji => {
                    let className = 'emoji-item';
                    if (isKaomoji) {
                        className = 'kaomoji-item';
                    } else if (isSymbol) {
                        className = 'symbol-item';
                    }
                    $content.append(this.createEmojiElement(emoji, className));
                });
                return;
            }

            const emojis = EmojiPicker.EMOJI_DATA[categoryName] || [];
            
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
            } else {
                // Summernote 的处理
                const $summernote = $('#summernote');
                const lastRange = $summernote.data('lastRange');
                const $editor = $summernote.next('.note-editor');
                const $editable = $editor.find('.note-editable');
                
                if (!lastRange) {
                    // 如果没有保存的选区，创建一个新的选区在编辑器末尾
                    const range = document.createRange();
                    const lastChild = $editable[0].lastChild || $editable[0];
                    range.setStart(lastChild, lastChild.length || 0);
                    range.setEnd(lastChild, lastChild.length || 0);
                    $summernote.data('lastRange', range);
                }
                
                // 恢复选区并插入表情
                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(lastRange || $summernote.data('lastRange'));
                
                // 插入表情
                if (typeof this.settings.onSelect === 'function') {
                    this.settings.onSelect(emoji);
                }
                
                // 更新保存的选区
                if (selection.rangeCount > 0) {
                    const newRange = selection.getRangeAt(0);
                    $summernote.data('lastRange', newRange);
                }
            }

            // 添加到最近使用记录
            this.recentEmojis[this.currentPrimaryTab].add(emoji);
            if (this.recentEmojis[this.currentPrimaryTab].size > 30) {
                this.recentEmojis[this.currentPrimaryTab].delete(
                    Array.from(this.recentEmojis[this.currentPrimaryTab])[0]
                );
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
