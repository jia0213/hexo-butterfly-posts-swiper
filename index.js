'use strict'
// 全局声明插件代号
const pluginName = 'posts_swiper';
const version = '0.0.1'; // 初学，进行一版尝试
// 全局声明依赖
const pug = require('pug')
const path = require('path')
const urlFor = require('hexo-util').url_for.bind(hexo);
const fs = require('fs');
// const util = require('hexo-util')

// const css = hexo.extend.helper.get('css').bind(hexo);
// const js = hexo.extend.helper.get('js').bind(hexo);

//  after_post_render  after_init
hexo.extend.generator.register('get_posts', function (locals) {
    // console.log(_typeof(locals.posts)); // => Array
    let postArr = [];
    locals.posts.map(v => {
      // console.log(v,'v');
      let {
        title,
        date,
        cover,
        description,
        path,
        permalink
      } = v;
      postArr.push({
        title,
        date,
        cover,
        description,
        path,
        permalink
      })
    })
    const config = hexo.config[pluginName] ? hexo.config[pluginName] : hexo.theme.config[pluginName]
    // 如果配置开启
    if (!(config && config.enable)) return
    // 集体声明配置项
    const data = {
      enable_page: config.enable_page ? config.enable_page : "all",
      mobile: config.mobile ? config.mobile : false,
      exclude: config.exclude,
      limit: config.limit || 6,
      setting:config.setting || {},
      layout_type: config.layout.type,
      layout_name: config.layout.name,
      layout_index: config.layout.index ? config.layout.index : 0,
      loading: config.loading ? urlFor(config.loading) : "https://unpkg.zhimg.com/hexo-butterfly-clock/lib/loading.gif",
    }
    // 渲染页面
    const temple_html_text = config.temple_html ? config.temple_html : pug.renderFile(path.join(__dirname, './lib/html.pug'), data)
    //样式资源
    // const css_text = data.mobile ?
    //   `<link rel="stylesheet" href="${''}" media="print" onload="this.media='all'">` :
    //   `<link rel="stylesheet" href="${''}" media="print" onload="this.media='screen'">`;
    //脚本资源
    // const js_text = `
    //   <script src="${''}"></script>
    //   <script data-pjax src="${''}"></script>
    //   <script data-pjax src="${''}"></script>
    // `
    // 载入配套资源 -> 东西有点多 —_—
    renderLibFile(['./lib/css/diapo.css','./lib/css/diapo_extend.css','./lib/js/jquery.easing.1.3.js','./lib/js/jquery.hoverIntent.minified.js','./lib/js/diapo.min.js']);

    //注入容器声明
    let get_layout;
    switch (data.layout_type) {
      case 'class':
        get_layout = `document.getElementsByClassName('${data.layout_name}')[${data.layout_index}]`
        break;
      case 'id':
        get_layout = `document.getElementById('${data.layout_name}')`
        break;
      default:
        get_layout = `document.getElementById('${data.layout_name}')`
        break;
    }

    let effectArr = ['fromLeft', 'fromRight', 'fromTop', 'fadeIn','fromBottom'] ;
    let dom = '';
    postArr.slice(0,data.limit+1).map(v=>{
      let effect = effectArr[Math.floor(Math.random()*effectArr.length)];
      let bg = `background-image: linear-gradient(to right, ${randomColor()}, ${randomColor()});`
      let srcHolder = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4QDeRXhpZgAASUkqAAgAAAAGABIBAwABAAAAAQAAABoBBQABAAAAVgAAABsBBQABAAAAXgAAACgBAwABAAAAAgAAABMCAwABAAAAAQAAAGmHBAABAAAAZgAAAAAAAABIAAAAAQAAAEgAAAABAAAABwAAkAcABAAAADAyMTABkQcABAAAAAECAwCGkgcAFgAAAMAAAAAAoAcABAAAADAxMDABoAMAAQAAAP//AAACoAQAAQAAACgAAAADoAQAAQAAACgAAAAAAAAAQVNDSUkAAABQaWNzdW0gSUQ6IDk1Of/bAEMACAYGBwYFCAcHBwkJCAoMFA0MCwsMGRITDxQdGh8eHRocHCAkLicgIiwjHBwoNyksMDE0NDQfJzk9ODI8LjM0Mv/bAEMBCQkJDAsMGA0NGDIhHCEyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMv/CABEIACgAKAMBIgACEQEDEQH/xAAZAAADAQEBAAAAAAAAAAAAAAAABAUDAQb/xAAWAQEBAQAAAAAAAAAAAAAAAAAAAQL/2gAMAwEAAhADEAAAAfCas0Fg99NISYPBZ3R2LcV1KamnCxLoJqwCJAL/AP/EACAQAAICAQMFAAAAAAAAAAAAAAECAAMSBBETEBQhIiP/2gAIAQEAAQUCx8NUVXBoEJ6VAbVKkspCLkSLQsTet2UT5TiRLNRiTpzO8DO7F6uZ1qudWJsJmfqtlmTXbuSZ/8QAGREAAgMBAAAAAAAAAAAAAAAAABEBECAh/9oACAEDAQE/AVcDOY//xAAWEQADAAAAAAAAAAAAAAAAAAABECD/2gAIAQIBAT8BZr//xAAmEAACAQMCBAcAAAAAAAAAAAAAARECEiExUQMQMkETQnGBobHB/9oACAEBAAY/ApE9zR87apnYyngcPNR4VslNqFTRDb6j7ewqtcFy8uuNSUoncvtSW7KrUrdjt6ISqpl9x8SHPxJ+Ij3OpkvMLBE4P//EAB0QAQADAAMBAQEAAAAAAAAAAAEAESExQVFxgRD/2gAIAQEAAT8htC0Q+CCNF3yDqHH8bqB4F7CbYzZ1NQPaIgKOUNjwsPBnMupaK7/YO2jkyiraFqNZfsuLgUBpKwrxEtqxqdQECQAoHcZ+0omAq51cDmbzEWPQ/CGHEGBWOaJTiohgjRup/9oADAMBAAIAAwAAABACIxxYEL3z/8QAGhEBAAIDAQAAAAAAAAAAAAAAAQARECExQf/aAAgBAwEBPxAshce0YrdsSHPYL243j//EABkRAAIDAQAAAAAAAAAAAAAAAAABECAhMf/aAAgBAgEBPxCWF1m0/8QAHxABAQADAAMBAQEBAAAAAAAAAREAITFBUWFxkcHh/9oACAEBAAE/EDvE0ftwIp1ErcBuNgG1xoIdXWJng/NMceMaRkrsn1/MmlyisejrmLG8IkC2P3mOlICEm+X3myjUjs9XlMRSaepq99zeOoxl1ISx5+5YlmYU9devTj03YTo108PpMOVE4iLZfN1nk06PP9+5PQyKP4FOrrHfjyj0N8/8xghxoAfj0njIxhgQmnzFiSGZu4JJGmOrJf5kASIcMl4ZTP/Z';
      dom += `<div class="full-fill " >`;
      dom += `<a href="/${v.path}" class="full-fill">`;
      if(v.cover)dom += `<img class="full-fill" src="${v.cover}">`
      if(!v.cover){
        dom += `<img label="_" src="${srcHolder}" style="${bg}" class="no-cover-img" />`;
        dom += `<div class="no-cover-bg" style="${bg}" ></div>`;
      }
      dom += `<div data-easing="easeOutExpo" class="${effect} col-diapo-text" >`;
      dom += `<dl>`;
      dom += `<dt class="tac">${v.title || v.description}</dt>`;
      if(v.description) dom += `<dd class="tac" >${v.description}</dd>`;
      dom += `</dl>`;   
      dom +=`</div>`;
      dom += `</a>`;
      dom += `</div>`;
    })
    var _setting = JSON.stringify(data.setting);
    var user_info_js = `<script data-pjax script-label="${pluginName}">
            function ${pluginName}_injector_config(){
              var dom = \`${dom}\`;
              var mobile = ${data.mobile};
              var setting = JSON.parse(\`${_setting}\`);
              var parent_div_git = ${get_layout};
              var item_html = '${temple_html_text}'; // pug 模版 整体插件outer
              console.log('已挂载${pluginName}')
              // parent_div_git.insertAdjacentHTML("afterbegin",item_html);
              var curUa = navigator.userAgent;
              start()
              $(window).on('resize',()=>{
                var ua = navigator.userAgent;
                // if(curUa == ua)return;
                clearInterval(window._posts_swiper);
                window._posts_swiper = setTimeout(() => {
                  start();
                }, 300);
              })
              function start(){
                var elm = $('.card-posts-swiper');
                var ua = navigator.userAgent;
                if(!mobile && /(android)|(ios)|(iphone)/i.test(ua)){
                  $(item_html).index();
                  $('.pix_diapo').html('');
                  elm.remove();
                }else{
                  elm.remove();
                  parent_div_git.insertAdjacentHTML("afterbegin",item_html);
                  setTimeout(()=>{
                    initPostsSwiper();
                  },1050);
                }
              }
              function initPostsSwiper(){
                $(item_html).find("img[label='_']").each(function(i,e){
                  let elm = getComputedStyle(e,"::after");
                  e.style.backgroundImage = $(e).css("backgroundImage");
                })
                $('.pix_diapo').html('').html(dom).diapo({
                  ...{
                    fx: 'random',
                    loader: 'none',
                    pagination: false,
                    time: 3000,
                    thumbs: false,
                    transPeriod: 800,
                    navigation: true,
                    mobileNavigation: false,
                    navigationHover: true,
                    mobileNavHover: false
                  },
                  ...setting
                }); 
                $('.pix_diapo').find("img[data-lazy-src]").each(function(i,e){
                  if($(e).attr('src') != $(e).attr('data-lazy-src'))$(e).attr('src',$(e).attr('data-lazy-src'));
                })
              }
            }
            var elist = '${data.exclude}'.split(',');
            var cpage = location.pathname;
            var epage = '${data.enable_page}';
            var flag = 0;
            for (var i=0;i<elist.length;i++){
                if (cpage.includes(elist[i]))flag++;
            }
            if ((epage ==='all')&&(flag == 0)){
              if(document.querySelectorAll('script[script-label=${pluginName}]').length<=1){
                // console.log('已经有过了',document.querySelectorAll('script[script-label=${pluginName}]').length,'次');
                ${pluginName}_injector_config();
              }
            }else if (epage === cpage){
              if(document.querySelectorAll('script[script-label=${pluginName}]').length<=1){
                // console.log('已经有过了',document.querySelectorAll('script[script-label=${pluginName}]').length,'次');
                ${pluginName}_injector_config();
              }
            }
        </script>`
    // 注入用户脚本
    // 此处利用挂载容器实现了二级注入
    // 注入样式资源
    // hexo.extend.injector.register('head_end', css_text, "default");
    // 注入脚本资源
    // hexo.extend.injector.register('body_end', js_text, "default");
    hexo.extend.injector.register('body_end', user_info_js, "default");

    /* return {
        path: 'get_posts.txt',
        data: postArr
    }; */
  },
  hexo.extend.helper.register('priority', function () {
    // 过滤器优先级，priority 值越低，过滤器会越早执行，默认priority是10
    const pre_priority = hexo.config[pluginName].priority ? hexo.config[pluginName].priority : hexo.theme.config[pluginName].priority
    const priority = pre_priority ? pre_priority : 10
    return priority
  })
);

function _typeof() {
  return Object.prototype.toString.call([]).slice(8).replace(']', '');
}
// 初版未指定cdn 。故直接插入对应引用
function renderLibFile(filePath){
  if(_typeof(filePath)=='String')filePath = [filePath];
  const pathFn = path;
  const files = [];
  filePath.forEach(v=>{
    var suffix = v.substr(v.lastIndexOf(".")+1);//js css
    const tmp_src = pathFn.join(__dirname, v)
    const fileContent = fs.readFileSync(tmp_src, 'utf8');
    let result = '';
    if(suffix=='js')result = `<script data-label="${pluginName}">${fileContent}</script>`
    if(suffix=='css')result = `<style  data-label="${pluginName}" >${fileContent}</style>`
    files.push({
      type:suffix,
      data:result
    });
  })
  files.map(({type,data})=>{
    if(type == 'css')hexo.extend.injector.register('head_end', data, "default");
    if(type == 'js')hexo.extend.injector.register('body_end', data, "default");
  })
  
}
function randomColor() {
  let r = Math.floor(Math.random() * 255)
  let g = Math.floor(Math.random() * 255)
  let b = Math.floor(Math.random() * 255)
  return `rgb(${r}, ${g}, ${b})`
}