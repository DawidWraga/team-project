import {
  Avatar,
  AvatarGroup,
  AvatarGroupProps,
  AvatarProps,
  Box,
  Tooltip,
  TooltipProps,
} from '@chakra-ui/react';
import { User } from '@prisma/client';

interface IProps {
  users: User[];
  avatarGroupProps?: Omit<AvatarGroupProps, 'children'>;
  tooltipProps?: TooltipProps;
  avatarProps?: AvatarProps;
}

export function CustomAvatarGroup(props: IProps) {
  const { users, avatarGroupProps, tooltipProps, avatarProps } = props;

  return (
    <>
      <AvatarGroup size="xs" max={5} alignContent="left" gap="1" {...avatarGroupProps}>
        {users?.map((user) => {
          return (
            <Tooltip key={user.id} label={user.fullName} {...tooltipProps}>
              <span>
                <Avatar
                  size="xs"
                  borderColor="grey.50"
                  name={user.fullName}
                  autoCapitalize={'true'}
                  {...avatarProps}
                />
              </span>
            </Tooltip>
          );
        })}
      </AvatarGroup>
    </>
  );
}
