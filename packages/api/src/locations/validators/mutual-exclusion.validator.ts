import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'mutualExclusion', async: false })
export class MutualExclusionConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const object = args.object as any;
    const properties = args.constraints as string[];

    // Count how many of the specified properties are truthy
    const definedProperties = properties.filter(
      (prop) => object[prop] !== undefined && object[prop] !== null,
    );

    // If no properties are defined, that's valid (optional region)
    // If exactly one property is defined, that's valid
    // If more than one property is defined, that's invalid
    return definedProperties.length <= 1;
  }

  defaultMessage(args: ValidationArguments) {
    const properties = args.constraints as string[];
    return `Only one of the following properties can be provided: ${properties.join(', ')}`;
  }
}

export function MutualExclusion(
  properties: string[],
  validationOptions?: ValidationOptions,
) {
  return function (target: any) {
    registerDecorator({
      target: target,
      propertyName: undefined,
      options: validationOptions,
      constraints: properties,
      validator: MutualExclusionConstraint,
    });
  };
}
