import * as vscode from 'vscode'

export class send_time{
    private start_time: number = 0;
    private end_time: number = 0;
    private file_type: string = "";
    private disposable!: vscode.Disposable;
    private isCoding: boolean = false;
    private breakTime: number[] = [];
    private username: string = "";
    private password: string = "";

    public init(): void{
        //this.user_auth();
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
        console.log(this.username)
        console.log(this.password)
    }

    public dispose(): void{
        this.disposable.dispose()
    }

    private get_editor_event(): void{
        let subscription: vscode.Disposable[] = [];
        vscode.window.onDidChangeTextEditorSelection(this.onChange, this, subscription)
        vscode.window.onDidChangeActiveTextEditor(this.onChange, this, subscription)
        vscode.workspace.onDidSaveTextDocument(this.checkBreak, this, subscription)
        this.disposable = vscode.Disposable.from(...subscription)
    }

    private onChange(): void{
        this.onEvent(false);
    }
    /*
    private onSave(): void{
        this.onEvent(true);
    }
    */
   private update_end_time():void{
       this.end_time = Date.now();
   }
    private checkBreak(): void{
        this.update_end_time()
        if(this.check_break_time(2)){
            this.breakTime.push(this.get_elapsed_time());
            console.log(this.breakTime)
        }
        console.log("elapsed time", this.get_elapsed_time())
    }

    private onEvent(isWrite: boolean): void{
        let editor = vscode.window.activeTextEditor;
        if(editor){
            let doc = editor.document;
            if(doc){
                let file: string = doc.fileName;
                // console.log(file.split("/").reverse()[0].split(".")[1])
                // ファイルjがからの時だけ拡張子を入手する
                if(!this.file_type)
                    this.file_type = file.split("/").reverse()[0].split(".")[1]
                if(file && !this.isCoding){
                    this.start_time = Date.now();
                    this.isCoding = true;
                }
                else if(this.isCoding){
                    this.update_end_time()
                }
            }
        }
        console.log("start time", this.start_time)
        console.log("end time", this.end_time)
        console.log("elapsed time", this.get_elapsed_time())
        //this.check_break_time(2);
    }
    private get_elapsed_time(): number{
        if(this.start_time >= this.end_time)return 0;
        //秒で返す
        return (this.end_time - this.start_time)/1000;
    }

    private check_break_time(interval: number): boolean{
        if(this.get_elapsed_time() >= interval){
            vscode.window.showInformationMessage("take a break");
            this.isCoding = false;
            return true;
        }
        else{
            return false;
        }
    }
}