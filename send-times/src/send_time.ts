import * as vscode from 'vscode'

export class send_time{
    private start_time: number = 0;
    private end_time: number = 0;
    private file_type: string = "";
    private disposable!: vscode.Disposable;
    /*
    constructor(centext: vscode.ExtensionContext){
        this.context = context;
    }
    */
    public init(): void{
        console.log('initialized!!')
        this.get_editor_event();
    }

    public dispose(): void{
        this.disposable.dispose()
    }

    private get_editor_event(): void{
        let subscription: vscode.Disposable[] = [];
        vscode.window.onDidChangeTextEditorSelection(this.onChange, this, subscription)
        vscode.window.onDidChangeActiveTextEditor(this.onChange, this, subscription)
        vscode.workspace.onDidSaveTextDocument(this.onSave, this, subscription)
        this.disposable = vscode.Disposable.from(...subscription)
    }

    private onChange(): void{
        this.onEvent(false);
    }

    private onSave(): void{
        this.onEvent(true);
    }

    private onEvent(isWrite: boolean): void{
        let editor = vscode.window.activeTextEditor;
        if(editor){
            let doc = editor.document;
            if(doc){
                let file: string = doc.fileName;
                if(file){
                    this.start_time = Date.now()
                }
            }
        }
        console.log(this.start_time)
    }
}