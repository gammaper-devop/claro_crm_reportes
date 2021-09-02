import { DOCUMENT } from '@angular/common';
import { Injectable, Inject } from '@angular/core';
import { Subject } from 'rxjs';
import { ProgressbarService } from '@claro/commons';
import { MicroAppConfigService } from './microapp-config.service';
import { MicroApp } from './microapp.interface';

@Injectable({
  providedIn: 'root',
})
export class MicroAppLoaderService {
  /**
   * Contiene los nombres de las microapp
   * Bundle ya fue requerido y descargado al menos una vez
   *
   */
  private microAppLoaded: Array<string>;
  private microApps: Array<MicroApp>;
  private unsubscribe: Subject<void>;
  private microAppExists: boolean;

  public constructor(
    private configService: MicroAppConfigService,
    private progressbarService: ProgressbarService,
    @Inject(DOCUMENT) private document: any,
  ) {
    this.microAppLoaded = new Array<string>();
    this.microApps = this.configService.microApps;
    this.unsubscribe = new Subject();
    this.microAppExists = false;
    this.initialize();
  }

  /**
   * Método que se encarga de buscar las aplicaciones con descarga
   * automática de su bundle para descargar su contenido
   */
  public initialize() {
    this.microApps
      .filter(microApp => microApp.preload)
      .forEach(microApp => {
        this.preloadScript(microApp)
          .then()
          .catch(err => console.error(err));
      });
  }

  /**
   * Renderiza la microapp, verifica si fue previamente descargada.
   *
   */
  public async render(microappTag: string, extras?: { [key: string]: string }) {
    // MAPEAMOS LOS PRODUCTOS CON EL TAG OBTENIDO DE LA RUTA CONCATENADO APP (1*)
    const microApp = this.microApps.find(item => item.tag === microappTag);

    if (microApp) {
      if (this.microAppLoaded.findIndex(tag => tag === microApp.tag) === -1) {
        this.microAppExists = true;
        this.progressbarService.show();
        try {
          await this.preloadScript(microApp);
        } catch (e) {
          throw e;
        }
      }

      await this.renderMicroApp(microApp, extras);
      if (this.microAppExists) {
        setTimeout(() => {
          this.microAppExists = false;
          this.progressbarService.hide();
        }, 2000);
      }
    } else {
      throw new Error('Microapp not exist');
    }
  }

  /**
   * Método que se encarga de descargar el bundle de una microApp
   *
   * @param microApp Información
   */
  private preloadScript(microApp: MicroApp): Promise<boolean> {
    return new Promise((resolve, reject) => {
      let timestamp = new Date().toISOString();
      timestamp = timestamp.substr(0, timestamp.indexOf('T'));
      const script = this.document.createElement('script');

      script.type = 'text/javascript';
      script.async = microApp.async;
      script.src = `${microApp.path}?q=${timestamp}`;
      script.id = microApp.tag;

      script.onload = () => {
        this.microAppLoaded.push(microApp.tag);
        resolve(true);
      };

      script.onerror = () => {
        reject('Ocurrió un error cargando el script de la microapp');
      };

      this.document.body.appendChild(script);
    });
  }

  /**
   * Método que se encarga de renderizar la aplicación
   * en el contenedor micro-outlet
   *
   * @param microApp MicroApp data
   * @param extras Información adicional
   */
  private async renderMicroApp(
    microApp: MicroApp,
    extras?: { [key: string]: string },
  ) {
    const outlets = this.document.getElementsByTagName(microApp.wrapperTag);
    const outlet = outlets[outlets.length - 1];

    if (outlet) {
      if (microApp.clearContent) {
        outlet.innerHTML = '';
      }

      const microappElement = this.document.createElement(microApp.tag);

      if (extras) {
        Object.keys(extras).forEach(key => {
          microappElement[key] = extras[key];
        });
      }
      outlet.appendChild(microappElement);
    }
  }
}
