import { forwardRef } from 'react';
import { Text as DefaultText, TextProps } from 'react-native';

import { cn } from '../lib/utils';

const Text = forwardRef<React.ElementRef<typeof DefaultText>, TextProps>(
    ({ className, ...props }, ref) => (
        <DefaultText
            {...props}
            className={cn('font-ms500', className)}
        >
            {props.children}
        </DefaultText>
    )
);

export { Text };
