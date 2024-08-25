import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  templateUrl: './register-page.component.html',
  styles: ``
})
export class RegisterPageComponent {

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  public myForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  register(): void {
    const { email, username, password } = this.myForm.value;

    this.authService.register(username, email, password).subscribe({
      next: () => {
        this.router.navigateByUrl('/dashboard');
      },
      error: (message) => {
        Swal.fire('Error', message, 'error');
      }
    });
    
  }
}
