import { $cli } from '@core/utils/$cli';
import { ICommand } from '../ICommand';
import { $require } from '@dequanto/utils/$require';
import { TEth } from '@dequanto/models/TEth';

export namespace $command {

    /** e.g. "i, install" or "-n, --name" */
    export function getAliases (str: string) {
        return str
            .split(',')
            .map(x => x.trim())
            .map(x => {
                let name = x.replace(/^\-+/, '');
                let isFlag = x !== name;
                return {
                    name,
                    isFlag
                };
            });
    }


    export async function getParams (cliParams: any, paramsDef: ICommand['params']) {
        let params = {} as any;
        let keyMappings = {};
        let definitions = {} as { [key: string]: ICommand['params'][''] }
        for (let key in paramsDef) {
            let aliases = getAliases(key);
            let canonical = camelCase(aliases[aliases.length - 1].name);

            paramsDef[key].key = canonical;
            aliases.forEach(alias => {
                keyMappings[alias.name] = canonical;
                definitions[alias.name] = paramsDef[key];
            });
        }

        for (let key in cliParams) {
            let value = cliParams[key];
            let mappedKey = keyMappings[key];
            if (mappedKey == null) {
                params[key] = value;
                continue;
            }
            let def = definitions[key];

            params[mappedKey] = parseValue(value, def);
        }

        for (let key in paramsDef) {
            let definition = paramsDef[key];
            let value = params[definition.key];
            if (value != null) {
                if (definition.map != null) {
                    params[definition.key] = definition.map(value);
                }
            }

            if (value == null && definition.default != null) {
                value = params[definition.key] = definition.default;
            }
            if (value == null && definition.required) {
                if (definition.fallback) {
                    value = params[definition.key] = cliParams[definition.fallback];
                }
                if (value == null) {
                    params[definition.key] = await $cli.ask(
                        `\n${definition.description}\n--${definition.key}: `,
                        definition.type
                    );
                }
            }
        }

        return params;
    }


    function camelCase (str: string): string {
        return str.replace(/\-(\w)/g, (full, char) => {
            return char.toUpperCase();
        });
    }
    function parseValue(value: string, def: ICommand['params']['']) {
        if (def.type == null) {
            return value;
        }
        if (def.type === 'number') {
            if (typeof value === 'number') {
                return value;
            }
            let num = Number(value);
            if (isNaN(num)) {
                throw new Error(`Not a number (${value}) for "${def.description}"`);
            }
            return num;
        }
        if (def.type === 'boolean') {
            if (typeof value === 'boolean') {
                return value;
            }
            if (value == null || value === 'true' || value === '1') {
                return true;
            }
            return false;
        }
        if (def.type === 'address') {
            if (value != null) {
                $require.Address(value as TEth.Address);
            }
        }

        return value;
    }
}
