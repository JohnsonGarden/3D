# LEGO World 3D / 积木开放世界

> 把孩子亲手拼出的积木车带入一个可以驾驶、收藏、自由探索的数字世界。

**状态：M0 工程基座 / 交互式技术原型。** 现在的彩色积木车是程序化占位模型；**不是**仓库中 HEIC 照片生成的数字孪生，也不是洛杉矶实景重建。

## Mac 一键本地部署（建议使用）

**适用于 MacBook Air / MacBook Pro 的 Apple Silicon 与 Intel Mac。**
本功能在 GitHub Actions 的 Linux/Chromium 环境进行自动测试；Finder 双击和 Safari 仍需在你的 Mac 上验收。

1. **下载含可运行代码的开发分支 ZIP**：[点击下载 3D 项目](https://github.com/JohnsonGarden/3D/archive/refs/heads/feat/lego-world-harness-v0.zip)。注意：目前默认 `main` 分支只有初始文件，不能用它来启动。
2. 解压 ZIP，**保留整个文件夹**。进入文件夹，双击文件 **`启动积木世界.command`**（该文件不是图片，也不需要用编辑器打开）。
3. 首次运行会检查 **Node.js >=22.12**、npm。如未安装，有 Homebrew 时脚本会**征得你同意**后安装 node@22；没有 Homebrew 则显示 Node.js 官方安装地址，安装后再次双击即可。
4. 首次安装 npm 依赖需要联网；脚本自动构建网页，然后打开默认浏览器的 **http://127.0.0.1:4173**。保留 Terminal 窗口，游戏就会持续运行。之后启动会复用现有依赖，不强制重新下载。
5. 停止：回到启动游戏的 Terminal 窗口按 **Control+C**。重新启动可以再次双击脚本。若端口上已有游戏，脚本会打开现有地址而不会杀死任何进程。

如果 macOS 阻止打开未知开发者的 `.command` 文件，先按系统提示在 **系统设置 → 隐私与安全性**中选择允许打开；只运行你从本项目仓库下载、确认来源的文件。若 ZIP 解压未保留可执行权限，或者 Finder 不能打开，可以在该项目文件夹打开 Terminal，运行：

```bash
bash scripts/start-local.sh
```

高级操作与排错：

```bash
bash scripts/start-local.sh --check       # 只检查环境，不安装/构建
bash scripts/start-local.sh --build-only  # 只安装依赖并构建
bash scripts/start-local.sh --no-open     # 启动但不弹出浏览器
BRICK_WORLD_PORT=4174 bash scripts/start-local.sh  # 本机端口 4173 被占用时
npm run test:deploy                       # 在已经构建 dist 后运行部署专项测试
```

**隐私与安全：** 绑定 `127.0.0.1`，不提供公网/局域网访问，也没有后台上传照片或音乐的 API。上传的 GLB 和音乐继续由浏览器本地读取；不创建开机自启动服务，不需要 sudo。当前示例卡车是程序化模型，真实照片重建与永久车库属于后续工作。尚无 macOS 原生 `.app`、代码签名或 DMG 安装器，也尚未在用户 Mac 上验证帧率。

## 快速启动

需要 Node.js 22.12+（建议 22 LTS），npm 10+。

1. `npm install`
2. `npm run dev`，打开终端显示的本地地址。
3. `W/↑` 加速、`S/↓` 倒车、`A D/← →` 转向、`Space` 刹车、`G` 打开/关闭车库、`R` 重置。驾驶面板支持 `Q` 切换 8×4/8×8，`1`/`2`/`3` 分别切换前桥组/后桥组/中央差速锁，`T` 切换低附着路面演示。
4. 车库里可以导入 **GLB** 模型；音乐由浏览器本地读取，需用户主动点击播放。

质量门禁：`npm test`、`npm run check:spec`、`npm run build`、`npm run test:e2e`（需要 Playwright 浏览器）。完整说明参见 [docs/harness.md](docs/harness.md)。

## 真实积木的尺寸（家长实测）
车身（不含前防撞栏）10.4cm 长、3.1cm 宽、车头最高 4.7cm、轮胎直径 1.4cm。游戏选择 2.50m 的真实卡车车身宽度，按 **80.645× 等比例放大**：车身长约 8.39m，车头最高约 3.79m，轮胎直径约 1.13m。前防撞梁向前突出实测 0.8cm，对应游戏 0.645m，包含前防撞梁总长约 **9.03m**。四轴轴心中心线按车头往后：第一轴离车头 2.4cm，轴间距 3.2/1.6/1.6cm，第四轴到车尾 1.6cm；游戏中对应 1.94/4.52/5.81/7.10m（相对于车头），第一至第四轴总轴距 **5.16m**。详细规格：[006 卡车比例标定](specs/006-proportional-truck-scale/spec.md)。

## 双前轴转向与传动玩法（007，已完成可玩原型）
程序化四轴车现显示按轴位分布的 **14 条轮胎**，前两轴视觉转向、后两轴固定；车厢已移除，改为露出的低位车架与后平台。驾驶界面可切换 8×4 / 8×8、三把独立的逻辑差速锁，且在低附着路面示意条件下产生**有限的动力响应差别**，普通干燥铺装路切换模式不会无故提速。请注意这不是 Rapier 轮胎动力学或真实差速锁、悬挂仿真，导入的 GLB 模型暂不自动绑定轮胎骨骼。详见 [007 规格](specs/007-drivetrain-playable/spec.md)，[通过的 CI](https://github.com/JohnsonGarden/3D/actions/runs/39032367330)。

## 侧视校准阶段验收
家长已阶段性确认 v3 侧视示意图的**外围尺寸与整体低趴姿态**，不要求现在打磨到照片级车身细节。实测车头 4.8cm，最低底盘离地 **0.3cm**（纠正旧值 0.6cm），无货厢，14 条胎，前两轴转向；8×4/8×8 驱动切换及 3 把差速锁已完成**街机式控制与低附着示意**，尚未实现机械动力学仿真。参见 [ADR-0002](docs/adr/0002-profile-baseline.md) 和 [配置参考](src/sim/approved-profile.ts)。

## 从照片到世界

仓库源分支 `JohnsonGarden-patch-1` 保存 `IMG_0719.HEIC` 至 `IMG_0724.HEIC` 六张原始素材。本次不修改、转码、公开提取或自动上传它们。它们**尚未**被验证是否足以重建完整车底/遮挡结构。重建方案见 [docs/asset-pipeline.md](docs/asset-pipeline.md)。

第一版原型是**受洛杉矶启发的虚构道路场景**；无街道级地理准确性承诺。真实道路网络及数据许可列为后续阶段。

## 产品与工程入口

- [愿景/路线图](docs/roadmap.md) · [体验规则](docs/design-principles.md)
- [整体架构](docs/architecture.md) · [资产管线](docs/asset-pipeline.md)
- [项目宪章](.specify/memory/constitution.md) · [Agent 总入口](AGENTS.md)
- [Harness 开发回路](docs/harness.md) · [首个纵向切片规格](specs/001-driveable-slice/spec.md)
- [计划](specs/001-driveable-slice/plan.md) · [任务](specs/001-driveable-slice/tasks.md) · [验收矩阵](specs/001-driveable-slice/test-matrix.md)

## 贡献与许可

代码遵循仓库 MIT LICENSE；照片、孩子创作物、第三方模型、音乐、积木零件库与地图数据**不自动**因代码许可证成为 MIT。第三方资源必须单独核验来源与使用权。不要提交含孩子可识别信息、定位信息或未经授权音乐的样本。

相关工程参考：GitHub Spec Kit、OpenSpec、Three.js / React Three Fiber、React Three Rapier、Playwright、LDraw；链接和采用理由记录在设计文档中。此仓库为独立亲子项目，不代表 LEGO Group 授权或赞助。
