# hexo-butterfly-posts-swiper

给`hexo-theme-butterfly`添加 [侧边栏文章轮播图](https://blog.lovelee.cn/lee/40059.html)

# 安装

1. 安装插件,在博客根目录`[Blogroot]`下打开终端，运行以下指令：
  ```bash
  npm install hexo-butterfly-posts-swiper --save
  ```

2. 添加配置信息，以下为写法示例
    在站点配置文件`_config.yml`或者主题配置文件`_config.butterfly.yml`中添加

  ```yaml
# posts_swiper
# see https://github.com/jia0213/hexo-butterfly-posts-swiper
posts_swiper:
  enable: true # 开关
  priority: 7 #过滤器优先权
  limit: 6 # 默认6展示项目中前六
  mobile: false # 默认false
  img404: # 图片失联之后显示的图片
  enable_page: all # 应用页面
  exclude:
    # - /posts/
    # - /about/
  layout: # 挂载容器类型
    type: class
    name: sticky_layout
    index: 0
  loading: #加载动画自定义
  setting: 
    fx: 'random' # 'random','simpleFade','curtainTopLeft','curtainTopRight','curtainBottomLeft','curtainBottomRight','curtainSliceLeft','curtainSliceRight','blindCurtainTopLeft','blindCurtainTopRight','blindCurtainBottomLeft','blindCurtainBottomRight','blindCurtainSliceBottom','blindCurtainSliceTop','stampede','mosaic','mosaicReverse','mosaicRandom','mosaicSpiral','mosaicSpiralReverse','topLeftBottomRight','bottomRightTopLeft','bottomLeftTopRight','bottomLeftTopRight','scrollLeft','scrollRight','scrollTop','scrollBottom','scrollHorz'
    # pagination: false
    time: 3000
    transPeriod: 1000
    navigationHover: true
  
  ```
3. 参数释义

|参数|备选值/类型|释义|
|:--|:--|:--|
|priority|number|【可选】过滤器优先级，数值越小，执行越早，默认为10，选填|
|enable|true/false|【必选】控制开关|
|enable_page|path|【可选】填写想要应用的页面,如根目录就填'/',分类页面就填'/categories/'。若要应用于所有页面，就填`all`，默认为`all`|
|exclude|path|【可选】填写想要屏蔽的页面，可以多个。写法见示例。原理是将屏蔽项的内容逐个放到当前路径去匹配，若当前路径包含任一屏蔽项，则不会挂载。|
|layout.type|id/class|【可选】挂载容器类型，填写id或class，不填则默认为id|
|layout.name|text|【必选】挂载容器名称|
|layout.index|0和正整数|【可选】前提是layout.type为class，因为同一页面可能有多个class，此项用来确认究竟排在第几个顺位 （受到同类插件加载顺序影响，真正插入dom会有排序误差）|
|loading|URL|【可选】文章轮播图加载动画的图片|
|setting||【可选】播放配置（已做精简）|
|fx|string|【可选】文章轮播图动画效果|
|time|nnumber|【可选】动画停留时长|
|transPeriod|nnumber|【可选】动画切换过程时长|
|navigationHover|bealoon|【可选】鼠标移上出现切换按钮|


# 截图
![](https://img.gejiba.com/images/bbe9ce248bf542d1e76df05979f6cc71.png)
