# 📖 Overleaf Private Deployment (Full TeX Live Version)

[English Version (英文版)](README_en.md) | [简体中文版](README.md)

## 🆕 Important Update

**New `6` branch added!**  
- Specifically adapted for the latest `sharelatex:6` version
- Provided for machines supporting AVX instruction sets
- Includes the latest features, performance optimizations, and security updates

This is a private deployment project for **Overleaf Community Edition (formerly ShareLaTeX)**.

⚠️ Important Note on Compatibility and Versions
To ensure maximum hardware compatibility (especially for older CPUs without AVX instruction sets), the master branch uses optimized older version images by default.

<details>
<summary><b>💡 For hardware supporting AVX instruction sets (recommended to use the `6` branch)</b></summary>

If you confirm that your deployment environment **supports AVX instruction sets**, we strongly recommend using the newly added `6` branch to get the latest ShareLaTeX 6 version and related features:

1. **Switch to the `6` branch:**
    * Execute `git checkout 6` to switch to the branch specifically adapted for ShareLaTeX 6
    * This branch uses `sharelatex/sharelatex:6` as the base image by default

2. **Use the default configuration:**
    * The `docker-compose.yaml` in the `6` branch is pre-configured with the latest dependency versions
    * Simply execute `docker-compose up -d` to start the complete service including ShareLaTeX 6

By using the `6` branch, you can enjoy all the features and performance optimizations of the latest Overleaf/ShareLaTeX 6 images.

</details>

---

🏷️ Branch Naming Conventions (Version Management)
This project uses Git branches to manage images built based on different official ShareLaTeX versions.

Branch names: directly correspond to the official sharelatex/sharelatex image version number.

- `master` branch: Default branch, uses optimized older version images to be compatible with older CPUs without AVX instruction sets
- `6` branch: Newly added branch, specifically adapted for `sharelatex:6` version, provided for machines supporting AVX instruction sets
- Example: 4.2.3 branch: built based on FROM sharelatex/sharelatex:4.2.3

---

### 🚀 Project Features

| Features | Description |
| :--- | :--- |
| **Full TeX Live** | Built based on the official image, but integrates the **Full TeX Live** package manager to avoid compilation failures due to missing macro packages. |
| **No AVX Compatibility** | The master branch is specially optimized to be **compatible with older or specific CPU architectures without AVX instruction sets**, ensuring excellent compatibility. |
| **Docker Deployment** | Use Docker Compose to start all required services (Overleaf, MongoDB, and Redis) in one click. |
| **Multi-version Branch Support** | Provides different branches to adapt to different versions of ShareLaTeX, meeting the needs of different users. |

-----

# Build

Build the **`sharelatex-ce`** image that includes **Full TeX Live**.

In the directory containing your `Dockerfile` and all build context files, execute the following:

```bash
docker build -t xuhe-sharelatex-ce .
```

> The Dockerfile is in the `sharelatex-ce` folder.

-----

# Run

## Starting Services

Start Overleaf and its dependencies (MongoDB and Redis) using the `docker-compose.yaml` file.

```bash
docker-compose up -d
```

## Configuring MongoDB (Initializing a Replica Set)

In order for Overleaf to properly utilize advanced MongoDB features (such as reading the Oplog), you need to initialize the MongoDB instance as a **single-node replica set**.

**Note:**

* This command must be executed after the server is started, and only needs to be executed once.**
* After executing this command, please **restart** the ShareLaTeX container to refresh the configuration.

<!-- end list -->

```bash
docker exec leaf-mongo mongo --eval "rs.initiate({ _id: \"overleaf\", members: [ { _id: 0, host: \"mongo:27017\" } ] })"
```
- Note! This command is different in versions 5.0 and above, please check the documentation of the corresponding support branch.

If there are connection issues or the configuration does not take effect immediately, restart the ShareLaTeX service:

```bash
docker restart <sharelatex-container-name>
# The container name is usually: leaf-sharelatex
```

## 🐛 Common Problem Fixes

### Problem: Compilation does not produce a PDF

The LaTeX compiler may return the following generic error message, indicating that the compilation process was interrupted or the output was missing:

```
This compile didn’t produce a PDF. This can happen if:
There is an unrecoverable LaTeX error. If there are LaTeX errors shown below or in the raw logs, please try to fix them and compile again.
The document environment contains no content. If it’s empty, please add some content and compile again.
This project contains a file called output.pdf. If that file exists, please rename it and compile again.
```

**Solution:**

This is usually caused by the Overleaf compilation cache or abnormal state. A quick and effective solution is:

1. In the Overleaf editor, switch the current project's **compiler** to XeLaTeX.

2. **Compile again** (this may succeed or fail; it doesn't matter).
3. **Switch the compiler back to pdfLaTeX** (or your preferred compiler).
4. **Compile again**

This switching step usually refreshes the compiler's internal state and resolves the issue.