import { Component, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'angular-rich-text-editor';

  @ViewChild('blogEditor') textArea!: ElementRef;

  editorData: String = '<p></p>';

  htmlData: String = '';

  imgSrcList: string[] = [];

  public onTextChange(event: String): void {
    // console.log({event});
    this.editorData = event;
    this.htmlData = this.editorData;
  }

  public onSelectionChange(event: any): void {
    console.log({event});
  }

  public onParagraph(): void {
    this.insertElement("p");
    
  }

  public onHeader(): void {
    this.insertElement("h2");

  }

  public onBold(): void {
    this.insertElement("strong");
  }

  public onItalicize(): void {
    this.insertElement("i");
  }

  public onUnderline(): void {
    this.insertElement("u");
  }

  public onCode(): void {
    this.insertElements(["pre", "code"]);
  }

  public onFileSelected(event: Event) {
    let target = event?.target as HTMLInputElement;
    if(target.files && target.files[0]) {
      let file: File = target.files[0];
      const reader = new FileReader();
      reader.onload = e => {
        if(reader.result) {
          this.imgSrcList.push(reader.result.toString());
          this.insertElementWithAttr("img", [`src="${reader.result.toString()}"`]);
        }
      };
      reader.readAsDataURL(file);
    }
  }

  public onLink(): void {
    this.insertElementWithAttr("a", [`target="blank"`, `href=""`]);
  }

  private insertElement(element: string) {
    let input = this.textArea.nativeElement;
    if(input.selectionStart === input.selectionEnd) {
      this.editorData = this.editorData.slice(0, input.selectionStart) + `<${element}></${element}>` + this.editorData.slice(input.selectionEnd);
      this.htmlData = this.editorData;
    } else {
      this.editorData = this.editorData.slice(0, input.selectionStart) + `<${element}>` + this.editorData.slice(input.selectionStart, input.selectionEnd) + `</${element}>` + this.editorData.slice(input.selectionEnd);
      this.htmlData = this.editorData;
    }
  }

  private insertElementWithAttr(element: string, attr: string[]) {
    let input = this.textArea.nativeElement;
    if(input.selectionStart === input.selectionEnd) {
      this.editorData = this.editorData.slice(0, input.selectionStart) + `<${element} ${attr.join(' ')}></${element}>` + this.editorData.slice(input.selectionEnd);
      this.htmlData = this.editorData;
    } else {
      this.editorData = this.editorData.slice(0, input.selectionStart) + `<${element} ${attr.join(' ')}>` + this.editorData.slice(input.selectionStart, input.selectionEnd) + `</${element}>` + this.editorData.slice(input.selectionEnd);
      this.htmlData = this.editorData;
    }
  }

  private insertElements(elements: string[]) {
    let input = this.textArea.nativeElement;
    let opening = elements.map(e => `<${e}>`);
    let closing = elements.slice().reverse().map(e => `</${e}>`);

    if(input.selectionStart === input.selectionEnd) {  
      let tags = opening.join('') + closing.join('');
      this.editorData = this.editorData.slice(0, input.selectionStart) + tags + this.editorData.slice(input.selectionEnd);
      this.htmlData = this.editorData;
    } else {
      this.editorData = this.editorData.slice(0, input.selectionStart) + opening.join('') + this.editorData.slice(input.selectionStart, input.selectionEnd) + closing.join('') + this.editorData.slice(input.selectionEnd);
      this.htmlData = this.editorData;
    }
  }
}
