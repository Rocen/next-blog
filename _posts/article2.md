---
title: Next.js入门（渲染模式）
description: 介绍Next.js中的渲染模式。
date: 13 April 2023
categories: Next
---

## 目录
- [前言](#前言)
- [常见的渲染模式](#常见的渲染模式)
- [同构渲染](#同构渲染)
- [Nextjs中的渲染模式](#Nextjs中的渲染模式)
- [使用方法](#使用方法)
- [Next.js渲染模式之间的对比](#Next.js渲染模式之间的对比)
- [Next.js构建](#Next.js构建)
- [总结](#总结)

## 前言
本文主要是分析 Next.js 中的渲染模式，也会结合我们实际开发中用到的渲染模式来进行分析。

## 常见的渲染模式
首先来回顾一下页面完整的渲染流程：
1. 浏览器通过请求得到一个`HTML`文本
2. 渲染进程解析`HTML`文本，构建`DOM`树
3. 解析`HTML`的同时，如果遇到内联样式或者样式脚本，则下载并构建样式规则（stytle rules），若遇到`JavaScript`脚本，则会下载执行脚本。
4. `DOM`树和样式规则构建完成之后，渲染进程将两者合并成渲染树（render tree）
5. 渲染进程开始对渲染树进行布局，生成布局树（layout tree）
6. 渲染进程对布局树进行绘制，生成绘制记录
7. 渲染进程的对布局树进行分层，分别栅格化每一层，并得到合成帧
8. 渲染进程将合成帧信息发送给`GPU`进程进而显示到屏幕上

可以看到，页面的渲染就是浏览器将`HTML`文本转化为页面帧的过程，这也是`CSR`（client side render）的主要流程。

与之`CSR`对应的就是`SSR`（server side render）。顾名思义，服务端渲染就是在浏览器请求页面`URL`的时候，服务端会将需要的`HTML`组装并以文本的形式返回给浏览器。当浏览器接收到`HTML`文本后会开始解析，但是并不需要经过`Javascript`脚本的执行，即可构建出`DOM`树并展示到页面中。这个服务端组装`HTML`的过程，就叫做**服务端渲染**。

那么对比一下CSR和SSR，这两者最大的区别在于前者的页面渲染是JS负责执行的，而后者是服务器直接返回HTML让浏览器直接渲染。

相比之下，CSR的弊端就比较明显了：
1. 白屏时间较长：由于渲染页面的过程需要请求JS脚本和React代码的执行，所以加载时间会比较慢，所以反映到渲染完成的时间就晚
2. 利于SEO：对于SEO（Search Engine Optimazition，即搜索引擎优化）不友好，因为搜索引擎爬虫只认识html结构的内容，而不能识别JS代码内容

所以，SSR的出现就是为了解决传统CSR的弊端。

## 同构渲染
经过上面`CSR`和`SSR`的对比，我们知道`CSR`的弊端，那么`SSR`就没有问题了吗？

`SSR`最大的问题就是无法响应`JS`事件，因为服务端组装完成的`HTML`是纯字符串的格式，在浏览器中会直接进行渲染。`DOM`元素上的事件也就不会被绑定。

所谓同构，通俗的讲，就是一套`React`代码在服务器上运行一遍，到达浏览器又运行一遍。 服务端渲染完成页面结构，客户端渲染绑定事件。它是在`SPA`的基础上，利用服务端渲染直出首屏，解决了单页面应用首屏渲染慢的问题。

当前的主流服务端渲染采用都是同构渲染，即`SSR`和`CSR`相结合的方式。首屏使用`SSR`，其他页面使用`CSR`。

## Nextjs中的渲染模式
除了上面三种渲染模式，Next.js中还有两种渲染模式：
+ SSG（Static Site Generation）
+ ISG（Incremental Static Regeneration）

SSG是针对那些纯静态的页面，会在构建时（项目构建）就生成该页面对应的HTML。相比SSR，服务器可以在接收到请求的时候立即把HTM返回给浏览器，不在需要动态生成HTML，所以性能会更好。

ISR是在SSG的基础上衍生的一种渲染模式，允许用户在首次创建静态页面后再进行更新，进而重新生成静态页面。

## 使用方法
使用这些渲染模式的关键在于如何获取页面中可能用到的数据。

从`Next.js`文档上，在[数据获取](https://nextjs.org/docs/basic-features/data-fetching/overview)录可以看到获取数据的几种方式，其实也是`Next.js`的几种处理方式。根据不同的方式，最终就会形成不同的渲染模式。

主要获取数据的方式有以下几种：
+ `getStaticProps`
+ `getInitialProps`
+ `getServerSideProps`
+ 客户端获取（使用Hooks）

其实`Next.js`项目的首屏渲染都返回了包含页面内容的`html`，其实也算是`SSR`，只是不一定需要在服务端进行实时合成`html`内容，切换页面都是`CSR`，因此首屏访问都会比较快。

`Next.js`首屏渲染模式有以下几种：
+ 页面静态化（SSG）：`nextjs`应用页面会默认静态化，不使用 `getServerSideProps`和`getInitialProps`，可以使用`getStaticPaths`和`getStaticProps`配合动态参数的路由动态生成页面
+ 静态增量再生（ISG）：使用`getStaticProps`来获取数据才能实现，且配合其返回的参数`revalidate`来控制，也可以配合`getStaticPaths`或者接口通知的方式 来实现动态路由的静态增量
+ 服务端动态渲染（SSR）：使用`getServerSideProps`和`getInitialProps`进行渲染的模式

其中`getServerSideProps`和`getInitialProps`都能实现在服务端实时合成页面内容，在实际使用上并无太大差别。

## Next.js渲染模式之间的对比
`getServerSideProps`和`getInitialProps`服务端渲染的性能体验其实是比静态化差的，下面我们分析一下`getStaticProps/getServerSideProps/getInitialProps`的优劣：
+ `getStaticProps`：首屏渲染直接返回构建好的`html`，不需要服务端做其他操作；跳转页面时只用加载`client`目录对应页面的`js`资源；`nodejs`服务器只需要转发资源即可，压力很低
+ `getServerSideProps`：首屏渲染时需要执行`getServerSideProps`函数，并且需要调用`ReactDOMServer.renderToString`来生成`html`; 跳转页面时，需要**提前**向`nodejs`服务器发起请求，等待服务器执行`getServerSideProps`后的返回结果后，然后再在客户端生成`html内`容，再进行切换页面内容
+ `getInitialProps`：与`getServerSideProps`完全一致

## Next.js构建
照官方的说明，`next build`生成用于生产版本的应用程序包含以下内容：
+ 默认（不使用前面讲的三个函数）或者使用`getStaticProps`的页面的`HTML`文件
+ 用于全局样式或单独作用域样式的`CSS`文件
+ 用于`Next.js`在服务器渲染动态内容的`JavaScript`
+ 通过`React`在客户端进行交互的`JavaScript`

输出在`.next `文件夹内：
+ `.next/static/chunks/pages`： 此文件夹中的每个`JavaScript`文件都与同名的路由相关。例如，路由`/about`会有对应的`.next/static/chunks/pages/about.js`文件
+ `.next/static/media`： 静态导入的图像`next/image`在此处进行哈希和复制
+ `.next/static/css`：应用程序中所有页面的全局 `CSS`文件
+ `.next/server/pages`：从服务器预呈现的`HTML`和`JavaScript`入口点。
+ `.next/server/chunks`： 在整个应用程序的多个地方使用的共享`JavaScript`块
+ `.next/cache`： 是`Next.js`服务器的构建缓存和缓存图像、响应和页面的输出。使用缓存有助于减少构建时间并提高加载图像的性能

`.next`目录的所有`JavaScript`代码都被编译过，浏览器包进行了体积优化压缩，以便于可以实现最佳性能并支持所有现代浏览器。

从上面描述可以得出：如果不使用`getServerSideProps`和`getInitialProps`，都会生成对于的`html`文件。

## 总结
+ 常见的渲染模式有两种：`SSR`和`CSR`
+ 前端应用需要服务端渲染时，一般都会选择**同构渲染**
+ `Next.js`中主要新增了两种种渲染模式，最推崇的渲染模式：页面静态化（SSG）和增强版的渲染模式：(ISG)







