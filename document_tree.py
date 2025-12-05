import os

def generate_tree(start_path, output_file):
    # 定义需要忽略的文件夹或文件名
    ignore_list = ['.git', '.idea', '__pycache__', '.vscode', '目录结构.txt', os.path.basename(__file__)]
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(f"📂 目录结构: {os.path.basename(os.path.abspath(start_path))}\n")
        f.write("=" * 40 + "\n")
        
        for root, dirs, files in os.walk(start_path):
            # 过滤掉不需要的文件夹（原地修改 dirs 列表）
            dirs[:] = [d for d in dirs if d not in ignore_list and not d.startswith('.')]
            
            level = root.replace(start_path, '').count(os.sep)
            indent = '│   ' * (level - 1) + '├── ' if level > 0 else ''
            
            if level == 0:
                pass 
            else:
                subindent = '│   ' * (level - 1) + '├── '
                f.write(f"{subindent}📁 {os.path.basename(root)}/\n")
            
            # 写入文件
            subindent = '│   ' * level + '├── '
            for i, filename in enumerate(files):
                if filename not in ignore_list and not filename.startswith('.'):
                    # 如果是最后一个文件，可以使用不同的符号（可选，为了简单这里统一用├──）
                    f.write(f"{subindent}{filename}\n")

    print(f"✅ 完成！目录结构已保存到: {output_file}")

if __name__ == '__main__':
    # 获取当前脚本所在的目录
    current_dir = os.getcwd()
    output_filename = os.path.join(current_dir, '目录结构.txt')
    
    generate_tree(current_dir, output_filename)