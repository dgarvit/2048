# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0003_auto_20170716_2004'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='highscore',
            name='user',
        ),
        migrations.DeleteModel(
            name='HighScore',
        ),
    ]
