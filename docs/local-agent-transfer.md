# 3DLEGOWORLD — 本地 Agent 完整交接 (2026-10-17)

## 交付形态
在 GitHub Actions “Export complete photo-free agent handoff” 里可以下载两份完整 ZIP（源自当前文档分支的实际仓库文件），同时提供 `HANDOFF-MANIFEST.json`（含文件 SHA-256、提交 SHA）。
- **3DLEGOWORLD-planning-harness.zip**：项目宪章、`AGENTS.md` / `CLAUDE.md` / Copilot 约定、完整的 `specs/**`（15 个 Spec 包的 spec/plan/tasks/test-matrix）、`docs/**`、ADR、CI、完整部署与测试脚本、锁文件和项目配置；不含旧程序 `src/**`，适合从需求和 Harness 开始重新实现。
- **3DLEGOWORLD-full-source-no-photos.zip**：上述所有文件，加上 `src/**`、运行入口与 Mac .command 一键安装器；适合继续现有原型。

两个 ZIP 均不包含孩子/家人的 `IMG_0719.HEIC` 到 `IMG_0724.HEIC`，也不包含 .git、node_modules、环境密钥、编译缓存或用户浏览器 IndexedDB 数据。原始照片如需重建，请在本地由家长另行、安全地提供。

## 最终需求基线
从 `docs/product-requirements.md` 和 `specs/016-photo-first-workflow/spec.md` 开始：
孩子搭积木车 → 多角度照片 → 默认积木像素风的结构忠实 3D 车（等比例游玩缩放）→ 车库 → 模拟道路驾驶 → 在真实匹配同一结构的汽车写实风之间切换（未来）。实景地图**后置**，且仅市中心，顺序 **斯德哥尔摩 → 法兰克福 → 洛杉矶**；道路拓扑与建筑布局比立面纹理更重要。当前现有的 “LA-inspired” 场景只是虚构练习路网，不是洛杉矶数字孪生。照片自动生 3D 和真实风变换都**未实现**。

## Harness 优先级
`AGENTS.md` 已规定的权威顺序：
1. `.specify/memory/constitution.md`
2. 当前活动的 `specs/<NNN>/spec.md`
3. `plan.md` + ADR
4. `tasks.md` + `test-matrix.md`
5. 测试和代码。

遵循 SPEC → PLAN → TEST RED → IMPLEMENT GREEN → REFACTOR → VALIDATE → SMALL PR。每个任务记录需求 ID、测试、实际运行证据、未验收风险。避免边写代码边悄悄改需求以凑通过。不要“假通过”被跳过的测试；不要在没有浏览器/真机证据时宣称 UI/性能通过。

## 当前实际状态
- 017 整合分支的最后一次**全功能 CI** 验证为 [Actions run 39043993502](https://github.com/JohnsonGarden/3D/actions/runs/39043993502)：15 个 Spec 包、72/72 Node、17/17 Deploy、22/22 Chromium 无重试、TypeScript+Vite build 通过。
- 017 之后仅更新文档/验收状态，后续提交另有 GitHub Actions，需核实对应提交 SHA 的结果，不应将旧验证算成任意新提交的结果。
- 已有：程序化样车、简化 8x4/8x8 与差速锁、触屏/键盘、GLB 导入/本地 IndexedDB 车库/手动导出备份、浏览器 RAF 性能面板、三座虚构路口、共享建筑碰撞、三路标进度、照片多选预览、Mac 环境预览启动脚本。
- 尚无：照片自动到可玩真实车的重建；同一车结构衍生写实模型并随时切换；可用于不同小车的完整尺寸/轮轴规范；真正的多车物理仿真和悬架；斯德哥尔摩/法兰克福/洛杉矶真实地理路网；亲子实测 / Safari 实测 / 参考机 FPS 验收；正式发行。
- `main` 尚不等于完整可运行原型；当前功能由多个 Draft PR 构成。新 Agent 开发应基于整合的开发快照，而不是错误地只 clone main。绝不可在没有家长同意时强推或合并到 main、覆盖原始六张 HEIC。

## 推荐立即开展的下一个最小纵向切片
`specs/018-photo-coverage-scale-intake`：选择多张 JPG/PNG/WebP 之后，让家长手动给每张照片标注视角、输入当前小车一条**真实尺寸**（毫米/厘米、已知积木颗粒宽度），检查覆盖面并可预览/清除，保存一个非敏感的本地会话级 `CaptureManifest`；照片本身不上云、不在不经同意时持久化。需要纯 TS 数据验证和浏览器端到端测试，再接后续的重建适配器；不应先建不必要的云服务。
