FROM sharelatex/sharelatex:6

RUN cd /tmp && \
    wget https://mirror.ctan.org/systems/texlive/tlnet/install-tl-unx.tar.gz && \
    zcat < install-tl-unx.tar.gz | tar xf - && \
    cd install-tl-* && \
    tlmgr option repository https://mirrors.aliyun.com/CTAN/systems/texlive/tlnet && \
    perl ./install-tl --no-interaction # as root or with writable destination

# 2. 将本地文件复制到容器内 (覆盖文件)

# 指定本地 my_init 文件的路径。
COPY ./my_init /sbin/my_init

# 3. 确保新文件的执行权限
# 覆盖后的文件可能丢失执行权限
RUN chmod +x /sbin/my_init

# 4. **【核心修改】** 更改容器启动命令
# ENTRYPOINT 用于设置容器启动时执行的主程序
ENTRYPOINT ["/usr/bin/python3", "-u", "/sbin/my_init"]
