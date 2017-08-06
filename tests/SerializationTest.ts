namespace feng3d
{
    export class ObjectBase
    {
        @serialize
        public id = 1;
    }

    export class C extends ObjectBase
    {
        // @serialize()
        // id = 2;

        @serialize
        a = 1;

        @serialize
        c = 1;

        change()
        {
            console.log("change", this.a, arguments);
        }
    }

    export class SerializationTest
    {
        constructor()
        {
            var base = new ObjectBase();
            base.id = Math.random();
            var resultb = base.serialize();
            var base1 = new ObjectBase();
            base1.deserialize(resultb);
            console.assert(base.id == base1.id);


            var c = new C();
            c.id = Math.random();
            c.a = Math.random();
            c.c = Math.random();
            var result = c.serialize();
            var c1 = new C();
            c1.deserialize(result);
            console.assert(c.id == c1.id);
            console.assert(c.a == c1.a);
            console.assert(c.c == c1.c);
        }
    }

}