# Build

构建包含完整的textlive的sharelatex-ce镜像

```bash
docker build -t sharelatex-ce .
```

# Run

启动sharelatex的docker compose服务

```bash
docker-compose up -d
```

## 配置MongoDB

配置MongoDB, 需要重启sharelatex

```bash
docker exec leaf-mongo mongo --eval "rs.initiate({ _id: \"overleaf\", members: [ { _id: 0, host: \"mongo:27017\" } ] })"
```

- 如果出现了问题就重启一下服务刷新配置

## FIX ERROR

问题: 

```
This compile didn’t produce a PDF. This can happen if:
There is an unrecoverable LaTeX error. If there are LaTeX errors shown below or in the raw logs, please try to fix them and compile again.
The document environment contains no content. If it’s empty, please add some content and compile again.
This project contains a file called output.pdf. If that file exists, please rename it and compile again.
```

先切换到Xelatex编译器再切换回pdflatex编译器就好了