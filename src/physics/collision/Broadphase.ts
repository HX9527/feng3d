namespace CANNON
{
    export class Broadphase
    {
        /**
         * 得到物理世界中所有的碰撞对
         * 
         * @param world
         * @param pairs1
         * @param pairs2
         */
        collisionPairs(world: World, pairs1: Body[], pairs2: Body[])
        {
            for (var i = 0, n = world.bodies.length; i < n; i++)
            {
                for (var j = 0; j < i; j++)
                {
                    var bi = world.bodies[i];
                    var bj = world.bodies[j];

                    if (!this.needBroadphaseCollision(bi, bj))
                    {
                        continue;
                    }

                    this.doBoundingSphereBroadphase(bi, bj, pairs1, pairs2);
                }
            }
        }

        /**
         * 是否需要碰撞检测
         * 
         * @param bodyA
         * @param bodyB
         */
        needBroadphaseCollision(bodyA: Body, bodyB: Body)
        {
            // 检查冲突过滤器掩码
            if ((bodyA.collisionFilterGroup & bodyB.collisionFilterMask) === 0 || (bodyB.collisionFilterGroup & bodyA.collisionFilterMask) === 0)
            {
                return false;
            }

            if (((bodyA.type & Body.STATIC) !== 0 || bodyA.sleepState === Body.SLEEPING) &&
                ((bodyB.type & Body.STATIC) !== 0 || bodyB.sleepState === Body.SLEEPING))
            {
                return false;
            }

            return true;
        }

        /**
         * 检查两个物体的边界球是否相交。
         * 
         * @param bodyA
         * @param bodyB
         * @param pairs1
         * @param pairs2
         */
        doBoundingSphereBroadphase(bodyA: Body, bodyB: Body, pairs1: Body[], pairs2: Body[])
        {
            var r = bodyB.position.subTo(bodyA.position);
            var boundingRadiusSum2 = Math.pow(bodyA.boundingRadius + bodyB.boundingRadius, 2);
            var norm2 = r.lengthSquared;
            if (norm2 < boundingRadiusSum2)
            {
                pairs1.push(bodyA);
                pairs2.push(bodyB);
            }
        }

        /**
         * 从对数组中删除重复的对。
         * 
         * @param pairs1
         * @param pairs2
         */
        makePairsUnique(pairs1: any[], pairs2: any[])
        {
            var t: { keys: string[] } = { keys: [] };
            var p1 = pairs1.concat();
            var p2 = pairs2.concat();
            var N = pairs1.length;

            pairs1.length = 0;
            pairs2.length = 0;

            for (var i = 0; i !== N; i++)
            {
                var id1 = p1[i].id,
                    id2 = p2[i].id;
                var key = id1 < id2 ? id1 + "," + id2 : id2 + "," + id1;
                t[key] = i;
                t.keys.push(key);
            }

            for (var i = 0; i !== t.keys.length; i++)
            {
                var key = t.keys.pop();
                var pairIndex = t[key];
                pairs1.push(p1[pairIndex]);
                pairs2.push(p2[pairIndex]);
                delete t[key];
            }
        }

        /**
         * 获取包围盒内所有物体
         * @param world
         * @param aabb
         * @param result
         */
        aabbQuery(world: World, aabb: feng3d.AABB, result: Body[] = [])
        {
            for (var i = 0; i < world.bodies.length; i++)
            {
                var b = world.bodies[i];

                if (b.aabbNeedsUpdate)
                {
                    b.computeAABB();
                }

                if (b.aabb.intersects(aabb))
                {
                    result.push(b);
                }
            }

            return result;
        }
    }
}