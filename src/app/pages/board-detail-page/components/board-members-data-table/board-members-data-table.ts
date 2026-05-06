import { Component, computed, inject, signal } from '@angular/core';
import {
	type ColumnDef,
	createAngularTable,
	flexRenderComponent,
	FlexRenderDirective,
	getCoreRowModel,
} from '@tanstack/angular-table';
import { BoardDetailStateService } from '../../../../services/board-detail-state.service';
import { BoardPermissionsService } from '../../../../services/board-permissions.service';
import { AuthSessionService } from '../../../../services/auth-session.service';
import { BoardMemberResponseDto } from '../../../../api/generated/model';
import { BoardMemberActions } from '../board-member-actions/board-member-actions';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmTableImports } from '@spartan-ng/helm/table';

@Component({
  selector: 'board-members-data-table',
  imports: [HlmTableImports, FlexRenderDirective, HlmButtonImports],
  templateUrl: './board-members-data-table.html',
})
export class BoardMembersDataTable {
  private readonly boardDetailStateService = inject(BoardDetailStateService);
  private readonly boardPermissionsService = inject(BoardPermissionsService);
  private readonly authSessionService = inject(AuthSessionService);

  readonly boardId = this.boardDetailStateService.boardId;
  readonly userId = computed(() => {
    return this.authSessionService.user()?.id;
  })

  readonly pageSize = signal(5);
  readonly currentPage = signal(0);

  readonly isDeleting = signal<boolean>(false);

  readonly canRemoveMember = computed(() =>
    this.boardPermissionsService.hasRole(this.boardId(), 'admin')
  );

  readonly boardMembers = this.boardDetailStateService.boardMembers;

  readonly totalPages = computed(() =>
    Math.ceil((this.boardMembers.value()?.length ?? 0) / this.pageSize())
  );

  readonly paginatedMembers = computed(() => {
    const members = this.boardMembers.value() ?? [];
    const start = this.currentPage() * this.pageSize();
    return members.slice(start, start + this.pageSize());
  });

  nextPage() { this.currentPage.update(p => p + 1); }
  prevPage() { this.currentPage.update(p => p - 1); }

  readonly loggedUserIsOwner = computed(() => {
    const userId = this.userId();
    if (userId == null) return false;

    return this.boardMembers.value()?.some(
      (bm) => bm.user?.id === userId && bm.owner
    ) ?? false;
  });

  readonly columns = computed<ColumnDef<BoardMemberResponseDto>[]>(() => {
    const userId = this.userId();

    const base: ColumnDef<BoardMemberResponseDto>[] = [
      {
        id: 'avatar',
        header: '',
        cell: (info) => {
          const avatarUrl = info.row.original.user?.profile?.avatar;
          const name = info.row.original.user?.profile?.avatar ?? 'U';

          if (avatarUrl) {
            return `<img src="${avatarUrl}" alt="${name}" class="h-8 w-8 rounded-full object-cover" />`;
          }
          return `
            <span class="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-medium uppercase">
              ${name[0]}
            </span>
          `;
        },
      },
      {
        accessorKey: 'user.profile.name',
        header: 'Name',
        cell: (info) =>
          `<span class="block max-w-36 truncate sm:max-w-52">
            ${info.getValue<string>()}
          </span>`,
      },
      {
        accessorKey: 'user.email',
        header: 'Email',
        cell: (info) =>
          `<span class="block max-w-36 truncate sm:max-w-52">
            ${info.getValue<string>()}
          </span>`,
      },
      {
        accessorKey: 'boardRole.name',
        header: 'Board Role',
        cell: (info) => {
          const isOwner = info.row.original.owner;
          return (`<span class="block max-w-36 truncate sm:max-w-52">
            ${isOwner ? 'owner' : info.getValue<string>()}
          </span>`);
        }
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: (info) => {
          const memberId = info.row.original.user?.id;
          const boardRole = info.row.original.boardRole?.name;

          const isSelf = userId != null && memberId === userId;
          const targetIsOwner = !!info.row.original.owner;
          const targetRole = info.row.original.boardRole?.name;

          if (isSelf || targetIsOwner || targetRole == null) return '';

          const canRemove = targetRole === 'member' || (targetRole === 'admin' && this.loggedUserIsOwner());

          return flexRenderComponent(BoardMemberActions, {
            inputs: { boardRole, canRemove, memberId, loggedUserIsOwner: this.loggedUserIsOwner()}
          });
        },
      },
    ];

    return base;
  });

  readonly table = createAngularTable<BoardMemberResponseDto>(() => ({
    data: this.paginatedMembers(),
    columns: this.columns(),
    getCoreRowModel: getCoreRowModel(),
  }));
}
