---
title: Next.js入门（快速上手）
description: 从基础的功能快速上手 Next.js。
date: 18 April 2023
categories: Next
---

## 目录
- [前言](#前言)
- [getServerSideProps](#getServerSideProps)
- [getStaticProps](#getStaticProps)
- [getStaticPaths](#getStaticPaths)
- [页面路由](#页面路由)
- [API路由](#API路由)
- [使用MDX](#使用MDX)
- [使用Image](#使用Image)
- [自定义App](#自定义App)
- [Middleware](#Middleware)
- [构建](#构建)
- [部署](#部署)

## 前言
本文主要介绍一些比较基础功能的用法。

### getServerSideProps
对于需要`SSR`（Server-Side Rendering）的页面，`Next.js`将使用`getServerSideProps`获取数据然后预渲染页面。
```js
function Page({ data }) {
  // Render data...
}

// 每次接收到请求时，都会执行getServerSideProps方法来获取数据
export async function getServerSideProps() {
  // 使用某个外部接口
  const res = await fetch(`https://.../data`);
  // 获取响应体的数据
  const data = await res.json();
  // 通过props返回给Page组件
  return { props: { data } };
}

export default Page;
```
### getStaticProps
对于需要`SSG`（Static Site Generation）的页面，`Next.js`将在构建阶段使用`getStaticProps`获取数据然后预渲染页面。
```js
function Blog({ posts }) {
  return (
    <ul>
      {posts.map((post) => (
        <li>{post.title}</li>
      ))}
    </ul>
  )
}

// getStaticProps方法会在服务端构建时调用
export async function getStaticProps() {
  // 请求外部数据接口
  const res = await fetch('https://.../posts')
  // 获取响应体的数据
  const posts = await res.json()

  // 通过props返回给Blog组件
  return {
    props: {
      posts,
    },
  }
}

export default Blog;
```
### getStaticPaths
如果一个页面具有`Dynamic Routes`并使用`getStaticProps`，那么它需要定义一个静态生成的路径列表。

比如存在这样一个动态路由：`pages/posts/[id].js`，`id`的具体值就需要使用`getStaticPaths`方法生成。
```js
// 生成 `/posts/1` 和 `/posts/2`
export async function getStaticPaths() {
  // 主要用于返回params
  return {
    paths: [{ params: { id: '1' } }, { params: { id: '2' } }],
    fallback: false, // fallback可以取值 true / false / 'blocking'
  }
}

// getStaticPaths需要配合getStaticProps一起使用
export async function getStaticProps(context) {
  // 获取动态路由的参数 id
  const { id } = context.params;
  // 请求外部数据接口，比如根据id获取详情
  const res = await fetch(`https://.../posts/${id}`)
  // 获取响应体的数据
  const post = await res.json()
  return {
    // 将props传递给Post组件
    props: { post },
  }
}

export default function Post({ post }) {
  // 渲染数据
}
```
值得注意的是，`getStaticPaths`方法的返回值`fallback`有三种取值：`true、false或'blocking'`，分别对应的效果：
+ `true`：如果没有当前路由的页面实例，不会返回*404*页面，而是在后台运行`getStaticProps`函数，直到有页面生成。显示效果会从`fallback`页面切换到完整的页面
+ `false`：如果没有当前路由的页面实例，会返回*404*页面，所以也不会运行`getStaticProps`函数
+ `'blocking'`：如果没有当前路由的页面实例，不会返回*404*页面，而是在第一次请求时进行`SSR`并返回生成的*HTML*，当浏览器收到生成的*HTML*，显示效果会从“浏览器正在请求页面”过渡到“完整页面已加载”

`fallback`的默认值为`false`，在使用上`true`或`'blocking'`的实际体验并没有太大差别。使用`true`时需要额外定义加载状态的页面。

### Client side
客户端想要获取数据正常使用`useEffect hook`就可以了。

### 页面路由
在`Next.js`中，页面是从`pages`目录下的`.js、.jsx、.ts`或`.tsx`文件导出的`React`组件。每个页面都根据其文件名与路由相关联。

#### Index路由
路由器会自动将名为index的文件路由到目录的根目录：
+ `pages/index.js` →` /`
+ `pages/blog/index.js` → `/blog`

#### 嵌套路由
路由器支持嵌套文件。如果创建了一个嵌套的文件夹结构，文件会以相同的方式自动创建路由：
+ `pages/blog/first-post.js` → `/blog/first-post`
+ `pages/dashboard/settings/username.js` → `/dashboard/settings/username`

#### 动态路由
要匹配动态参数，可以使用括号语法，以方便匹配命名参数：
+ `pages/blog/[slug].js` → `/blog/:slug` (`/blog/hello-world`) slug = 'hello-world'
+ `pages/[username]/settings.js` → `/:username/settings `(`/foo/settings)` username = 'foo'
+ `pages/post/[...all].js` → `/post/*` (`/post/2020/id/title)` all = ["2020", "id", "title"]

#### 路由跳转
可以使用`next/link`导出的`Link`组件：
```js
import Link from 'next/link'

function Home() {
  return (
    <ul>
      <li>
        <Link href="/">Home</Link>
      </li>
      <li>
        <Link href="/about">About Us</Link>
      </li>
      <li>
        <Link href="/blog/hello-world">Blog Post</Link>
      </li>
    </ul>
  )
}

export default Home
```
也可以使用`next/router`导出的`useRouter hook`：
```js
import { useRouter } from 'next/router'

export default function Page() {
  const router = useRouter()

  return (
    <button type="button" onClick={() => router.push('/post/abc')}>
      Click me
    </button>
  )
}
```
更多的使用方法可以到[next/router](https://nextjs.org/docs/api-reference/next/router)查看。

### API路由
文件夹`pages/api`中的任何文件都被映射到`/api/*`，并将被视为`api`端点而不是页面。

#### 定义API
比如，在`pages/api/user.js`文件定义如下方法：
```js
export default function handler(req, res) {
  // req表示请求
  // res表示响应

  // 响应请求 状态码为200 josn内的数据为响应体
  res.status(200).json({ name: 'John Doe' })
}
```
使用不同的请求方法，可以在方法内部进行判断：
```js
export default function handler(req, res) {
  if (req.method === 'POST') {
    // 处理post方法的请求
  } else {
    // 处理其他方法的请求
  }
}
```
#### 动态路由
如果存在`pages/api/post/[pid].js`这样一个动态路由，可以通过如下方法获取参数：
```js
export default function handler(req, res) {
  // 如果发起一个请求 /api/post/abc，pid的值就是abc
  const { pid } = req.query;
  // 返回一个字符串作为响应
  res.end(`Post: ${pid}`)
}
```
#### Request
通过如下的方法可以解析传入的请求：
+ req.cookies：包含请求传递的cookie，默认为{}
+ req.query：包含query string，默认为{}
+ req.body：包含通过content-type解析的body，如果没有发送body，则为null

#### Response
通过如下的方法可以处理返回的请求：
+ res.status(code)：设置有效的*HTTP*状态码
+ res.json(body)：发送*JSON*格式的响应，*body*必须是序列化对象
+ res.send(body)：发送HTTP响应，body可以是字符串、对象或者**Buffer**
+ res.redirect([status,] path)：重定向到指定的路径或URL，`status`默认为*307*


### 使用MDX
想要使用MDX可以按照(文档Using MDX with Next.js)[https://nextjs.org/docs/advanced-features/using-mdx]的指引安装相关的依赖。

完成之后就可以在编写页面的同时使用自定义的`React`组件和`markdown`：
```js
import { MyComponent } from 'my-components'

# My MDX page

This is a list in markdown:

- One
- Two
- Three

Checkout my React component:

<MyComponent/>
```

### 使用Image
想要在组件内使用图片，必须使用`next/image`导出的Image组件：
```js
import Image from 'next/image'
import profilePic from '../assets/me.png'

function Home() {
  return (
    <>
      <h1>My Homepage</h1>
      <Image
        src={profilePic}
        alt="Picture of the author"
      />
      <p>Welcome to my homepage!</p>
    </>
  )
}
```

### 自定义App
`Next.js`使用`App`组件来初始化页面（即_app.js文件）。可以重写它并控制页面初始化和:
+ 在页面更改之间保持布局
+ 在导航页面时保持状态
+ 向页面中注入额外的数据
+ 添加全局CSS

### Middleware
中间件允许您在请求完成之前运行代码，然后基于传入的请求，您可以通过重写、重定向、修改请求或响应标头或直接响应来修改响应。

简单来说，就是在服务端接收到客户端的html请求时就会执行存在的中间件，然后就可以对这个请求进行额外的处理。

比较容易联想的场景是*判断用户是否登录*：
```js
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 如果在函数内部使用await，则该函数可以标记为async
export function middleware(request: NextRequest) {
  // 假定存在请求头 "cookie:userid=aaa"
  let cookie = request.cookies.get('userid')?.value;
  // 假定存在一个验证cookie是否有效的方法isValidate
  if (!!isValidate(cookie)) {
    // cookie无效说明没有登录，重定向到登录页进行登录
    return NextResponse.redirect('/login')
  }

  return NextResponse.next(); // 执行下一个middleware
}
```
以上只是非常简单的示例，更多用法可以到[Middleware](https://nextjs.org/docs/advanced-features/middleware)学习。

## 构建
按照官方的说明，`next build`会生成用于生产版本的应用程序，其中包含以下内容：
+ 默认（不使用前面讲的三个函数）或者使用`getStaticProps`的页面的`HTML`文件（即使用`SSG`和`ISG`生成的静态页面）
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

从上面描述可以得出：如果不使用`getServerSideProps`和`getInitialProps`，都会生成对应的`html`文件。

## 部署
官方文档的描述：`Vercel`是零配置部署`Next.js`应用程序的最快方式。

`Vercel`是一个免费的网站托管平台。而且`Next.js`就是`Vercel`公司开源的项目，所以这里非常推荐使用[Vercel](https://vercel.com)来部署`Next.js`项目，可以说是超级方便又快捷。


