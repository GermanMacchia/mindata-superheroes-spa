import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { createSpanishPaginatorIntl } from '@app/core/services/spanish-paginator-intl.service';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideRouter(routes, withComponentInputBinding()),
        { provide: MatPaginatorIntl, useFactory: createSpanishPaginatorIntl },
    ],
};
