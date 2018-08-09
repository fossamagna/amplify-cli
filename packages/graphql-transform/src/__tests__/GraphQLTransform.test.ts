import {
    ObjectTypeDefinitionNode, DirectiveNode
} from 'graphql'
import GraphQLTransform from '../GraphQLTransform'
import TransformerContext from '../TransformerContext'
import Transformer from '../Transformer'

class ValidObjectTransformer extends Transformer {
    constructor() {
        super(
            'ValidObjectTransformer', 'directive @ObjectDirective on OBJECT')
    }

    public object = (definition: ObjectTypeDefinitionNode, directive: DirectiveNode, acc: TransformerContext) => {
        return
    }
}

class InvalidObjectTransformer extends Transformer {
    constructor() {
        super('InvalidObjectTransformer', 'directive @ObjectDirective on OBJECT')
    }
}

test('Test graphql transformer validation happy case', () => {
    const validSchema = `type Post @ObjectDirective { id: ID! }`
    const transformer = new GraphQLTransform({
        transformers: [
            new ValidObjectTransformer()
        ]
    })
    const out = transformer.transform(validSchema);
    expect(out).toBeDefined()
});

test('Test graphql transformer validation. Transformer does not implement required method.', () => {
    const validSchema = `type Post @ObjectDirective { id: ID! }`
    const transformer = new GraphQLTransform({
        transformers: [
            new InvalidObjectTransformer()
        ]
    })
    try {
        transformer.transform(validSchema);
    } catch (e) {
        expect(e.name).toEqual('InvalidTransformerError')
    }
});

test('Test graphql transformer validation. Unknown directive.', () => {
    const invalidSchema = `type Post @UnknownDirective { id: ID! }`
    const transformer = new GraphQLTransform({
        transformers: [
            new InvalidObjectTransformer()
        ]
    })
    try {
        transformer.transform(invalidSchema);
    } catch (e) {
        expect(e.name).toEqual('TransformSchemaError')
    }
});

class PingTransformer extends Transformer {
    constructor() {
        super(
            'ValidObjectTransformer',
            `
            directive @ping(config: PingConfig) on OBJECT
            input PingConfig {
                url: String!
            }
            `)
    }

    public object = (definition: ObjectTypeDefinitionNode, directive: DirectiveNode, acc: TransformerContext) => {
        return
    }
}

test('Test graphql transformer validation on bad shapes. @ping directive.', () => {
    const invalidSchema = `type Post @ping(config: { bad: "shape" }) { id: ID! }`
    const transformer = new GraphQLTransform({
        transformers: [
            new PingTransformer()
        ]
    })
    try {
        console.log(`Transforming: \n${invalidSchema}`)
        const out = transformer.transform(invalidSchema);
        expect(true).toEqual(false)
    } catch (e) {
        console.log(e.message)
        expect(e.name).toEqual('TransformSchemaError')
    }
});
