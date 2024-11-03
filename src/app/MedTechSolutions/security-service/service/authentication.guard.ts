import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { map, take } from 'rxjs';

export const authenticationGuard: CanActivateFn = () => {
  const authenticationService = inject(AuthenticationService);
  const router = inject(Router);

  // Comprobar el estado de autenticación observando el BehaviorSubject `isSignedIn`
  return authenticationService.isSignedIn.pipe(
    take(1),
    map(isSignedIn => {
      if (isSignedIn) {
        return true;
      } else {
        router.navigate(['/']).then();
        return false;
      }
    })
  );
};
