# 📖 Overleaf 私有化部署（完整 TeX Live 版）

这是一个针对 **Overleaf 社区版 (原 ShareLaTeX)** 的私有化部署项目。

### 🚀 项目特色

| 特性 | 描述 |
| :--- | :--- |
| **完整 TeX Live** | 基于官方镜像构建，但集成了 **完整的 TeX Live** 包管理器，避免因缺少宏包而编译失败。 |
| **无 AVX 兼容** | 专门优化，**兼容不带 AVX 指令集** 的老旧或特定 CPU 架构的主机环境，兼容性极佳。 |
| **Docker 部署** | 使用 Docker Compose 一键启动所有必需服务（Overleaf、MongoDB、Redis）。 |

-----

# Build

构建包含**完整 TeX Live** 的 **`sharelatex-ce`** 镜像。

在包含您的 `Dockerfile` 和所有构建上下文文件的目录下执行：

```bash
docker build -t xuhe-sharelatex-ce .
```

-----

# Run

## 启动服务

使用 `docker-compose.yaml` 文件启动 Overleaf 及其依赖服务（MongoDB 和 Redis）。

```bash
docker-compose up -d
```

## 配置 MongoDB (副本集初始化)

为了让 Overleaf 正常使用 MongoDB 的高级功能（如读取 Oplog），您需要将 MongoDB 实例初始化为一个**单节点副本集**。

**注意：**

  * 此指令需要在服务启动后执行，**且只需执行一次。**
  * 执行后，请**重启** ShareLaTeX 容器以刷新配置。

<!-- end list -->

```bash
docker exec leaf-mongo mongo --eval "rs.initiate({ _id: \"overleaf\", members: [ { _id: 0, host: \"mongo:27017\" } ] })"
```

如果出现连接问题或配置未能立即生效，请重启 ShareLaTeX 服务：

```bash
docker restart <sharelatex-container-name>
# 容器名称通常是：leaf-sharelatex
```

## 🐛 常见问题修复

### 问题：编译未生成 PDF

LaTeX 编译器可能会返回以下通用错误信息，表示编译流程中断或输出缺失：

```
This compile didn’t produce a PDF. This can happen if:
There is an unrecoverable LaTeX error. If there are LaTeX errors shown below or in the raw logs, please try to fix them and compile again.
The document environment contains no content. If it’s empty, please add some content and compile again.
This project contains a file called output.pdf. If that file exists, please rename it and compile again.
```

**解决方案：**

这通常是 Overleaf 编译缓存或状态异常导致。一个快速有效的解决方案是：

1.  在 Overleaf 编辑器中，将当前项目的**编译器切换到 XeLaTeX**。
2.  **再次编译**（此时可能会成功或失败，不重要）。
3.  将编译器**切换回 pdfLaTeX** (或您需要的编译器)。
4.  **再次编译。**

通过这个切换步骤，通常可以刷新编译器的内部状态，解决此问题。