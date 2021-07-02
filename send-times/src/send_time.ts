import * as vscode from 'vscode'

export class send_time{
    private start_time: number = 0;
    private end_time: number = 0;
    private file_type: string = "";
    private disposable!: vscode.Disposable;
    private isCoding: boolean = false;
    /*
    constructor(centext: vscode.ExtensionContext){
        this.context = context;
    }
    */
    public init(): void{
        this.get_editor_event();
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
    private checkBreak(): void{
        this.check_break_time(2);
        console.log("elapsed time", this.get_elapsed_time())
    }

    private onEvent(isWrite: boolean): void{
        let editor = vscode.window.activeTextEditor;
        if(editor){
            let doc = editor.document;
            if(doc){
                let file: string = doc.fileName;
                // console.log(file.split("/").reverse()[0].split(".")[1])
                this.file_type = file.split("/").reverse()[0].split(".")[1]
                if(file && !this.isCoding){
                    this.start_time = Date.now();
                    this.isCoding = true;
                }
                else if(this.isCoding){
                    this.end_time = Date.now();
                }
            }
        }
        console.log("start time", this.start_time)
        console.log("end time", this.end_time)
        //console.log("elapsed time", this.get_elapsed_time())
        //this.check_break_time(2);
    }
    private get_elapsed_time(): number{
        if(this.start_time >= this.end_time)return 0;
        //秒で返す
        return (this.end_time - this.start_time)/1000;
    }

    private check_break_time(interval: number): void{
        if(this.get_elapsed_time() >= interval){
            vscode.window.showInformationMessage("take a break");
            this.isCoding = false;
        }
    }
}