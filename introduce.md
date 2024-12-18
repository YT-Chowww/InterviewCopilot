# 一款AI应用帮你轻松“搞定”面试“八股文”❤️~

## 面试八股文

大家好~最近就业市场竞争激烈，面试难度越来越高，面试官们也越来越喜欢问一些“八股文”，比如：

- HTTP和HTTPS的区别？
- 什么是TCP和UDP,有什么区别？
- 什么是 MVC 模式，如何实现？
- 什么是单例模型？
    ...

表示直接被问懵了，然后就是花很多时间去准备，只能一遍一遍的背诵，背诵，背诵...

一些教条化的答案，并且并不基于你实际的工作内容,只是为了应付面试~

在一次摸鱼时间时，作者偶然间发现了一款AI应用，是专门帮忙解决这个问题的，下面简单做个介绍：

## 如何帮你解决八股文

这款应用的功能，就是`实时转录`面试音频，根据对话生成文本，然后就是通过调用`Open AI`的接口，根据预置的`prompt`自动生成答案，将答案展示给用户。

<img src="https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/b3d820a3bf214dd5964ffa4f0419314d~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgeXRfY2hvdw==:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiNTM2MjE3NDAzMDE0NTE5In0%3D&rk3s=e9ecf3d6&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1734490626&x-orig-sign=I0KXt3xc232z9ajgJ8NhjnlTu9Y%3D" alt="cheetah.png" width="70%" />

感兴趣的可以看看这段演示视频:
[演示视频](https://private-user-images.githubusercontent.com/106342593/229961889-489e2b36-f3e6-453a-9784-f160bc1c4f8d.mp4?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MzQzMzA0MjMsIm5iZiI6MTczNDMzMDEyMywicGF0aCI6Ii8xMDYzNDI1OTMvMjI5OTYxODg5LTQ4OWUyYjM2LWYzZTYtNDUzYS05Nzg0LWYxNjBiYzFjNGY4ZC5tcDQ_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjQxMjE2JTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI0MTIxNlQwNjIyMDNaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT0wNmRkZTU4YTNjNDdiZWZiZDc2MmRhMWY1YWViMTM1NWU4MTI3ZDA1NDY0NzBlNGRjMTZlY2QwYjBjNzFmMjA2JlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCJ9.pGlSv1nEu0TR5GFUXmGspAv_TdJy9JcloalKzWKpTIk)

## InterviewCopilot介绍

### 为什么开发这款应用

上面介绍的这款应用，国内用户使用起来不是很方便，存在几个问题：

- `中文不友好`,内置的语音识别模型，并不支持中文，
- `不支持跨平台`，只支持在MacOS上使用
- 不支持`云端TTS`服务，需要自己本地部署语音识别模型，对设备的性能要求较高
- ...

本着`授人以渔不如授人以鱼`的原则，作者决定自己动手，开发一款类似的AI应用，帮助大家解决这个问题\~

<img src="https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/68b52ab1c3ed4a1dadb85b845d294a6f~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgeXRfY2hvdw==:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiNTM2MjE3NDAzMDE0NTE5In0%3D&rk3s=e9ecf3d6&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1734491052&x-orig-sign=sYJc%2B0Y7MQJeWl3mZNX8HukVjXU%3D" alt="image-introduce.png" width="70%" />

可以看到应用截图，使用的方法很简单，只需要选择好`音频输入设备`、`面试岗位`，点击开始按钮，然后就可以实时转录，然后点击生成答案，可以通过配置的`API KEY`和`请求接口`自动生成答案。

应用主要做了下面几个优化：

### 语音识别模型优化

本地部署了语音识别模型`Whisper`的`ggml-medium`版本，提供了对中文更好的支持(后续计划支持用户选择不同版本的模型，以及支持云端的`TTS`模型...

### 文本生成服务选择

支持不同模型的文本生成服务,通过配置你的`API Key`以及`请求接口`，就可以进行自行选择

### 跨平台支持

项目基于`Electron`开发，支持`Windows`、`MacOS(ARM系列芯片)`操作系统.

## 总结

项目地址：<https://github.com/YT-Chowww/InterviewCopilot>

欢迎感兴趣的小伙伴多多体验，提出使用问题和建议，也可以参与到项目开发中来，项目功能稳定后会进行开源，感谢小伙伴的多多支持❤️❤️❤️

ps: 本项目是一个讽刺艺术项目，旨在讽刺面试官的八股文，以及面试者的无奈，希望大家在日常工作中多多提高自己，打铁还需自身硬\~
