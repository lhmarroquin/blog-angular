import { Component, OnInit } from '@angular/core';
import { Post } from '../../models/post';
import { PostService } from '../../services/post.service';
import { UserService } from '../../services/user.service';
import { global } from '../../services/global';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [PostService, UserService]
})
export class HomeComponent implements OnInit {
  public pageTitle: string;
  public identity: string;
  public token: string;
  public posts: Array<Post>;
  public url;

  constructor(
    private _postService: PostService,
    private _userService: UserService
  ) {
    this.pageTitle = 'Inicio';
    this.url = global.url;
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  }

  ngOnInit(): void {
    this.getPosts();
  }

  getPosts(): void {
    this._postService.getPosts().subscribe(
      response => {
        if( response.status === 'success' ) {
          this.posts = response.posts;
          console.log(response.posts);
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  deletePost(id): void {
    this._postService.delete(this.token, id).subscribe(
      response => {
        this.getPosts();
      },
      error => {
        console.log(error);
      }
    );
  }

}
