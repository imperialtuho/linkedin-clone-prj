import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@capacitor/storage';
import jwtDecode from 'jwt-decode';
import { BehaviorSubject, from, Observable, of } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { Role } from 'src/constants/user.roles';
import { environment } from 'src/environments/environment';
import { NewUser } from '../models/newUser.model';
import { User } from '../models/user.model';
import { UserResponse } from '../models/userRespone.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private user$ = new BehaviorSubject<User>(null);

  private httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };
  constructor(private http: HttpClient, private router: Router) {}

  get isUserLoggedIn(): Observable<boolean> {
    return this.user$.asObservable().pipe(
      switchMap((user: User) => {
        const isUserAuthenticated = user !== null;
        return of(isUserAuthenticated);
      })
    );
  }

  get userRole(): Observable<Role> {
    return this.user$
      .asObservable()
      .pipe(switchMap((user: User) => of(user?.role)));
  }

  register(newUser: NewUser): Observable<User> {
    return this.http
      .post<User>(
        `${environment.baseApiUrl}/auth/register`,
        newUser,
        this.httpOptions
      )
      .pipe(take(1));
  }

  login(email: string, password: string): Observable<{ token: string }> {
    return this.http
      .post<{ token: string }>(
        `${environment.baseApiUrl}/auth/login`,
        { email, password },
        this.httpOptions
      )
      .pipe(
        take(1),
        tap((response: { token: string }) => {
          Storage.set({
            key: 'token',
            value: response.token,
          });
          const decodedToken: UserResponse = jwtDecode(response.token);
          this.user$.next(decodedToken.user);
        })
      );
  }

  isTokenInStorage(): Observable<boolean> {
    return from(
      Storage.get({
        key: 'token',
      })
    ).pipe(
      map((data: { value: string }) => {
        if (!data || !data.value) {
          return null;
        }
        const decodedToken: UserResponse = jwtDecode(data.value);
        const jwtExpirationInMsSinceUnixEpoch = decodedToken.exp * 1000;
        const isExpired =
          new Date() > new Date(jwtExpirationInMsSinceUnixEpoch);
        if (isExpired) {
          return null;
        }
        if (decodedToken.user) {
          this.user$.next(decodedToken.user);
          return true;
        }
      })
    );
  }

  logout(): void {
    this.user$.next(null);
    Storage.remove({ key: 'token' });
    this.router.navigateByUrl('/auth');
  }
}
