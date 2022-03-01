import { UrlSerializer, UrlTree, DefaultUrlSerializer } from '@angular/router';

export class CustomUrlSerializer implements UrlSerializer {
    public ds = new DefaultUrlSerializer();

    parse(url: any): UrlTree {
        return this.ds.parse(url);
    }

    serialize(tree: UrlTree): any {
        const serializedUrl = this.ds.serialize(tree);
        return serializedUrl
            .replace(/%40/gi, '@')
            .replace(/%3A/gi, ':')
            .replace(/%24/gi, '$')
            .replace(/%2C/gi, ',')
            .replace(/%3B/gi, ';')
            .replace(/%20/gi, '+')
            .replace(/%3D/gi, '=')
            .replace(/%3F/gi, '?')
            .replace(/%2F/gi, '/');
    }
}
