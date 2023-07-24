// 获取输入值
var formatVersion = document.querySelector('input[name="formatVersion"]:checked').value;
var packName = document.getElementById('packName').value;
var packDescription = document.getElementById('packDescription').value;
var packUUID = document.getElementById('packUUID').value;
var packV1 = document.getElementById('packV1').value,
packV2 = document.getElementById('packV2').value,
packV3 = document.getElementById('packV3').value;
var minEngineVersion = document.getElementById('minEngineVersion').value;
var moduleVersion = document.getElementById('moduleVersion').value;
var moduleType = document.getElementsByName('moduleType');
var moduleTypeValue = document.querySelector('input[name="moduleType"]:checked').value;
var moduleLanguage = document.getElementById('moduleLanguage').value;
var moduleEntry = document.getElementById('moduleEntry').value;
var moduleUUID = document.getElementById('moduleUUID').value;
var moduleDescription = document.getElementById('moduleDescription').value;
var dependencyPackUUID = document.getElementById('dependencyPackUUID').value;
var dependencyPackVersion = document.getElementById('dependencyPackVersion').value;

var useDependencyPackCheckbox = document.getElementById('useDependencyPack'),
useServerCheckbox = document.getElementById('useServer'),
useUiCheckbox = document.getElementById('useUi'),
useGametestCheckbox = document.getElementById('useGametest');

var checkboxes = Array.from(document.querySelectorAll('.checkbox'));

var useDependencyPack = useDependencyPackCheckbox.checked,
useServer = useServerCheckbox.checked,
useUi = useUiCheckbox.checked,
useGametest = useGametestCheckbox.checked;

//var checkboxes = [useServerCheckbox, useUiCheckbox, useGametestCheckbox];

// 多选按钮显控
moduleType.forEach(function(radio) {
  radio.addEventListener('change', toggleShow)
})
function toggleShow() {
  //var isScript = (moduleTypeValue === 'script');
  if (this.value === "script") {
	checkboxes.forEach((show) => {
	  show.style.display = "block";
	  console.log('显示复选框')
	})
  } else {
	checkboxes.forEach((hidn) => {
		hidn.style.display = "none";
		console.log('隐藏脚本复选框')
	})
  }
  /*checkboxes.forEach(function(checkbox) {
    checkbox.style.display = isScript ? 'block' : 'none';
    checkbox.checked = isScript && checkbox.checked;
    })*/
};

// 依赖包选项显控
var pack = document.querySelector('.pack');
useDependencyPackCheckbox.addEventListener('change', function() {
  pack.style.display = this.checked ? 'block' : 'none';
});

// server选项显控
var server = document.querySelector('.server');
useServerCheckbox.addEventListener('change', function() {
  server.style.display = this.checked ? 'block' : 'none';
});

// ui选项显控
var ui = document.querySelector('.ui');
useUiCheckbox.addEventListener('change', function() {
  ui.style.display = (moduleTypeValue === 'script') && this.checked ? 'block' : 'none';
});

// gametest选项显控
var gametest = document.querySelector('.gametest');
useGametestCheckbox.addEventListener('change', function() {
  gametest.style.display = (moduleTypeValue === 'script') && this.checked ? 'block' : 'none';
});

// 获取所有的 <span> 元素，并将其转换为数组
var spans = Array.from(document.getElementsByTagName('span'));

// 遍历每个 <span> 元素
spans.forEach(function(span) {
  // 检查内容是否为 "*"
  if (span.textContent.trim() === '*') {
    // 设置红色样式
    span.style.color = 'red';
  }
});

function buildManifest(event) {
  // 防止页面重载
  event.preventDefault();

  // 构建 manifest 对象
var manifest = {
  format_version: formatVersion,
  header: {
    name: packName,
    description: packDescription,
    uuid: packUUID || buildUUID(),
    version: [packV1, packV2, packV3]
  },
  min_engine_version: minEngineVersion,
  modules: [
    {
      version: moduleVersion,
      type: moduleTypeValue,
      ...(moduleTypeValue === 'script' && {
        language: moduleLanguage,
        entry: moduleEntry
      }),
      uuid: moduleUUID || buildUUID(),
      description: moduleDescription
    }
  ],
  dependencies: []
};

  if (useDependencyPack) {
    var dependencyPackUUID = document.getElementById('dependencyPackUUID').value;
    var dependencyPackVersion = document.getElementById('dependencyPackVersion').value;

    // 创建依赖包对象
    var dependencyPack = {
      pack: dependencyPackUUID,
      version: dependencyPackVersion
    };

    // 将依赖包对象添加到 manifest.dependencies 数组中
    manifest.dependencies.push(dependencyPack);
  }

  if (useServer) {
    var serverModuleVersion = document.getElementById('serverModuleVersion').value;

    // 创建 server 模块对象
    var serverModule = {
      module: '@minecraft/server',
      version: serverModuleVersion
    };

    // 将 server 模块对象添加到 manifest.dependencies 数组中
    manifest.dependencies.push(serverModule);
  }

  if (useUi) {
    var uiModuleVersion = document.getElementById('uiModuleVersion').value;

    // 创建 server-ui 模块对象
    var uiModule = {
      module: '@minecraft/server-ui',
      version: uiModuleVersion
    };

    // 将 server-ui 模块对象添加到 manifest.dependencies 数组中
    manifest.dependencies.push(uiModule);
  }

  if (useGametest) {
    var gametestModuleVersion = document.getElementById('gametestModuleVersion').value;

    // 创建 server-gametest 模块对象
    var gametestModule = {
      module: '@minecraft/server-gametest',
      version: gametestModuleVersion
    };

    // 将 server-gametest 模块对象添加到 manifest.dependencies 数组中
    manifest.dependencies.push(gametestModule);
  }

  // 将 manifest 对象转换为 JSON 字符串
  var jsonString = JSON.stringify(manifest, null, 2);

  // 将 JSON 字符串显示在 textarea 中
  var textArea = document.getElementById('text');
  textArea.style.display = 'block';
  textArea.value = jsonString;

  // 显示复制和下载按钮
  var copyButton = document.querySelector('.copyButton');
  var downloadButton = document.querySelector('button[download]');
  copyButton.style.display = 'block';
  downloadButton.style.display = 'block';
}

// 生成uuid
function buildUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === "x" ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function copyText() {
  var textArea = document.getElementById('text');
  textArea.select();
  document.execCommand('copy');

  var copyButton = document.querySelector('.copyButton');
  copyButton.innerText = '已复制';
  setTimeout(function () {
    copyButton.innerText = '复制内容';
  }, 2000);
}

function saveJSON() {
  var textArea = document.getElementById('text');
  var manifestJson = textArea.value;
  var dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(manifestJson);
  var downloadLink = document.createElement('a');
  downloadLink.setAttribute('href', dataUri);
  downloadLink.setAttribute('download', 'manifest.json');
  downloadLink.style.display = 'none';
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}