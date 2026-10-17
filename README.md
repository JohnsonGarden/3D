# LEGO World 3D / 积木开放世界

> 把孩子亲手拼出的积木车带入一个可以驾驶、收藏、自由探索的数字世界。

**状态：M0 工程基座 / 交互式技术原型。** 现在的彩色积木车是程序化占位模型；**不是**仓库中 HEIC 照片生成的数字孪生，也不是洛杉矶实景重建。

## 快速启动

需要 Node.js 22.12+（建议 22 LTS），npm 10+。

1. `npm install`
2. `npm run dev`，打开终端显示的本地地址。
3. `W/↑` 加速、`S/↓` 倒车、`A D/← →` 转向、`Space` 刹车、`G` 打开/关闭车库、`R` 重置。
4. 车库里可以导入 **GLB** 模型；音乐由浏览器本地读取，需用户主动点击播放。

质量门禁：`npm test`、`npm run check:spec`、`npm run build`、`npm run test:e2e`（需要 Playwright 浏览器）。完整说明参见 [docs/harness.md](docs/harness.md)。

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
