import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { UserService } from "../../services/user.service";
import { CategoryService } from "../../services/category.service";
import { PostService } from "../../services/post.service";
import { Post } from "../../models/post";
import {global} from "../../services/global";

@Component({
  selector: 'app-post-edit',
  templateUrl: '../post-new/post-new.component.html',
  providers: [UserService, CategoryService, PostService]
})
export class PostEditComponent implements OnInit {

  public pageTitle: string;
  public identity: string;
  public token: string;
  public post: Post;
  public categories;
  public status: string;
  public isEdit: boolean;
  public url: string;

  public froala_options: Object = {
    charCounterCount: true,
    language: 'es',
    toolbarButtons: ['bold', 'italic', 'underline', 'paragraphFormat', 'imageUpload'],
    toolbarButtonsXS: ['bold', 'italic', 'underline', 'paragraphFormat', 'imageUpload'],
    toolbarButtonsSM: ['bold', 'italic', 'underline', 'paragraphFormat', 'imageUpload'],
    toolbarButtonsMD: ['bold', 'italic', 'underline', 'paragraphFormat', 'imageUpload'],
  };

  public afuConfig = {
    multiple: false,
    formatsAllowed: ".jpg,.jpeg,.png,.gif",
    maxSize: "50",
    uploadAPI:  {
      url: global.url+"post/upload",
      method:"POST",
      headers: {
        "Authorization" : this._userService.getToken()
      },
    },
    theme: "attachPin",
    hideProgressBar: true,
    hideResetBtn: true,
    hideSelectBtn: true,
    fileNameIndex: true,
    attachPinBtn: 'Subir imagen',
    replaceTexts: {
      selectFileBtn: 'Select Files',
      resetBtn: 'Reset',
      uploadBtn: 'Upload',
      dragNDropBox: 'Drag N Drop',
      attachPinBtn: 'Sube tu avatar de usuario',
      afterUploadMsg_success: 'Successfully Uploaded !',
      afterUploadMsg_error: 'Upload Failed !',
      sizeLimit: 'Size Limit'
    }
  };

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _categoryService: CategoryService,
    private _postService: PostService
  ) {
    this.pageTitle = 'Editar entrada';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.isEdit = true;
    this.url = global.url;
  }

  ngOnInit(): void {
    this.getCategories();
    const id: number = +this.identity.sub;

    this.post = new Post(1, id, 1, '', '', null, null);
    this.getPost();
  }

  getCategories() {
    this._categoryService.getCategories().subscribe(
      response => {
        if( response.status == 'success' ) {
          this.categories = response.categories;
        }
      },
      error => {

      }
    );
  }

  getPost() {
    // Sacar el id del post de la url
    this._route.params.subscribe(params => {
      let id = +params['id'];

      // Peticion ajax para sacar los datos del post
      this._postService.getPost(id).subscribe(
        response => {
          if( response.status == 'success' ){
            this.post = response.posts;
            let sub = +this.identity.sub;
            if ( this.post.user_id !== sub ) {
              this._router.navigate(['/inicio']);
            }
          }
          else {
            this._router.navigate(['/inicio']);
          }
        },
        error => {
          console.log(error);
          this._router.navigate(['/inicio']);
        }
      );

    });

  }

  onSubmit(form) {
    this._postService.update(this.token, this.post, this.post.id).subscribe(
      response => {
        if ( response.status === 'success' ) {
          this.status = 'success';
          this._router.navigate(['/entrada', this.post.id]);
        }
        else {
          this.status = 'error';
        }
      },
      error => {
        console.log(error);
        this.status = 'error';
      }
    );
  }

  imageUpload(data) {
    console.log(data.response);
    let imageData = JSON.parse(data.response);
    this.post.image = imageData.image;
  }

  resetVar() {
    console.log('resetVar');
  }

}
