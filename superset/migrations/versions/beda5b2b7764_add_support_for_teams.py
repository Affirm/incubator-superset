"""Add support for teams

Revision ID: beda5b2b7764
Revises: 57c7ad19ce97
Create Date: 2018-01-27 21:27:53.821148

"""

# revision identifiers, used by Alembic.
revision = 'beda5b2b7764'
down_revision = 'f231d82b9b26'

from alembic import op
import sqlalchemy as sa


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('teams',
    sa.Column('created_on', sa.DateTime(), nullable=True),
    sa.Column('changed_on', sa.DateTime(), nullable=True),
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=25), nullable=True),
    sa.Column('email', sa.String(length=80), nullable=True),
    sa.Column('notes', sa.Text(), nullable=True),
    sa.Column('changed_by_fk', sa.Integer(), nullable=True),
    sa.Column('created_by_fk', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['changed_by_fk'], [u'ab_user.id'], ),
    sa.ForeignKeyConstraint(['created_by_fk'], [u'ab_user.id'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('name')
    )
    op.create_table('dashboard_team',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('team_id', sa.Integer(), nullable=True),
    sa.Column('dashboard_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['dashboard_id'], [u'dashboards.id'], ),
    sa.ForeignKeyConstraint(['team_id'], [u'teams.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('slice_team',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('team_id', sa.Integer(), nullable=True),
    sa.Column('slice_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['slice_id'], [u'slices.id'], ),
    sa.ForeignKeyConstraint(['team_id'], [u'teams.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('team_members',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('team_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['team_id'], [u'teams.id'], ),
    sa.ForeignKeyConstraint(['user_id'], [u'ab_user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('team_members')
    op.drop_table('slice_team')
    op.drop_table('dashboard_team')
    op.drop_table('teams')
    # ### end Alembic commands ###
