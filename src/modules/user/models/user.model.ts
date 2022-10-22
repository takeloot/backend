import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { UserRole } from '@prisma/client';

registerEnumType(UserRole, {
  name: 'UserRole',
});

@ObjectType()
export class Profile {
  @Field()
  id: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  avatar?: string;

  @Field()
  provider: string;

  @Field()
  serviceId: string;
}

@ObjectType()
export class User {
  @Field()
  id: string;

  @Field({ nullable: true })
  name?: string;

  @Field(() => UserRole, { defaultValue: UserRole.USER })
  role: UserRole;

  @Field({ nullable: true })
  avatar?: string;

  @Field({ nullable: true })
  tradeUrl?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => [Profile], { nullable: true })
  profiles?: Profile[];
}
