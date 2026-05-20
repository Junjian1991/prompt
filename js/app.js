var AppState = {
    currentTemplate: 'T1',
    currentLang: 'zh',
    selectedOptions: {},
    customValues: {},
    templates: {},
    options: {}
};

var ConflictRules = {
    T1: [
        {
            name: '物种冲突',
            check: function(selected) {
                var species = selected['species'];
                if (species && (species === '动物' || species === '半兽人' || species === '机器人')) {
                    if (selected['gender'] && species !== '半兽人') {
                        return '选择动物或机器人时不应选择性别';
                    }
                }
                return null;
            }
        },
        {
            name: '年龄冲突',
            check: function(selected) {
                var species = selected['species'];
                var age = selected['age'];
                if (species === '机器人' && age) {
                    return '机器人不需要选择年龄';
                }
                return null;
            }
        },
        {
            name: '五官冲突',
            check: function(selected) {
                var species = selected['species'];
                if (species === '机器人') {
                    if (selected['eye_size'] || selected['eyebrow_shape'] || selected['lip_color']) {
                        return '机器人不需要选择五官特征';
                    }
                }
                return null;
            }
        }
    ],
    T2: [
        {
            name: '光线时间冲突',
            check: function(selected) {
                var lighting = selected['lighting'];
                var time = selected['time_of_day'];
                if (lighting && time) {
                    if ((lighting.includes('月光') && time !== '夜晚') || 
                        (lighting.includes('黄昏') && !time.includes('黄昏')) ||
                        (lighting.includes('正午') && time !== '正午')) {
                        return '光线与时间设置不一致';
                    }
                }
                return null;
            }
        },
        {
            name: '天气时间冲突',
            check: function(selected) {
                var weather = selected['weather'];
                var time = selected['time_of_day'];
                if (weather && time) {
                    if ((weather.includes('暴雨') || weather.includes('雷阵雨')) && time === '正午') {
                        return '正午通常不会有暴雨或雷阵雨';
                    }
                }
                return null;
            }
        }
    ],
    T3: [],
    T4: []
};

function loadJSON(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            callback(JSON.parse(xhr.responseText));
        }
    };
    xhr.send();
}

function initApp() {
    var loadCount = 0;
    var totalFiles = 2;
    
    loadJSON('data/templates.json', function(data) {
        AppState.templates = data.templates;
        loadCount++;
        checkInitComplete();
    });
    
    loadJSON('data/options.json', function(data) {
        AppState.options = data;
        loadCount++;
        checkInitComplete();
    });
    
    function checkInitComplete() {
        if (loadCount >= totalFiles) {
            renderOptionsPanel();
            updatePreview();
            bindEvents();
        }
    }
}

function renderOptionsPanel() {
    var panel = document.getElementById('optionsPanel');
    panel.innerHTML = '';
    
    var templateOptions = AppState.options[AppState.currentTemplate];
    if (!templateOptions) return;
    
    templateOptions.sections.forEach(function(section) {
        var sectionDiv = document.createElement('div');
        sectionDiv.className = 'option-section';
        sectionDiv.dataset.sectionName = section.name;
        
        var isHidden = false;
        if (section.name === '动物额外选项' || 
            section.name === '半兽人额外选项' || 
            section.name === '机器人额外选项') {
            isHidden = true;
            sectionDiv.classList.add('hidden-section');
        }
        
        sectionDiv.innerHTML = `
            <div class="section-header" onclick="toggleSection('${section.name}')">
                <span>${section.name}</span>
                <span class="expand-icon">▶</span>
            </div>
            <div class="section-content">
                ${renderOptions(section.options)}
            </div>
        `;
        
        panel.appendChild(sectionDiv);
    });
    
    initDefaultValues();
}

function renderOptions(options) {
    var html = '';
    
    options.forEach(function(option) {
        var optionHtml = '';
        
        switch(option.type) {
            case 'input':
                optionHtml = `
                    <div class="option-item">
                        <label class="option-label">${option.label}</label>
                        <input type="text" class="option-input" 
                               data-key="${option.key}" 
                               placeholder="${option.placeholder || ''}"
                               oninput="updateOption('${option.key}', this.value)">
                    </div>
                `;
                break;
                
            case 'textarea':
                optionHtml = `
                    <div class="option-item">
                        <label class="option-label">${option.label}</label>
                        <textarea class="option-input option-textarea" 
                                  data-key="${option.key}" 
                                  placeholder="${option.placeholder || ''}"
                                  oninput="updateOption('${option.key}', this.value)"></textarea>
                    </div>
                `;
                break;
                
            case 'select':
                var itemsHtml = option.items.map(function(item) {
                    return `<option value="${item.value}">${item.label}</option>`;
                }).join('');
                
                optionHtml = `
                    <div class="option-item">
                        <label class="option-label">${option.label}</label>
                        <select class="option-input option-select" 
                                data-key="${option.key}"
                                onchange="updateOption('${option.key}', this.value)">
                            <option value="">请选择</option>
                            ${itemsHtml}
                        </select>
                    </div>
                `;
                
                if (option.hasCustom) {
                    optionHtml += `
                        <button class="custom-btn" onclick="toggleCustomInput('${option.key}')">+ 自定义输入</button>
                        <div class="custom-input-container" id="custom-${option.key}">
                            <input type="text" class="custom-input" 
                                   placeholder="输入自定义内容..."
                                   oninput="updateCustomValue('${option.key}', this.value)">
                        </div>
                    `;
                }
                break;
                
            case 'multiSelect':
                var checkboxesHtml = option.items.map(function(item) {
                    var isSelected = option.defaultSelected && option.defaultSelected.includes(item.value);
                    return `
                        <label class="checkbox-item ${isSelected ? 'selected' : ''}" 
                               data-key="${option.key}" 
                               data-value="${item.value}"
                               onclick="toggleMultiSelect('${option.key}', '${item.value}')">
                            <input type="checkbox" ${isSelected ? 'checked' : ''}>
                            <span>${item.label}</span>
                        </label>
                    `;
                }).join('');
                
                optionHtml = `
                    <div class="option-item">
                        <label class="option-label">${option.label}</label>
                        <div class="option-checkboxes">
                            ${checkboxesHtml}
                        </div>
                    </div>
                `;
                
                if (option.hasCustom) {
                    optionHtml += `
                        <button class="custom-btn" onclick="toggleCustomInput('${option.key}')">+ 自定义输入</button>
                        <div class="custom-input-container" id="custom-${option.key}">
                            <input type="text" class="custom-input" 
                                   placeholder="输入自定义内容..."
                                   oninput="updateCustomValue('${option.key}', this.value)">
                        </div>
                    `;
                }
                break;
        }
        
        html += optionHtml;
    });
    
    return html;
}

function initDefaultValues() {
    var templateOptions = AppState.options[AppState.currentTemplate];
    if (!templateOptions) return;
    
    templateOptions.sections.forEach(function(section) {
        section.options.forEach(function(option) {
            if (option.type === 'multiSelect' && option.defaultSelected) {
                AppState.selectedOptions[option.key] = option.defaultSelected.slice();
            }
        });
    });
}

function toggleSection(sectionName) {
    var sections = document.querySelectorAll('.option-section');
    sections.forEach(function(section) {
        if (section.dataset.sectionName === sectionName) {
            section.classList.toggle('collapsed');
        }
    });
}

function toggleCustomInput(key) {
    var container = document.getElementById('custom-' + key);
    if (container) {
        container.classList.toggle('show');
    }
}

function updateOption(key, value) {
    if (value) {
        AppState.selectedOptions[key] = value;
    } else {
        delete AppState.selectedOptions[key];
    }
    
    if (key === 'species') {
        updateSpeciesSections(value);
    }
    
    updatePreview();
    checkConflicts();
}

function updateCustomValue(key, value) {
    if (value) {
        AppState.customValues[key] = value;
    } else {
        delete AppState.customValues[key];
    }
    updatePreview();
}

function toggleMultiSelect(key, value) {
    if (!AppState.selectedOptions[key]) {
        AppState.selectedOptions[key] = [];
    }
    
    var index = AppState.selectedOptions[key].indexOf(value);
    if (index === -1) {
        AppState.selectedOptions[key].push(value);
    } else {
        AppState.selectedOptions[key].splice(index, 1);
    }
    
    var labels = document.querySelectorAll(`.checkbox-item[data-key="${key}"]`);
    labels.forEach(function(label) {
        if (label.dataset.value === value) {
            label.classList.toggle('selected');
        }
    });
    
    updatePreview();
    checkConflicts();
}

function updateSpeciesSections(species) {
    var animalSection = document.querySelector('.option-section[data-section-name="动物额外选项"]');
    var beastSection = document.querySelector('.option-section[data-section-name="半兽人额外选项"]');
    var robotSection = document.querySelector('.option-section[data-section-name="机器人额外选项"]');
    
    if (animalSection) {
        animalSection.classList.toggle('hidden-section', species !== '动物');
    }
    if (beastSection) {
        beastSection.classList.toggle('hidden-section', species !== '半兽人');
    }
    if (robotSection) {
        robotSection.classList.toggle('hidden-section', species !== '机器人');
    }
    
    if (species !== '动物') {
        delete AppState.selectedOptions['animal_species'];
        delete AppState.selectedOptions['fur_color'];
        delete AppState.selectedOptions['animal_body_type'];
        delete AppState.selectedOptions['anthropomorphism'];
    }
    if (species !== '半兽人') {
        delete AppState.selectedOptions['base_species'];
        delete AppState.selectedOptions['human_beast_ratio'];
        delete AppState.selectedOptions['retained_features'];
    }
    if (species !== '机器人') {
        delete AppState.selectedOptions['robot_appearance'];
        delete AppState.selectedOptions['robot_material'];
        delete AppState.selectedOptions['robot_color'];
        delete AppState.selectedOptions['light_color'];
    }
}

function generatePrompt() {
    var template = AppState.templates[AppState.currentTemplate];
    if (!template) return '';
    
    var outputFormat = template.outputFormat;
    var data = {};
    
    for (var key in AppState.selectedOptions) {
        var val = AppState.selectedOptions[key];
        data[key] = Array.isArray(val) ? val.join('、') : val;
    }
    
    for (var key in AppState.customValues) {
        if (AppState.customValues[key]) {
            data[key] = AppState.customValues[key];
        }
    }
    
    var prompt = outputFormat;
    for (var key in data) {
        var regex = new RegExp('\\{\\{' + key + '\\}\\}', 'g');
        prompt = prompt.replace(regex, data[key] || '');
    }
    
    prompt = prompt.replace(/\{\{[\w_]+\}\}/g, '');
    
    return prompt;
}

function generateEnglishPrompt() {
    var prompt = generatePrompt();
    
    var translations = {
        '【角色名】': 'Character Name: ',
        '【物种】': 'Species: ',
        '【性别】': 'Gender: ',
        '【年龄】': 'Age: ',
        '【脸型】': 'Face Shape: ',
        '【面部特征】': 'Facial Features: ',
        '【发型】': 'Hairstyle: ',
        '【身体特征】': 'Body Features: ',
        '【服饰搭配】': 'Clothing: ',
        '【配饰】': 'Accessories: ',
        '【特殊体征】': 'Special Features: ',
        '【整体气质】': 'Temperament: ',
        '【姿态动作】': 'Pose: ',
        '【环境光线】': 'Lighting: ',
        '【风格锚点】': 'Style Anchor: ',
        '【约束】': 'Constraints: ',
        '【负面提示词】': 'Negative Prompts: ',
        '眼睛': 'eyes',
        '眼皮': 'eyelid',
        '眼尾': 'eye corner',
        '眼神': 'eye expression',
        '瞳色': 'eye color',
        '眉毛': 'eyebrows',
        '鼻子': 'nose',
        '嘴唇': 'lips',
        '唇色': 'lip color',
        '肤色': 'skin color',
        '身材': 'body type',
        '身高': 'height',
        '上身穿': 'wearing',
        '下身穿': 'with',
        '脚穿': 'and',
        '男性': 'male',
        '女性': 'female',
        '男': 'male',
        '女': 'female',
        '无性别': 'non-binary',
        '圆脸': 'round face',
        '瓜子脸': 'oval face',
        '方脸': 'square face',
        '长脸': 'long face',
        '鹅蛋脸': 'egg-shaped face',
        '菱形脸': 'diamond face',
        '国字脸': 'rectangular face',
        '心形脸': 'heart-shaped face',
        '大': 'large',
        '中': 'medium',
        '细长': 'slender',
        '单': 'single',
        '双': 'double',
        '内双': 'inner double',
        '上扬': 'upturned',
        '下垂': 'downturned',
        '平直': 'straight',
        '清澈': 'clear',
        '锐利': 'sharp',
        '温柔': 'gentle',
        '无神': 'lifeless',
        '空洞': 'empty',
        '凶狠': 'fierce',
        '呆萌': 'cute',
        '黑': 'black',
        '棕': 'brown',
        '蓝': 'blue',
        '绿': 'green',
        '红': 'red',
        '紫': 'purple',
        '金': 'gold',
        '异色瞳': 'heterochromia',
        '浓密': 'thick',
        '稀疏': 'sparse',
        '中等': 'medium',
        '剑眉': 'sword eyebrows',
        '柳叶眉': 'willow eyebrows',
        '平直眉': 'straight eyebrows',
        '上挑眉': 'raised eyebrows',
        '八字眉': 'downturned eyebrows',
        '连心眉': 'unibrow',
        '高挺': 'high and straight',
        '小巧': 'small',
        '圆润': 'round',
        '扁平': 'flat',
        '鹰钩': 'aquiline',
        '蒜头': 'bulbous',
        '厚': 'thick',
        '薄': 'thin',
        '适中': 'moderate',
        '淡红': 'light red',
        '自然': 'natural',
        '苍白': 'pale',
        '红润': 'rosy',
        '白皙': 'fair',
        '健康偏白': 'healthy fair',
        '小麦色': 'wheat-colored',
        '古铜': 'tan',
        '黝黑': 'dark',
        '光头': 'bald',
        '短发': 'short hair',
        '中长发': 'medium hair',
        '长发': 'long hair',
        '齐腰长发': 'waist-length hair',
        '深棕': 'dark brown',
        '浅棕': 'light brown',
        '白': 'white',
        '挑染': 'highlighted',
        '渐变色': 'gradient',
        '无刘海': 'no bangs',
        '微遮左眉': 'slight left bangs',
        '微遮右眉': 'slight right bangs',
        '中分': 'middle part',
        '齐刘海': 'straight bangs',
        '斜刘海': 'side bangs',
        '空气刘海': 'air bangs',
        '直发': 'straight',
        '卷发': 'curly',
        '波浪': 'wavy',
        '凌乱': 'messy',
        '刺头': 'spiky',
        '层次分明': 'layered',
        '马尾': 'ponytail',
        '双马尾': 'double ponytail',
        '丸子头': 'bun',
        '编发': 'braided',
        '背头': 'slicked back',
        '自然垂落': 'naturally falling',
        '极瘦': 'extremely thin',
        '清瘦': 'slim',
        '结实': 'athletic',
        '微胖': 'slightly chubby',
        '圆润': 'round',
        '肌肉型': 'muscular',
        '丰满': 'curvy',
        '矮小': 'short',
        '高大': 'tall',
        '九头身': 'nine-head figure',
        '肩宽腰窄': 'broad shoulders narrow waist',
        '梨形': 'pear-shaped',
        '偏矮': 'slightly short',
        '中等': 'average',
        '偏高': 'slightly tall',
        '极高': 'very tall',
        'T恤': 't-shirt',
        'Polo衫': 'polo shirt',
        '衬衫': 'shirt',
        '卫衣': 'hoodie',
        '校服外套': 'school uniform jacket',
        '运动外套': 'sports jacket',
        '帽衫': 'hooded sweatshirt',
        '西装': 'suit',
        '无袖': 'sleeveless',
        '条纹': 'striped',
        '格纹': 'plaid',
        '纯色': 'solid color',
        '字母': 'letters',
        '数字': 'numbers',
        '几何图案': 'geometric pattern',
        '动漫印花': 'anime print',
        '校徽': 'school emblem',
        '长裤': 'pants',
        '短裤': 'shorts',
        '牛仔裤': 'jeans',
        '运动裤': 'athletic pants',
        '短裙': 'skirt',
        '长裙': 'long skirt',
        '百褶裙': 'pleated skirt',
        '深蓝': 'navy',
        '卡其': 'khaki',
        '条纹拼色': 'striped color block',
        '跑鞋': 'running shoes',
        '帆布鞋': 'canvas shoes',
        '篮球鞋': 'basketball shoes',
        '足球鞋': 'soccer shoes',
        '皮鞋': 'leather shoes',
        '凉鞋': 'sandals',
        '靴子': 'boots',
        '红黑': 'red and black',
        '蓝白': 'blue and white',
        '灰蓝': 'gray and blue',
        '自定义配色': 'custom color',
        '帽子': 'hat',
        '发带': 'headband',
        '手表': 'watch',
        '背包': 'backpack',
        '眼镜': 'glasses',
        '耳机': 'headphones',
        '项链': 'necklace',
        '围巾': 'scarf',
        '护具': 'protective gear',
        '安静': 'quiet',
        '清冷': 'cool',
        '阳光': 'cheerful',
        '忧郁': 'melancholy',
        '凶狠': 'fierce',
        '随性': 'casual',
        '优雅': 'elegant',
        '高冷': 'aloof',
        '憨厚': 'honest',
        '雀斑': 'freckles',
        '痣': 'mole',
        '疤痕': 'scar',
        '酒窝': 'dimple',
        '虎牙': 'fang',
        '兽耳': 'animal ears',
        '角': 'horns',
        '尾巴': 'tail',
        '翅膀': 'wings',
        '机械臂': 'mechanical arm',
        '无表情': 'expressionless'
    };
    
    for (var key in translations) {
        prompt = prompt.replace(new RegExp(key, 'g'), translations[key]);
    }
    
    prompt = prompt.replace(/（[^）]+）/g, '');
    prompt = prompt.replace(/；/g, ', ');
    prompt = prompt.replace(/，/g, ', ');
    prompt = prompt.replace(/。/g, '. ');
    
    return prompt;
}

function generatePlainText() {
    var prompt = generatePrompt();
    return prompt.replace(/【[^】]+】/g, '');
}

function updatePreview() {
    var preview = document.getElementById('previewTextarea');
    var tokenCount = document.getElementById('tokenCount');
    
    if (AppState.currentLang === 'zh') {
        preview.value = generatePrompt();
    } else {
        preview.value = generateEnglishPrompt();
    }
    
    var count = Math.ceil(preview.value.length / 4);
    tokenCount.textContent = 'Token: ' + count;
}

function checkConflicts() {
    var panel = document.getElementById('conflictsPanel');
    var rules = ConflictRules[AppState.currentTemplate] || [];
    var conflicts = [];
    
    rules.forEach(function(rule) {
        var result = rule.check(AppState.selectedOptions);
        if (result) {
            conflicts.push(result);
        }
    });
    
    if (conflicts.length > 0) {
        panel.innerHTML = conflicts.map(function(c) {
            return `<div class="conflict-item">⚠ ${c}</div>`;
        }).join('');
        panel.classList.add('show');
    } else {
        panel.classList.remove('show');
        panel.innerHTML = '';
    }
}

function switchTemplate(templateId) {
    AppState.currentTemplate = templateId;
    AppState.selectedOptions = {};
    AppState.customValues = {};
    
    var tabs = document.querySelectorAll('.template-tab');
    tabs.forEach(function(tab) {
        tab.classList.toggle('active', tab.dataset.template === templateId);
    });
    
    renderOptionsPanel();
    updatePreview();
    checkConflicts();
}

function switchLang(lang) {
    AppState.currentLang = lang;
    
    var buttons = document.querySelectorAll('.lang-btn');
    buttons.forEach(function(btn) {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    
    updatePreview();
}

async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        var textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        return true;
    }
}

function bindEvents() {
    document.querySelectorAll('.template-tab').forEach(function(tab) {
        tab.addEventListener('click', function() {
            switchTemplate(this.dataset.template);
        });
    });
    
    document.querySelectorAll('.lang-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            switchLang(this.dataset.lang);
        });
    });
    
    document.getElementById('copyFull').addEventListener('click', async function() {
        var text = generatePrompt();
        await copyToClipboard(text);
        this.classList.add('copy-complete');
        setTimeout(() => this.classList.remove('copy-complete'), 2000);
    });
    
    document.getElementById('copyPlain').addEventListener('click', async function() {
        var text = generatePlainText();
        await copyToClipboard(text);
        this.classList.add('copy-complete');
        setTimeout(() => this.classList.remove('copy-complete'), 2000);
    });
    
    document.getElementById('copyEnglish').addEventListener('click', async function() {
        var text = generateEnglishPrompt();
        await copyToClipboard(text);
        this.classList.add('copy-complete');
        setTimeout(() => this.classList.remove('copy-complete'), 2000);
    });
}

document.addEventListener('DOMContentLoaded', initApp);