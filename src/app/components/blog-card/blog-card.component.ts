import { Component, OnInit } from '@angular/core';
import { Post } from 'src/app/models/Post';
import { AppUser } from 'src/app/models/appuser';
import { BlogService } from 'src/app/services/blog.service';
import { CommentService } from 'src/app/services/comment.service';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-blog-card',
  templateUrl: './blog-card.component.html',
  styleUrls: ['./blog-card.component.scss']
})
export class BlogCardComponent implements OnInit {

  config: any;
  pageSizeOptions = [];

  blogPost: Post[] = [];
  appUser: AppUser;

  constructor(private blogService: BlogService,
    private commentService: CommentService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private snackBarService: SnackbarService) {

    this.authService.appUser$.subscribe(appUser => this.appUser = appUser);

    this.pageSizeOptions = [2, 4, 6];

    this.config = {
      currentPage: 1,
      itemsPerPage: this.pageSizeOptions[0]
    };
  }

  ngOnInit() {
    this.route.params.subscribe(
      params => {
        this.config.currentPage = +params['pagenum'];
        this.getBlogPosts();
      }
    );
  }

  getBlogPosts() {
    this.blogService.getAllPosts().subscribe(result => {
      this.blogPost = result;
    });
  }

  delete(postId) {
    if (confirm('Are you sure')) {
      this.blogService.deletePost(postId).then(
        () => {
          this.commentService.deleteAllCommentForBlog(postId);
          this.snackBarService.showSnackBar('Blog post deleted successfully');
        }
      );
    }
  }
}
