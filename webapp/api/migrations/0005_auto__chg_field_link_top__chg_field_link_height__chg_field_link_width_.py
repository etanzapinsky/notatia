# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):

        # Changing field 'Link.top'
        db.alter_column(u'api_link', 'top', self.gf('django.db.models.fields.SmallIntegerField')(null=True))

        # Changing field 'Link.height'
        db.alter_column(u'api_link', 'height', self.gf('django.db.models.fields.SmallIntegerField')(null=True))

        # Changing field 'Link.width'
        db.alter_column(u'api_link', 'width', self.gf('django.db.models.fields.SmallIntegerField')(null=True))

        # Changing field 'Link.left'
        db.alter_column(u'api_link', 'left', self.gf('django.db.models.fields.SmallIntegerField')(null=True))

    def backwards(self, orm):

        # Changing field 'Link.top'
        db.alter_column(u'api_link', 'top', self.gf('django.db.models.fields.SmallIntegerField')(default=None))

        # Changing field 'Link.height'
        db.alter_column(u'api_link', 'height', self.gf('django.db.models.fields.SmallIntegerField')(default=None))

        # Changing field 'Link.width'
        db.alter_column(u'api_link', 'width', self.gf('django.db.models.fields.SmallIntegerField')(default=None))

        # Changing field 'Link.left'
        db.alter_column(u'api_link', 'left', self.gf('django.db.models.fields.SmallIntegerField')(default=None))

    models = {
        u'api.capsule': {
            'Meta': {'object_name': 'Capsule'},
            'authors': ('django.db.models.fields.related.ManyToManyField', [], {'to': u"orm['auth.User']", 'symmetrical': 'False'}),
            'first_created': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'last_modified': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'blank': 'True'}),
            'links': ('django.db.models.fields.related.ManyToManyField', [], {'related_name': "'capsule_links'", 'symmetrical': 'False', 'to': u"orm['api.Link']"}),
            'path': ('django.db.models.fields.CharField', [], {'max_length': '1024', 'blank': 'True'}),
            'tags': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            'text': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            'title': ('django.db.models.fields.CharField', [], {'max_length': '100', 'blank': 'True'})
        },
        u'api.link': {
            'Meta': {'object_name': 'Link'},
            'capsule': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['api.Capsule']"}),
            'height': ('django.db.models.fields.SmallIntegerField', [], {'default': 'None', 'null': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'left': ('django.db.models.fields.SmallIntegerField', [], {'default': 'None', 'null': 'True'}),
            'top': ('django.db.models.fields.SmallIntegerField', [], {'default': 'None', 'null': 'True'}),
            'width': ('django.db.models.fields.SmallIntegerField', [], {'default': 'None', 'null': 'True'})
        },
        u'auth.group': {
            'Meta': {'object_name': 'Group'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '80'}),
            'permissions': ('django.db.models.fields.related.ManyToManyField', [], {'to': u"orm['auth.Permission']", 'symmetrical': 'False', 'blank': 'True'})
        },
        u'auth.permission': {
            'Meta': {'ordering': "(u'content_type__app_label', u'content_type__model', u'codename')", 'unique_together': "((u'content_type', u'codename'),)", 'object_name': 'Permission'},
            'codename': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'content_type': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['contenttypes.ContentType']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '50'})
        },
        u'auth.user': {
            'Meta': {'object_name': 'User'},
            'date_joined': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            'email': ('django.db.models.fields.EmailField', [], {'max_length': '75', 'blank': 'True'}),
            'first_name': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True'}),
            'groups': ('django.db.models.fields.related.ManyToManyField', [], {'to': u"orm['auth.Group']", 'symmetrical': 'False', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'is_active': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'is_staff': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'is_superuser': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'last_login': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            'last_name': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True'}),
            'password': ('django.db.models.fields.CharField', [], {'max_length': '128'}),
            'user_permissions': ('django.db.models.fields.related.ManyToManyField', [], {'to': u"orm['auth.Permission']", 'symmetrical': 'False', 'blank': 'True'}),
            'username': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '30'})
        },
        u'contenttypes.contenttype': {
            'Meta': {'ordering': "('name',)", 'unique_together': "(('app_label', 'model'),)", 'object_name': 'ContentType', 'db_table': "'django_content_type'"},
            'app_label': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'model': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'})
        }
    }

    complete_apps = ['api']