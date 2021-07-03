import * as vscode from 'vscode'
const axios = require('axios')
const base_url = 'localhost/'

export class send_time{
    private start_time: number = 0;
    private end_time: number = 0;
    private file_type: string = "";
    private file_name: string = "";
    private disposable!: vscode.Disposable;
    private isCoding: boolean = false;
    // private breakTime: number[] = [];
    private username: string = "";
    private password: string = "";
    private dict:{[index:string]: string} = {
        "c": "c",
        "cpp": "c++",
        "css": "css",
        "go": "go",
        "java":"java",
        "js":"javascript",
        "py": "python",
        "rb": "ruby",
        "rs": "rust",
        "ts": "typescript"
    }
    public init(): void{
        this.get_editor_event();
    }

    public async user_auth(): Promise<void>{
        console.log("please log in!")
        const usr = await vscode.window.showInputBox({
            prompt: "please input username"
        });
        if(usr){
            this.username = usr
        }else{
            vscode.window.showWarningMessage("failed to get")
        }
        const pass = await vscode.window.showInputBox({
            password:true,
            prompt: "please input password"
        })
        if(pass){
            this.password = pass
        }
        else{
            vscode.window.showWarningMessage("failed to get")
        }
        //console.log(this.username)
        //console.log(this.password)
        //ユーザー認証処理をする
    }

    public dispose(): void{
        this.disposable.dispose()
    }

    private get_editor_event(): void{
        let subscription: vscode.Disposable[] = [];
        vscode.window.onDidChangeTextEditorSelection(this.onChange, this, subscription)
        vscode.window.onDidChangeActiveTextEditor(this.onChange, this, subscription)
        vscode.workspace.onDidSaveTextDocument(this.checkBreak, this, subscription)
        //TODO: ファイルを閉じた時に時間をDBに送りたい
        //vscode.window.onDidChangeVisibleTextEditors(this.send_data, this, subscription)
        //console.log(vscode.window.visibleTextEditors)
        //vscode.workspace.onDidOpenTextDocument(this.send_data, this, subscription)
        this.disposable = vscode.Disposable.from(...subscription)
    }
    private set_file_type(file_name: string, file_type: string){
        this.send_data()
        this.file_name = file_name;
        this.file_type = file_type;
    }
    //送るデータ
    // 作業時間，フィアルの内容，ユーザー名
    private send_data(): void{
        const time:number = this.get_elapsed_time()
        if(time != 0){
            console.log("file has changed")
            console.log(time)
            console.log(this.username)
            console.log(this.file_type)
            this.update_start_time()
            const args = {
                data:{
                    worktime: time,
                    language: this.file_type
                },
                headers:{
                    "Content-type":"application/json"
                }
            }
            const url = base_url+this.username
            console.log(args)
            console.log(url)
            //axios.post(url, args)
        }
    }

    private onChange(): void{
        this.onEvent(false);
    }

    private update_start_time(): void{
        this.start_time = Date.now();
    }

   private update_end_time():void{
       this.end_time = Date.now();
   }
    private checkBreak(): void{
        this.update_end_time()
        if(this.check_break_time(2)){
            vscode.window.showInformationMessage("take a break");
            //this.breakTime.push(this.get_elapsed_time());
            //console.log(this.breakTime)
        }
        console.log("elapsed time", this.get_elapsed_time())
    }

    private onEvent(isWrite: boolean): void{
        let editor = vscode.window.activeTextEditor;
        if(editor){
            let doc = editor.document;
            if(doc){
                let file: string = doc.fileName.split("/").reverse()[0];
                let type: string = file.split(".")[1]
                type = this.dict[type]
                if(file != this.file_name){
                    this.set_file_type(file, type);
                }
                //console.log(this.file_type)
                if(file && !this.isCoding){
                    this.start_time = Date.now();
                    this.isCoding = true;
                }
                else if(this.isCoding){
                    this.update_end_time()
                }
            }
        }
        //console.log("start time", this.start_time)
        //console.log("end time", this.end_time)
        //console.log("elapsed time", this.get_elapsed_time())
    }
    private get_elapsed_time(): number{
        if(this.start_time >= this.end_time)return 0;
        //秒で返す
        return (this.end_time - this.start_time)/1000;
    }

    private check_break_time(interval: number): boolean{
        if(this.get_elapsed_time() >= interval){
            return true;
        }
        else{
            return false;
        }
    }
}