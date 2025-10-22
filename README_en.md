# 📖 Overleaf Private Deployment (Full TeX Live Version)

[English Version (英文版)](README_en.md) | [简体中文版](README.md)

This is a private deployment project for **Overleaf Community Edition (formerly ShareLaTeX)**.

⚠️ Important Note on Compatibility and Versions
To ensure maximum hardware compatibility (especially for older CPUs without AVX instruction sets), this project uses older versions of the ShareLaTeX base image and MongoDB.

<details>
<summary><b>💡 For hardware supporting AVX instruction sets (upgrade recommended)</b></summary>

To ensure compatibility with older hardware, this project uses older versions of the image by default. If you confirm that your deployment environment **supports AVX instruction sets**, we strongly recommend that you modify your configuration to get the latest features, performance, and security updates:

1. **Base Image Version Upgrade:**
* You can modify the `Dockerfile` in the `sharelatex-ce` folder to replace the base image in the `FROM` instruction with the latest official `sharelatex/sharelatex:latest` tag.

2. **MongoDB Version Upgrade:**
* Modify your `docker-compose.yaml` file and replace the image version of the MongoDB service (e.g., `leaf-mongo`) with `6.0` or higher to ensure the latest private deployment solution.

This modification allows you to enjoy all the features and performance improvements of the latest Overleaf/ShareLaTeX images.

</details>

---

🏷️ Branch Naming Conventions (Version Management)
This project uses Git branches to manage images built based on different official ShareLaTeX versions.

Branch names: directly correspond to the official sharelatex/sharelatex image version number.

Example: 4.2.3 branch: built based on FROM sharelatex/sharelatex:4.2.3.

---

### 🚀 Project Features

| Features | Description |
| :--- | :--- |
| **Full TeX Live** | Built based on the official image, but integrates the **Full TeX Live** package manager to avoid compilation failures due to missing macro packages. |
| **No AVX Compatibility** | Optimized for compatibility with older or specific CPU architectures without the AVX instruction set, ensuring excellent compatibility. |
| **Docker Deployment** | Use Docker Compose to start all required services (Overleaf, MongoDB, and Redis) in one click. |

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